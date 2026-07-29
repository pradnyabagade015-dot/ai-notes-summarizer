const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.get('authorization') || req.headers.authorization || req.headers['x-access-token']

    let token = null

    if (typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim()
      } else {
        token = authHeader.trim()
      }
    }

    if (!token || token === 'null' || token === 'undefined' || token === 'Bearer') {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }

    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is not configured' })
    }

    const decoded = jwt.verify(token, jwtSecret)
    // Current tokens use `id`. Accept standard and legacy claim shapes as well
    // so a still-valid session is not logged out solely because its payload was
    // issued by an earlier version of the application.
    const userId = decoded.id || decoded._id || decoded.userId || decoded.sub || decoded.user?.id || decoded.user?._id

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token payload' })
    }

    req.user = await User.findById(userId).select('-password')

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' })
    }

    next()
  } catch (error) {
    console.error('[auth] Token verification failed:', error.message)
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' })
  }
}

module.exports = protect

