const mongoose = require('mongoose')

const shippingAddressSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  full_name:    { type: String, required: true },
  phone:        { type: String, required: true },
  address_line_1: { type: String, required: true },
  address_line_2: { type: String },
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  postal_code:  { type: String, required: true },
  country:      { type: String, required: true },
  is_default:   { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('ShippingAddress', shippingAddressSchema)
