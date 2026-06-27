const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  title:       { type: String },
  comment:     { type: String },
  is_approved: { type: Boolean, default: true },
}, { timestamps: true })

reviewSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true })
reviewSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Review', reviewSchema)
