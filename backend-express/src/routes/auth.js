const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) return res.status(422).json({ message: 'Name, email and password are required.' })
    if (await User.findOne({ email })) return res.status(422).json({ message: 'Email already taken.' })

    const allowedRole = ['customer', 'vendor'].includes(role) ? role : 'customer'
    const user = await User.create({ name, email, password, role: allowedRole })

    res.status(201).json({ access_token: signToken(user._id), token_type: 'Bearer', user: user.toAuthJSON() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(422).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(422).json({ message: 'The provided credentials are incorrect.' })
    }

    res.json({ access_token: signToken(user._id), token_type: 'Bearer', user: user.toAuthJSON() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/logout
router.post('/logout', protect, (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

// GET /api/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user.toAuthJSON() })
})

module.exports = router
