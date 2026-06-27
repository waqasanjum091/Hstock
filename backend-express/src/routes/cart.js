const router = require('express').Router()
const Cart = require('../models/Cart')
const { protect } = require('../middleware/auth')

router.use(protect)

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user._id }).populate('productId')
    res.json(items)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/cart
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body
    if (!product_id) return res.status(422).json({ message: 'product_id required' })
    let item = await Cart.findOne({ userId: req.user._id, productId: product_id })
    if (item) {
      item.quantity += quantity
      await item.save()
    } else {
      item = await Cart.create({ userId: req.user._id, productId: product_id, quantity })
    }
    res.status(201).json(await item.populate('productId'))
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PUT /api/cart/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await Cart.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { quantity: req.body.quantity }, { new: true }).populate('productId')
    if (!item) return res.status(404).json({ message: 'Cart item not found' })
    res.json(item)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/cart (clear all)
router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id })
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
