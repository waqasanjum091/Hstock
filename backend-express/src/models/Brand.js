const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true },
  slug:      { type: String, required: true, unique: true },
  description: { type: String },
  logo:      { type: String },
  is_active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Brand', brandSchema)
