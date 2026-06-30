const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  productId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  vendorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'VendorProfile' },
  product_name: String,
  price:        Number,
  quantity:     Number,
  total:        Number,
})

const orderSchema = new mongoose.Schema({
  order_number:       { type: String, unique: true },
  userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shippingAddressId:  { type: mongoose.Schema.Types.ObjectId, ref: 'ShippingAddress' },
  items:              [orderItemSchema],
  subtotal:           { type: Number, required: true },
  shipping_cost:      { type: Number, default: 0 },
  tax:                { type: Number, default: 0 },
  total:              { type: Number, required: true },
  status:             { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  payment_status:     { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' },
  payment_method:     { type: String },
  tracking_number:    { type: String },
  notes:              { type: String },
}, { timestamps: true })

orderSchema.pre('save', function (next) {
  if (!this.order_number) {
    this.order_number = 'ORD-' + Math.random().toString(36).toUpperCase().substring(2, 12)
  }
  next()
})

orderSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true })
orderSchema.virtual('shippingAddress', { ref: 'ShippingAddress', localField: 'shippingAddressId', foreignField: '_id', justOne: true })
// When a route populates the `*Id` path, also expose it under the friendly name the frontend reads.
orderSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    if (doc.populated && doc.populated('userId')) ret.user = ret.userId
    if (doc.populated && doc.populated('shippingAddressId')) ret.shippingAddress = ret.shippingAddressId
    return ret
  },
})

module.exports = mongoose.model('Order', orderSchema)
