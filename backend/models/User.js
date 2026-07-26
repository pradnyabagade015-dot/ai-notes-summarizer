const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    summariesUsedToday: {
      type: Number,
      default: 0,
    },
    lastSummaryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', userSchema)
