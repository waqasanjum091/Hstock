const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String },
  type:  { type: String, default: 'string' },
}, { timestamps: true })

module.exports = mongoose.model('Setting', settingSchema)
