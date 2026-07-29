import app from '../backend/server.js'
import connectDB from '../backend/config/db.js'

// One catch-all Vercel function preserves existing endpoints such as
// /api/auth/login and /api/payments/verify.
export default async function handler(req, res) {
  try {
    // An explicit Vercel route may expose the function pathname to Node. Restore
    // the requested API path before handing control to Express.
    const requestUrl = new URL(req.url, 'http://localhost')
    if (requestUrl.pathname === '/api/[...path].js' && requestUrl.searchParams.has('path')) {
      const apiPath = requestUrl.searchParams.get('path')
      requestUrl.searchParams.delete('path')
      req.url = `/api/${apiPath}${requestUrl.search}`
    }

    // This route verifies Vercel-to-Express routing without requiring MongoDB.
    if (req.url === '/api/test' || req.url.startsWith('/api/test?')) {
      return app.handle(req, res)
    }

    await connectDB()
    // Express receives the original request, including its HTTP method and
    // /api/... pathname. Do not filter methods here: Express owns routing for
    // GET, POST, PUT, PATCH, DELETE, and OPTIONS requests.
    return app.handle(req, res)
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
