const mongoose = require('mongoose')

const vendorProfileSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  store_name:  { type: String, required: true },
  store_slug:  { type: String, required: true, unique: true },
  description: { type: String },
  logo:        { type: String },
  banner:      { type: String },
  address:     { type: String },
  phone:       { type: String },
  is_approved: { type: Boolean, default: false },
}, { timestamps: true })

vendorProfileSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true })
vendorProfileSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('VendorProfile', vendorProfileSchema)
