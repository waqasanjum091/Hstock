const mongoose = require('mongoose')

// A customer-raised issue against a delivered order item (e.g. "received the wrong account").
// Appears on the vendor's dashboard so they can fix it.
const disputeSchema = new mongoose.Schema({
  dispute_number: { type: String, unique: true },
  orderId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
  productId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  product_name:   { type: String },
  type: {
    type: String,
    enum: ['wrong_account', 'not_working', 'not_delivered', 'other'],
    default: 'wrong_account',
  },
  description:       { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'rejected'],
    default: 'open',
  },
  resolution_note:   { type: String },  // vendor's reply / how it was fixed
  corrected_details: { type: String },  // e.g. the corrected account credentials
  resolved_at:       { type: Date },
}, { timestamps: true })

disputeSchema.pre('save', function (next) {
  if (!this.dispute_number) {
    this.dispute_number = 'DSP-' + Math.random().toString(36).toUpperCase().substring(2, 10)
  }
  next()
})

disputeSchema.virtual('customer', { ref: 'User', localField: 'customerId', foreignField: '_id', justOne: true })
disputeSchema.virtual('vendor', { ref: 'VendorProfile', localField: 'vendorId', foreignField: '_id', justOne: true })
disputeSchema.virtual('order', { ref: 'Order', localField: 'orderId', foreignField: '_id', justOne: true })
disputeSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Dispute', disputeSchema)
