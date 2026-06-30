const router = require('express').Router()
const User = require('../../models/User')
const VendorProfile = require('../../models/VendorProfile')
const Product = require('../../models/Product')
const Order = require('../../models/Order')
const Banner = require('../../models/Banner')
const ContactInquiry = require('../../models/ContactInquiry')
const Setting = require('../../models/Setting')
const Dispute = require('../../models/Dispute')
const slugify = require('slugify')

// ── DASHBOARD ──────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalProducts, totalOrders, pendingOrders] = await Promise.all([
      User.countDocuments(),
      VendorProfile.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
    ])
    const paidOrders = await Order.find({ payment_status: 'paid' })
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0)
    const recentOrders = await Order.find().populate('userId', 'name email').sort('-createdAt').limit(10)
    const pendingVendors = await VendorProfile.find({ is_approved: false }).populate('userId', 'name email')

    const now = new Date()
    const monthlyRevenue = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('en-US', { month: 'short' })
      const orders = await Order.find({ payment_status: 'paid', createdAt: { $gte: d, $lt: new Date(d.getFullYear(), d.getMonth() + 1, 1) } })
      monthlyRevenue.push({ month: label, revenue: +orders.reduce((s, o) => s + o.total, 0).toFixed(2) })
    }

    // Orders grouped by status — for the dashboard bar chart
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const statusCounts = await Promise.all(statuses.map(s => Order.countDocuments({ status: s })))
    const ordersByStatus = statuses.map((label, i) => ({ label, value: statusCounts[i] }))

    // Users grouped by role — for the dashboard donut chart
    const roles = ['customer', 'vendor', 'super-admin']
    const roleCounts = await Promise.all(roles.map(r => User.countDocuments({ role: r })))
    const usersByRole = roles.map((label, i) => ({ label, value: roleCounts[i] }))

    const openDisputes = await Dispute.countDocuments({ status: { $in: ['open', 'in_progress'] } })

    res.json({
      stats: { totalUsers, totalVendors, totalProducts, totalOrders, pendingOrders, totalRevenue, openDisputes },
      recentOrders, pendingVendors, monthlyRevenue, ordersByStatus, usersByRole,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── USERS ──────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const page = +req.query.page || 1
    const limit = +req.query.per_page || 15
    const users = await User.find().select('-password').sort('-createdAt').skip((page - 1) * limit).limit(limit)
    const total = await User.countDocuments()
    res.json({ data: users.map(u => u.toAuthJSON()), total, current_page: page, last_page: Math.ceil(total / limit) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user: user.toAuthJSON() })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Suspend / un-suspend any account (blocks login + all API access while suspended)
router.patch('/users/:id/suspend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role === 'super-admin') return res.status(403).json({ message: 'Cannot suspend an admin' })
    user.is_suspended = req.body.suspend !== undefined ? !!req.body.suspend : !user.is_suspended
    await user.save()
    res.json({ message: user.is_suspended ? 'Account suspended' : 'Account reactivated', user: user.toAuthJSON() })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── VENDORS ────────────────────────────────────────────
router.get('/vendors', async (req, res) => {
  try {
    const page = +req.query.page || 1
    const limit = +req.query.per_page || 15
    const filter = {}
    if (req.query.status === 'pending') filter.is_approved = false
    if (req.query.status === 'approved') filter.is_approved = true

    const profiles = await VendorProfile.find(filter).populate('userId', 'name email is_suspended').sort('is_approved').skip((page - 1) * limit).limit(limit)
    const total = await VendorProfile.countDocuments(filter)

    const vendorUserIds = profiles.map(p => p.userId?._id)
    const noProfileVendors = await User.find({ role: 'vendor', _id: { $nin: vendorUserIds } }).select('name email createdAt')

    res.json({
      // `user` is exposed automatically via the VendorProfile toJSON transform
      profiles: { data: profiles, total, current_page: page, last_page: Math.ceil(total / limit) },
      no_profile_vendors: noProfileVendors.map(u => ({ user_id: u._id, user: { name: u.name, email: u.email }, created_at: u.createdAt }))
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Full profile of a single vendor + their products/orders/revenue ("all data about vendor")
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id).populate('userId', 'name email is_suspended createdAt')
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' })

    const products = await Product.find({ vendorId: vendor._id }).sort('-createdAt')
    const orders = await Order.find({ 'items.vendorId': vendor._id }).populate('userId', 'name').sort('-createdAt')
    const revenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0)
    const openDisputes = await Dispute.countDocuments({ vendorId: vendor._id, status: { $in: ['open', 'in_progress'] } })

    res.json({
      vendor,
      stats: { totalProducts: products.length, totalOrders: orders.length, revenue, openDisputes },
      products,
      recentOrders: orders.slice(0, 10),
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/vendors/:id/approve', async (req, res) => {
  try {
    const vendor = await VendorProfile.findByIdAndUpdate(
      req.params.id, { is_approved: true, status: 'approved', rejection_reason: undefined }, { new: true }
    ).populate('userId', 'name email')
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
    res.json({ message: 'Vendor approved', vendor })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/vendors/:id/reject', async (req, res) => {
  try {
    const vendor = await VendorProfile.findByIdAndUpdate(
      req.params.id, { is_approved: false, status: 'rejected', rejection_reason: req.body.reason || '' }, { new: true }
    ).populate('userId', 'name email')
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
    res.json({ message: 'Vendor request rejected', vendor })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Backwards-compatible alias used by the existing "ban" button — revokes selling rights
router.patch('/vendors/:id/ban', async (req, res) => {
  try {
    const vendor = await VendorProfile.findByIdAndUpdate(
      req.params.id, { is_approved: false, status: 'rejected' }, { new: true }
    ).populate('userId', 'name email')
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
    res.json({ message: 'Vendor banned', vendor })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── PRODUCTS ───────────────────────────────────────────
router.get('/all-products', async (req, res) => {
  try {
    const page = +req.query.page || 1
    const limit = +req.query.per_page || 15
    const filter = {}
    if (req.query.search) filter.name = new RegExp(req.query.search, 'i')
    if (req.query.is_active !== undefined) filter.is_active = req.query.is_active === 'true'

    const products = await Product.find(filter)
      .populate('vendorId', 'store_name').populate('categoryId', 'name').populate('brandId', 'name')
      .skip((page - 1) * limit).limit(limit)
    const total = await Product.countDocuments(filter)
    res.json({ data: products, total, current_page: page, last_page: Math.ceil(total / limit) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/products/:id/toggle-active', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    product.is_active = !product.is_active
    await product.save()
    res.json({ message: 'Status updated', product })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── ORDERS ─────────────────────────────────────────────
router.get('/all-orders', async (req, res) => {
  try {
    const page = +req.query.page || 1
    const limit = +req.query.per_page || 20
    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const orders = await Order.find(filter).populate('userId', 'name email').populate('shippingAddressId').sort('-createdAt').skip((page - 1) * limit).limit(limit)
    const total = await Order.countDocuments(filter)
    res.json({ data: orders, total, current_page: page, last_page: Math.ceil(total / limit) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── BANNERS ────────────────────────────────────────────
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort('sort_order')
    res.json({ data: banners })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/banners', async (req, res) => {
  try {
    const banner = await Banner.create(req.body)
    res.status(201).json({ banner })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/banners/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!banner) return res.status(404).json({ message: 'Banner not found' })
    res.json({ banner })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/banners/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── CONTACT INQUIRIES ──────────────────────────────────
router.get('/contact-inquiries', async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort('-createdAt')
    res.json({ data: inquiries })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/contact-inquiries/:id/resolve', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, { is_resolved: true, resolved_at: new Date() }, { new: true })
    res.json({ inquiry })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── DISPUTES (oversight) ───────────────────────────────
router.get('/disputes', async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const disputes = await Dispute.find(filter)
      .populate('customerId', 'name email')
      .populate('vendorId', 'store_name')
      .sort('-createdAt')
    res.json({ data: disputes })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── SETTINGS ───────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.find()
    res.json({ data: settings })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/settings', async (req, res) => {
  try {
    const { key, value, type } = req.body
    const setting = await Setting.findOneAndUpdate({ key }, { value, type }, { upsert: true, new: true })
    res.json({ setting })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
