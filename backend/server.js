const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')

// Use this project's environment file in preference to inherited shell values.
// This prevents another local project's Razorpay variables from being reused.
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true })

const connectDB = require('./config/db')
const healthRoutes = require('./routes/health')
const authRoutes = require('./routes/auth')
const noteRoutes = require('./routes/notes')
const summaryRoutes = require('./routes/summary')
const flashcardRoutes = require('./routes/flashcards')
const studyPlanRoutes = require('./routes/studyPlans')
const errorHandler = require('./middleware/errorHandler')

const app = express()

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '0.0.0.0'
const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-notes-summarizer-app-one.vercel.app',
  ...(process.env.CLIENT_URL || '').split(','),
]
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(
  cors({
    origin(origin, callback) {
  if (!origin) return callback(null, true)

  if (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.vercel.app')
  ) {
    return callback(null, true)
  }

  return callback(new Error('Origin is not allowed by CORS'))
},
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    credentials: true,
  }),
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/test', (_req, res) => {
  res.status(200).json({ status: 'API working' })
})

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/summaries', summaryRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/study-plans', studyPlanRoutes)
app.use('/api/mcqs', require('./routes/mcqs'))
app.use('/api/content-generator', require('./routes/contentGenerator'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/account', require('./routes/account'))
app.use('/api/support', require('./routes/support'))

app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(PORT, HOST, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT in backend/.env.`)
      } else {
        console.error('Server startup failed:', error.message)
      }
      process.exit(1)
    })
  } catch (error) {
    console.error('Backend startup failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

module.exports = app
