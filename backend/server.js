const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const healthRoutes = require('./routes/health')
const authRoutes = require('./routes/auth')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

connectDB().catch((error) => {
  console.error('Database startup failed:', error.message)
  process.exit(1)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
