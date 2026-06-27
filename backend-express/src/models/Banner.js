const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  subtitle:   { type: String },
  image:      { type: String },
  link:       { type: String },
  position:   { type: String, enum: ['home_top','home_middle','sidebar'], default: 'home_top' },
  is_active:  { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Banner', bannerSchema)
