const mongoose = require('mongoose')

const supportTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: ['account', 'notes', 'ai', 'payment', 'technical', 'other'], required: true },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('SupportTicket', supportTicketSchema)
