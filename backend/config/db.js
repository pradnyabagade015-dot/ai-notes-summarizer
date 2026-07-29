const mongoose = require('mongoose')

let connectionPromise

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Please add your MongoDB Atlas connection string to backend/.env.')
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    }).then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`)
      return conn
    }).catch((error) => {
      connectionPromise = undefined
      console.error('MongoDB connection failed:', error.message)
      throw error
    })
  }

  return connectionPromise
}

module.exports = connectDB
