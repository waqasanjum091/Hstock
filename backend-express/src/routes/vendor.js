const router = require('express').Router()
const VendorProfile = require('../models/VendorProfile')
const Product = require('../models/Product')
const Order = require('../models/Order')

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
    const recentOrders = await Order.find({ 'items.vendorId': profile._id })
      .populate('userId', 'name').sort('-createdAt').limit(10)

    res.json({ stats: { totalProducts, totalOrders, totalRevenue }, recentOrders })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
