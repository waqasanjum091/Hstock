const router = require('express').Router()
const slugify = require('slugify')
const VendorProfile = require('../models/VendorProfile')

// GET /api/vendor-profile
router.get('/', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'No profile found' })
    res.json(profile)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/vendor-profile
router.post('/', async (req, res) => {
  try {
    if (await VendorProfile.findOne({ userId: req.user._id }))
      return res.status(422).json({ message: 'You already have a store profile.' })

    const { store_name } = req.body
    if (!store_name) return res.status(422).json({ message: 'Store name is required' })

    let slug = slugify(store_name, { lower: true, strict: true })
    let i = 1
    while (await VendorProfile.findOne({ store_slug: slug }))
      slug = slugify(store_name, { lower: true, strict: true }) + '-' + i++

    const profile = await VendorProfile.create({
      ...req.body, userId: req.user._id, store_slug: slug, is_approved: false
    })
    res.status(201).json(profile)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// PUT /api/vendor-profile
router.put('/', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
    if (!profile) return res.status(404).json({ message: 'No profile found. Create one first.' })

    const allowed = ['store_name', 'description', 'logo', 'banner', 'address', 'phone']
    const updates = {}
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f] })
    if (updates.store_name) updates.store_slug = slugify(updates.store_name, { lower: true, strict: true })

    const updated = await VendorProfile.findByIdAndUpdate(profile._id, updates, { new: true })
    res.json(updated)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
