const mongoose = require('mongoose')

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Please add your MongoDB Atlas connection string to backend/.env.')
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log('MongoDB Connected Successfully')
    console.log(`MongoDB host: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:')
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
