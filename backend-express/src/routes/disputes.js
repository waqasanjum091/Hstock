const router = require('express').Router()
const Dispute = require('../models/Dispute')
const Order = require('../models/Order')
const VendorProfile = require('../models/VendorProfile')
const { role } = require('../middleware/auth')

// POST /api/disputes — customer raises a dispute about an item in one of their orders
router.post('/', async (req, res) => {
  try {
    const { order_id, product_name, type, description } = req.body
    if (!order_id || !description)
      return res.status(422).json({ message: 'Order and description are required' })

    const order = await Order.findOne({ _id: order_id, userId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })

    // Resolve which vendor/product the complaint targets from the order items.
    const item = product_name
      ? order.items.find(i => i.product_name === product_name)
      : order.items[0]
    if (!item) return res.status(422).json({ message: 'No matching item in this order' })

    const dispute = await Dispute.create({
      orderId: order._id,
      customerId: req.user._id,
      vendorId: item.vendorId,
      productId: item.productId,
      product_name: item.product_name,
      type: type || 'wrong_account',
      description,
    })
    res.status(201).json(dispute)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/disputes/my — disputes the current customer has filed
router.get('/my', async (req, res) => {
  try {
    const disputes = await Dispute.find({ customerId: req.user._id })
      .populate('vendorId', 'store_name')
      .sort('-createdAt')
    res.json({ data: disputes })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/disputes/vendor — disputes raised against the current vendor's store
router.get('/vendor', role('vendor'), async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found' })

    const disputes = await Dispute.find({ vendorId: profile._id })
      .populate('customerId', 'name email')
      .sort('-createdAt')
    const open = disputes.filter(d => d.status === 'open' || d.status === 'in_progress').length
    res.json({ data: disputes, open_count: open })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PATCH /api/disputes/:id/respond — vendor responds / resolves a dispute
router.patch('/:id/respond', role('vendor'), async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    const dispute = await Dispute.findById(req.params.id)
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' })
    if (String(dispute.vendorId) !== String(profile?._id))
      return res.status(403).json({ message: 'Unauthorized' })

    const { status, resolution_note, corrected_details } = req.body
    if (status && ['open', 'in_progress', 'resolved', 'rejected'].includes(status)) {
      dispute.status = status
      if (status === 'resolved' || status === 'rejected') dispute.resolved_at = new Date()
    }
    if (resolution_note !== undefined) dispute.resolution_note = resolution_note
    if (corrected_details !== undefined) dispute.corrected_details = corrected_details
    await dispute.save()
    res.json(dispute)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
