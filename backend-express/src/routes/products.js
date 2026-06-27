const router = require('express').Router()
const slugify = require('slugify')
const Product = require('../models/Product')
const VendorProfile = require('../models/VendorProfile')
const { protect, role } = require('../middleware/auth')

const populate = [
  { path: 'vendorId', model: 'VendorProfile', select: 'store_name store_slug' },
  { path: 'categoryId', model: 'Category', select: 'name slug' },
  { path: 'brandId', model: 'Brand', select: 'name slug' },
]

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { search, category_id, brand_id, vendor_id, min_price, max_price, sort = 'createdAt', direction = 'desc', per_page = 15, page = 1 } = req.query
    const query = { is_active: true }
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }]
    if (category_id) query.categoryId = category_id
    if (brand_id) query.brandId = brand_id
    if (vendor_id) query.vendorId = vendor_id
    if (min_price) query.price = { $gte: +min_price }
    if (max_price) query.price = { ...query.price, $lte: +max_price }

    const sortObj = { [sort === 'created_at' ? 'createdAt' : sort]: direction === 'asc' ? 1 : -1 }
    const total = await Product.countDocuments(query)
    const products = await Product.find(query).populate(populate).sort(sortObj).skip((page - 1) * per_page).limit(+per_page)

    res.json({ data: products, total, per_page: +per_page, current_page: +page, last_page: Math.ceil(total / per_page) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ is_featured: true, is_active: true }).populate(populate).limit(8)
    res.json(products)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(populate)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/products (vendor)
router.post('/', protect, role('vendor'), async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: req.user._id })
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' })
    if (!vendor.is_approved) return res.status(403).json({ message: 'Your store is not approved yet' })

    const { name, price, quantity } = req.body
    if (!name || !price || quantity === undefined) return res.status(422).json({ message: 'Name, price and quantity are required' })

    let slug = slugify(name, { lower: true, strict: true })
    let i = 1
    while (await Product.findOne({ slug })) slug = slugify(name, { lower: true, strict: true }) + '-' + i++

    const product = await Product.create({ ...req.body, vendorId: vendor._id, slug, in_stock: quantity > 0 })
    res.status(201).json(await product.populate(populate))
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PUT /api/products/:id (vendor)
router.put('/:id', protect, role('vendor'), async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: req.user._id })
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (String(product.vendorId) !== String(vendor?._id)) return res.status(403).json({ message: 'Unauthorized' })

    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true, strict: true })
    if (req.body.quantity !== undefined) req.body.in_stock = req.body.quantity > 0

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(populate)
    res.json(updated)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/products/:id (vendor)
router.delete('/:id', protect, role('vendor'), async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: req.user._id })
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (String(product.vendorId) !== String(vendor?._id)) return res.status(403).json({ message: 'Unauthorized' })
    await product.deleteOne()
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/vendor/products
router.get('/vendor/my', protect, role('vendor'), async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: req.user._id })
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' })
    const products = await Product.find({ vendorId: vendor._id }).populate(populate)
    res.json({ data: products })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/products/:productId/reviews
router.get('/:productId/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review')
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name')
    res.json(reviews)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/products/:productId/reviews
router.post('/:productId/reviews', protect, async (req, res) => {
  try {
    const Review = require('../models/Review')
    const { rating, title, comment } = req.body
    if (!rating) return res.status(422).json({ message: 'Rating is required' })
    const review = await Review.create({ productId: req.params.productId, userId: req.user._id, rating, title, comment })

    const reviews = await Review.find({ productId: req.params.productId })
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await Product.findByIdAndUpdate(req.params.productId, { avg_rating: avg.toFixed(2), reviews_count: reviews.length })

    res.status(201).json(review)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
