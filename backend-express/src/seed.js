require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Category = require('./models/Category')
const VendorProfile = require('./models/VendorProfile')
const Product = require('./models/Product')
const { categories, products } = require('./seedData/products')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // ── Admin user ──────────────────────────────────────────
  const admin = await User.findOne({ email: 'admin@pvabrand.com' })
  if (!admin) {
    await User.create({ name: 'Admin', email: 'admin@pvabrand.com', password: 'admin123456', role: 'super-admin' })
    console.log('✅ Admin created: admin@pvabrand.com / admin123456')
  } else {
    console.log('ℹ️  Admin already exists')
  }

  // ── Store vendor (owns the catalog) ─────────────────────
  let vendorUser = await User.findOne({ email: 'store@pvabrand.com' })
  if (!vendorUser) {
    vendorUser = await User.create({ name: 'PVA Brand Store', email: 'store@pvabrand.com', password: 'vendor123456', role: 'vendor' })
    console.log('✅ Vendor user created: store@pvabrand.com / vendor123456')
  }
  let vendor = await VendorProfile.findOne({ userId: vendorUser._id })
  if (!vendor) {
    vendor = await VendorProfile.create({
      userId: vendorUser._id,
      store_name: 'PVA Brand',
      store_slug: 'pva-brand',
      description: 'Official PVA Brand store — premium verified digital accounts and services.',
      is_approved: true,
      status: 'approved',
    })
    console.log('✅ Vendor profile created: PVA Brand (approved)')
  }

  // ── Categories ──────────────────────────────────────────
  const catMap = {}
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: c.id },
      { name: c.name, slug: c.id, is_active: true },
      { upsert: true, new: true }
    )
    catMap[c.id] = doc._id
  }
  console.log(`✅ ${categories.length} categories seeded`)

  // ── Products ────────────────────────────────────────────
  let created = 0, updated = 0
  for (const p of products) {
    const doc = {
      vendorId: vendor._id,
      categoryId: catMap[p.category],
      name: p.name,
      slug: p.slug,
      short_description: p.shortDescription,
      description: p.description,
      price: p.price,
      quantity: p.stock,
      in_stock: p.stock > 0,
      is_active: true,
      is_featured: p.badge === 'Best Seller',
      avg_rating: p.rating,
      reviews_count: p.reviews,
      specifications: {
        iconKey: p.iconKey,
        category: p.category,
        originalPrice: p.originalPrice,
        deliveryType: p.deliveryType,
        deliveryTime: p.deliveryTime,
        badge: p.badge,
        badgeColor: p.badgeColor,
        gradient: p.gradient,
        features: p.features,
        minOrder: p.minOrder,
        maxOrder: p.maxOrder,
      },
    }
    const existing = await Product.findOne({ slug: p.slug })
    if (existing) {
      await Product.updateOne({ _id: existing._id }, { $set: doc })
      updated++
    } else {
      await Product.create(doc)
      created++
    }
  }
  console.log(`✅ Products seeded — ${created} created, ${updated} updated (total ${products.length})`)

  await mongoose.disconnect()
  console.log('Done!')
}

seed().catch((err) => { console.error('Seed error:', err); process.exit(1) })
