const router = require('express').Router()
const slugify = require('slugify')
const VendorProfile = require('../models/VendorProfile')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { protect, role } = require('../middleware/auth')

router.use(protect, role('vendor'))

// GET /api/vendor-profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'No profile found' })
    res.json(profile)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/vendor-profile
router.post('/profile', async (req, res) => {
  try {
    const existing = await VendorProfile.findOne({ userId: req.user._id })
    if (existing) return res.status(422).json({ message: 'You already have a store profile.' })

    const { store_name } = req.body
    if (!store_name) return res.status(422).json({ message: 'Store name is required' })

    let slug = slugify(store_name, { lower: true, strict: true })
    let i = 1
    while (await VendorProfile.findOne({ store_slug: slug })) slug = slugify(store_name, { lower: true, strict: true }) + '-' + i++

    const profile = await VendorProfile.create({ ...req.body, userId: req.user._id, store_slug: slug, is_approved: false })
    res.status(201).json(profile)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PUT /api/vendor-profile
router.put('/profile', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found. Create one first.' })

    const allowed = ['store_name', 'description', 'logo', 'banner', 'address', 'phone']
    const updates = {}
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })
    if (updates.store_name) updates.store_slug = slugify(updates.store_name, { lower: true, strict: true })

    const updated = await VendorProfile.findByIdAndUpdate(profile._id, updates, { new: true })
    res.json(updated)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/vendor/products
router.get('/products', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found' })
    const products = await Product.find({ vendorId: profile._id })
      .populate('categoryId', 'name').populate('brandId', 'name')
    res.json({ data: products })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/vendor/orders
router.get('/orders', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found' })
    const orders = await Order.find({ 'items.vendorId': profile._id })
      .populate('userId', 'name email').populate('shippingAddressId').sort('-createdAt')
    res.json({ data: orders })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/vendor/stats
router.get('/stats', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found' })

    const totalProducts = await Product.countDocuments({ vendorId: profile._id })
    const orders = await Order.find({ 'items.vendorId': profile._id })
    const totalOrders = orders.length
    const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0)
    const recentOrders = await Order.find({ 'items.vendorId': profile._id }).populate('userId', 'name').sort('-createdAt').limit(10)

    res.json({ stats: { totalProducts, totalOrders, totalRevenue }, recentOrders })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
