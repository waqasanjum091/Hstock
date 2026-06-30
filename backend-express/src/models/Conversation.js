const mongoose = require('mongoose')

// A 1-to-1 conversation between two users (typically a customer and a vendor).
const conversationSchema = new mongoose.Schema({
  participants:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  productId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  last_message:    { type: String, default: '' },
  last_message_at: { type: Date, default: Date.now },
}, { timestamps: true })

conversationSchema.index({ participants: 1, updatedAt: -1 })

module.exports = mongoose.model('Conversation', conversationSchema)
