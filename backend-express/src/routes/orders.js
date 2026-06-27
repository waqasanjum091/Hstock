const router = require('express').Router()
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const VendorProfile = require('../models/VendorProfile')

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    let query = {}
    if (req.user.role === 'customer') query.userId = req.user._id
    else if (req.user.role === 'vendor') {
      const vendor = await VendorProfile.findOne({ userId: req.user._id })
      query['items.vendorId'] = vendor?._id
    }
    if (req.query.status) query.status = req.query.status
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('shippingAddressId')
      .sort('-createdAt').limit(50)
    res.json({ data: orders })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email').populate('shippingAddressId')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (req.user.role === 'customer' && String(order.userId._id) !== String(req.user._id))
      return res.status(403).json({ message: 'Unauthorized' })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    if (!['vendor', 'super-admin'].includes(req.user.role))
      return res.status(403).json({ message: 'Unauthorized' })
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PATCH /api/orders/:id/tracking
router.patch('/:id/tracking', async (req, res) => {
  try {
    if (!['vendor', 'super-admin'].includes(req.user.role))
      return res.status(403).json({ message: 'Unauthorized' })
    const order = await Order.findByIdAndUpdate(req.params.id, { tracking_number: req.body.tracking_number }, { new: true })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PATCH /api/orders/:id/payment-status
router.patch('/:id/payment-status', async (req, res) => {
  try {
    if (req.user.role !== 'super-admin') return res.status(403).json({ message: 'Unauthorized' })
    const order = await Order.findByIdAndUpdate(req.params.id, { payment_status: req.body.payment_status }, { new: true })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
