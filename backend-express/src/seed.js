require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Category = require('./models/Category')
const slugify = require('slugify')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Admin user
  const existing = await User.findOne({ email: 'admin@pvabrand.com' })
  if (!existing) {
    await User.create({ name: 'Admin', email: 'admin@pvabrand.com', password: 'admin123456', role: 'super-admin' })
    console.log('✅ Admin created: admin@pvabrand.com / admin123456')
  } else {
    console.log('ℹ️  Admin already exists')
  }

  // Categories
  const cats = ['Instagram Accounts','Gmail Accounts','TikTok Accounts','LinkedIn Accounts','Facebook Accounts','Twitter Accounts','YouTube Accounts','Snapchat Accounts']
  for (const name of cats) {
    const slug = slugify(name, { lower: true, strict: true })
    await Category.findOneAndUpdate({ slug }, { name, slug, is_active: true }, { upsert: true })
  }
  console.log('✅ Categories seeded')

  await mongoose.disconnect()
  console.log('Done!')
}

seed().catch(console.error)
