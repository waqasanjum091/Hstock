const router = require('express').Router()
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const User = require('../models/User')
const VendorProfile = require('../models/VendorProfile')

// Shape a conversation for the current user: expose the "other" participant + unread count.
async function present(conv, meId) {
  const other = conv.participants.find(p => String(p._id || p) !== String(meId))
  const unread = await Message.countDocuments({
    conversationId: conv._id,
    senderId: { $ne: meId },
    is_read: false,
  })
  return {
    id: conv._id,
    productId: conv.productId,
    last_message: conv.last_message,
    last_message_at: conv.last_message_at,
    unread_count: unread,
    other_user: other && other.name
      ? { id: other._id, name: other.name, email: other.email, role: other.role }
      : null,
  }
}

// GET /api/conversations — all conversations the current user is part of
router.get('/', async (req, res) => {
  try {
    const convs = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name email role')
      .sort('-last_message_at')
    const data = await Promise.all(convs.map(c => present(c, req.user._id)))
    res.json({ data })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/conversations — start (or reuse) a conversation with another user
router.post('/', async (req, res) => {
  try {
    // Target can be given directly (participant_id) or resolved from a store (vendor_id)
    let participantId = req.body.participant_id
    if (!participantId && req.body.vendor_id) {
      const vp = await VendorProfile.findById(req.body.vendor_id)
      participantId = vp?.userId
    }
    if (!participantId) return res.status(422).json({ message: 'participant_id or vendor_id is required' })
    if (String(participantId) === String(req.user._id))
      return res.status(422).json({ message: 'You cannot message yourself' })

    const other = await User.findById(participantId)
    if (!other) return res.status(404).json({ message: 'User not found' })

    let conv = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 },
    }).populate('participants', 'name email role')

    if (!conv) {
      conv = await Conversation.create({
        participants: [req.user._id, participantId],
        productId: req.body.product_id || undefined,
      })
      conv = await conv.populate('participants', 'name email role')
    }
    res.status(201).json(await present(conv, req.user._id))
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/conversations/:id/messages — messages + mark the other side's messages read
router.get('/:id/messages', async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id)
    if (!conv) return res.status(404).json({ message: 'Conversation not found' })
    if (!conv.participants.some(p => String(p) === String(req.user._id)))
      return res.status(403).json({ message: 'Unauthorized' })

    await Message.updateMany(
      { conversationId: conv._id, senderId: { $ne: req.user._id }, is_read: false },
      { is_read: true }
    )
    const messages = await Message.find({ conversationId: conv._id }).sort('createdAt')
    res.json({ data: messages.map(m => ({
      id: m._id,
      body: m.body,
      senderId: m.senderId,
      is_mine: String(m.senderId) === String(req.user._id),
      created_at: m.createdAt,
    })) })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/conversations/:id/messages — send a message
router.post('/:id/messages', async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id)
    if (!conv) return res.status(404).json({ message: 'Conversation not found' })
    if (!conv.participants.some(p => String(p) === String(req.user._id)))
      return res.status(403).json({ message: 'Unauthorized' })

    const body = (req.body.message || req.body.body || '').trim()
    if (!body) return res.status(422).json({ message: 'Message cannot be empty' })

    const message = await Message.create({ conversationId: conv._id, senderId: req.user._id, body })
    conv.last_message = body
    conv.last_message_at = new Date()
    await conv.save()

    res.status(201).json({
      id: message._id,
      body: message.body,
      senderId: message.senderId,
      is_mine: true,
      created_at: message.createdAt,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
