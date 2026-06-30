const router = require('express').Router()
const VendorProfile = require('../models/VendorProfile')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Dispute = require('../models/Dispute')

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
    const openDisputes = await Dispute.countDocuments({ vendorId: profile._id, status: { $in: ['open', 'in_progress'] } })
    const recentOrders = await Order.find({ 'items.vendorId': profile._id })
      .populate('userId', 'name').sort('-createdAt').limit(10)

    // Last 6 months of sales (count of this vendor's orders) — for the dashboard chart.
    const now = new Date()
    const monthlySales = []
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const count = orders.filter(o => o.createdAt >= start && o.createdAt < end).length
      monthlySales.push({ month: start.toLocaleString('en-US', { month: 'short' }), value: count })
    }

    res.json({ stats: { totalProducts, totalOrders, totalRevenue, openDisputes }, recentOrders, monthlySales })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
