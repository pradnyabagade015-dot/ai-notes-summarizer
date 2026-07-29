const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendPasswordResetEmail } = require('../services/emailService')

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign({ id: id.toString() }, jwtSecret, { expiresIn: '7d' })
}

const hasClientControlledAccountFields = (body = {}) => (
  ['plan', 'aiUsage', 'summariesUsedToday', 'lastSummaryDate'].some((field) => Object.prototype.hasOwnProperty.call(body, field))
)

const registerUser = async (req, res) => {
  try {
    if (hasClientControlledAccountFields(req.body)) {
      return res.status(400).json({ success: false, message: 'Plan and usage fields are managed by the server.' })
    }

    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        aiUsage: user.aiUsage,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        aiUsage: user.aiUsage,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  })
}

const logoutUser = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' })
}

const requestPasswordReset = async (req, res) => {
  const genericMessage = 'If an account matches that email address, a password reset link has been sent.'
  try {
    const email = req.body.email?.trim().toLowerCase()
    if (!email) return res.status(400).json({ success: false, message: 'Please provide an email address' })

    const user = await User.findOne({ email })
    if (!user) return res.status(200).json({ success: true, message: genericMessage })

    const resetSecret = `${process.env.JWT_SECRET}:${user.password}`
    const token = jwt.sign({ id: user._id.toString(), purpose: 'password-reset' }, resetSecret, { expiresIn: '15m' })
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
    await sendPasswordResetEmail({
      email: user.email,
      fullName: user.fullName,
      resetUrl: `${clientUrl}/reset-password/${token}`,
    })

    res.status(200).json({ success: true, message: genericMessage })
  } catch (error) {
    console.error('[requestPasswordReset] Error:', error.message)
    res.status(500).json({ success: false, message: 'Unable to send a password reset email. Please try again later.' })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    const decodedWithoutVerification = jwt.decode(req.params.token)
    if (!decodedWithoutVerification?.id || decodedWithoutVerification.purpose !== 'password-reset') {
      return res.status(400).json({ success: false, message: 'This password reset link is invalid or has expired' })
    }

    const user = await User.findById(decodedWithoutVerification.id)
    if (!user) return res.status(400).json({ success: false, message: 'This password reset link is invalid or has expired' })

    jwt.verify(req.params.token, `${process.env.JWT_SECRET}:${user.password}`)
    user.password = await bcrypt.hash(password, 10)
    await user.save()
    res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' })
  } catch (error) {
    console.error('[resetPassword] Error:', error.message)
    res.status(400).json({ success: false, message: 'This password reset link is invalid or has expired' })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  requestPasswordReset,
  resetPassword,
}
