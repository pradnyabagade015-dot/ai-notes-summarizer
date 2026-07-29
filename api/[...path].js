import app from '../backend/server.js'
import connectDB from '../backend/config/db.js'

// One catch-all Vercel function preserves existing endpoints such as
// /api/auth/login and /api/payments/verify.
export default async function handler(req, res) {
  try {
    await connectDB()
    return app(req, res)
  } catch (error) {
    console.error('API initialization failed:', error.message)
    return res.status(503).json({
      success: false,
      message: 'The database is temporarily unavailable. Please try again shortly.',
    })
  }
}

// Prevent a platform body parser from consuming multipart uploads before multer.
export const config = { api: { bodyParser: false } }
