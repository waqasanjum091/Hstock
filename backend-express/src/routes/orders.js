const router = require('express').Router()
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const VendorProfile = require('../models/VendorProfile')
const { protect, role } = require('../middleware/auth')

router.use(protect)

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
    const orders = await Order.find(query).populate('userId', 'name email').populate('shippingAddressId').sort('-createdAt').limit(50)
    res.json({ data: orders })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('shippingAddressId')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (req.user.role === 'customer' && String(order.userId._id) !== String(req.user._id))
      return res.status(403).json({ message: 'Unauthorized' })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { shipping_address_id, payment_method, notes } = req.body
    if (!shipping_address_id || !payment_method) return res.status(422).json({ message: 'Shipping address and payment method required' })

    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId')
    if (!cartItems.length) return res.status(422).json({ message: 'Cart is empty' })

    let subtotal = 0
    const items = []
    for (const item of cartItems) {
      const product = item.productId
      if (!product || !product.in_stock || product.quantity < item.quantity)
        return res.status(422).json({ message: `${product?.name || 'A product'} is out of stock` })

      const price = product.discount_price || product.price
      const total = price * item.quantity
      subtotal += total
      items.push({ productId: product._id, vendorId: product.vendorId, product_name: product.name, price, quantity: item.quantity, total })

      await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -item.quantity } })
    }

    const tax = +(subtotal * 0.1).toFixed(2)
    const shipping_cost = subtotal > 100 ? 0 : 10
    const total = +(subtotal + tax + shipping_cost).toFixed(2)

    const order = await Order.create({ userId: req.user._id, shippingAddressId: shipping_address_id, items, subtotal, tax, shipping_cost, total, payment_method, notes })
    await Cart.deleteMany({ userId: req.user._id })

    res.status(201).json(await order.populate('shippingAddressId'))
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    if (!['vendor', 'super-admin'].includes(req.user.role)) return res.status(403).json({ message: 'Unauthorized' })
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PATCH /api/orders/:id/tracking
router.patch('/:id/tracking', async (req, res) => {
  try {
    if (!['vendor', 'super-admin'].includes(req.user.role)) return res.status(403).json({ message: 'Unauthorized' })
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

// GET /api/vendor/orders
router.get('/vendor/orders', role('vendor'), async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: req.user._id })
    const orders = await Order.find({ 'items.vendorId': vendor?._id }).populate('userId', 'name email').populate('shippingAddressId').sort('-createdAt')
    res.json({ data: orders })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
