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
  // pending → admin hasn't decided · approved → can sell · rejected → request denied
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejection_reason: { type: String },
}, { timestamps: true })

vendorProfileSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true })
// Expose a populated `userId` under `user` (what the frontend reads).
vendorProfileSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    if (doc.populated && doc.populated('userId')) ret.user = ret.userId
    return ret
  },
})

module.exports = mongoose.model('VendorProfile', vendorProfileSchema)
