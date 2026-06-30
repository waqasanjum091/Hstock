require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// ── Middleware ─────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// ── DB ─────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1) })

// ── Auth middleware for protected groups ───────────────
const { protect, role } = require('./middleware/auth')

// ── Public routes ──────────────────────────────────────
const Category = require('./models/Category')
const Brand = require('./models/Brand')
const Banner = require('./models/Banner')
const ContactInquiry = require('./models/ContactInquiry')
const VendorProfile = require('./models/VendorProfile')

app.use('/api', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))

app.get('/api/categories', async (req, res) => {
  const cats = await Category.find({ is_active: true })
  res.json(cats)
})
app.get('/api/brands', async (req, res) => {
  const brands = await Brand.find({ is_active: true })
  res.json(brands)
})
app.get('/api/banners', async (req, res) => {
  const banners = await Banner.find({ is_active: true }).sort('sort_order')
  res.json(banners)
})
app.get('/api/vendors/:slug', async (req, res) => {
  const vendor = await VendorProfile.findOne({ store_slug: req.params.slug }).populate('userId', 'name email')
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
  res.json(vendor)
})
app.post('/api/contact', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.create(req.body)
    res.status(201).json({ message: 'Message sent', inquiry })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── Protected routes ───────────────────────────────────
app.use('/api/cart', require('./routes/cart'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/shipping-addresses', require('./routes/addresses'))

// Checkout
const Cart = require('./models/Cart')
const Product = require('./models/Product')
const Order = require('./models/Order')
const ShippingAddress = require('./models/ShippingAddress')

// POST /api/checkout
app.post('/api/checkout', protect, async (req, res) => {
  try {
    const { shipping_address_id, payment_method, notes } = req.body
    if (!shipping_address_id || !payment_method)
      return res.status(422).json({ message: 'Shipping address and payment method are required' })

    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId')
    if (!cartItems.length) return res.status(422).json({ message: 'Cart is empty' })

    let subtotal = 0
    const items = []
    for (const item of cartItems) {
      const p = item.productId
      if (!p || !p.in_stock || p.quantity < item.quantity)
        return res.status(422).json({ message: `${p?.name || 'A product'} is out of stock` })
      const price = p.discount_price || p.price
      const total = price * item.quantity
      subtotal += total
      items.push({ productId: p._id, vendorId: p.vendorId, product_name: p.name, price, quantity: item.quantity, total })
      await Product.findByIdAndUpdate(p._id, { $inc: { quantity: -item.quantity } })
    }

    const tax = +(subtotal * 0.1).toFixed(2)
    const shipping_cost = subtotal > 100 ? 0 : 10
    const total = +(subtotal + tax + shipping_cost).toFixed(2)

    const order = await Order.create({
      userId: req.user._id, shippingAddressId: shipping_address_id,
      items, subtotal, tax, shipping_cost, total, payment_method, notes
    })
    await Cart.deleteMany({ userId: req.user._id })
    res.status(201).json(await order.populate('shippingAddressId'))
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Orders
const ordersRouter = require('./routes/orders')
app.use('/api/orders', protect, ordersRouter)

// Chat (any authenticated user) & disputes
app.use('/api/conversations', protect, require('./routes/conversations'))
app.use('/api/disputes', protect, require('./routes/disputes'))

// Vendor profile CRUD
app.use('/api/vendor-profile', protect, role('vendor'), require('./routes/vendorProfile'))

// Vendor dashboard routes
app.use('/api/vendor', protect, role('vendor'), require('./routes/vendor'))

// Admin routes
app.use('/api/admin', protect, role('super-admin'), require('./routes/admin/index'))

// Health check
app.get('/up', (req, res) => res.json({ status: 'up' }))
app.get('/api/up', (req, res) => res.json({ status: 'up' }))

// 404
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.path} not found` }))

// ── Start ──────────────────────────────────────────────
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
