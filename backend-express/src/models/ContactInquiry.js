const mongoose = require('mongoose')

const contactInquirySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  subject:     { type: String },
  message:     { type: String, required: true },
  is_resolved: { type: Boolean, default: false },
  resolved_at: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('ContactInquiry', contactInquirySchema)
