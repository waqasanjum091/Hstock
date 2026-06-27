const router = require('express').Router()
const Wishlist = require('../models/Wishlist')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).populate({ path: 'productId', model: 'Product' })
    res.json({ data: items.map(i => ({ ...i.toJSON(), product: i.productId })) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    const { product_id } = req.body
    const exists = await Wishlist.findOne({ userId: req.user._id, productId: product_id })
    if (exists) return res.json(exists)
    const item = await Wishlist.create({ userId: req.user._id, productId: product_id })
    res.status(201).json(item)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
