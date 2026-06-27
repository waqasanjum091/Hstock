const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  vendorId:          { type: mongoose.Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
  categoryId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brandId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  name:              { type: String, required: true },
  slug:              { type: String, required: true, unique: true },
  description:       { type: String },
  short_description: { type: String },
  price:             { type: Number, required: true, min: 0 },
  discount_price:    { type: Number },
  sku:               { type: String, unique: true, sparse: true },
  quantity:          { type: Number, default: 0 },
  in_stock:          { type: Boolean, default: true },
  featured_image:    { type: String },
  images:            [{ image_path: String, is_primary: Boolean, sort_order: Number }],
  specifications:    { type: mongoose.Schema.Types.Mixed },
  tags:              [String],
  is_featured:       { type: Boolean, default: false },
  is_active:         { type: Boolean, default: true },
  sales_count:       { type: Number, default: 0 },
  avg_rating:        { type: Number, default: 0 },
  reviews_count:     { type: Number, default: 0 },
}, { timestamps: true })

productSchema.virtual('vendor', { ref: 'VendorProfile', localField: 'vendorId', foreignField: '_id', justOne: true })
productSchema.virtual('category', { ref: 'Category', localField: 'categoryId', foreignField: '_id', justOne: true })
productSchema.virtual('brand', { ref: 'Brand', localField: 'brandId', foreignField: '_id', justOne: true })
productSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Product', productSchema)
