const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, minlength: 3, maxlength: 2000 },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Feedback', feedbackSchema)
