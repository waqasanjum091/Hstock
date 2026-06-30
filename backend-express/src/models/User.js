const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ['customer', 'vendor', 'super-admin'], default: 'customer' },
  is_suspended: { type: Boolean, default: false },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

// Format roles like Laravel Spatie so frontend works unchanged
userSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    roles: [this.role],
    is_suspended: this.is_suspended,
    created_at: this.createdAt,
    updated_at: this.updatedAt,
  }
}

module.exports = mongoose.model('User', userSchema)
