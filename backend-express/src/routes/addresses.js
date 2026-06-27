const router = require('express').Router()
const ShippingAddress = require('../models/ShippingAddress')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const addresses = await ShippingAddress.find({ userId: req.user._id })
    res.json(addresses)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', async (req, res) => {
  try {
    if (req.body.is_default) await ShippingAddress.updateMany({ userId: req.user._id }, { is_default: false })
    const address = await ShippingAddress.create({ ...req.body, userId: req.user._id })
    res.status(201).json(address)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id', async (req, res) => {
  try {
    if (req.body.is_default) await ShippingAddress.updateMany({ userId: req.user._id }, { is_default: false })
    const address = await ShippingAddress.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true })
    if (!address) return res.status(404).json({ message: 'Address not found' })
    res.json(address)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await ShippingAddress.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.status(204).send()
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
