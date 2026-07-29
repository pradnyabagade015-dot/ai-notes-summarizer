const SupportTicket = require('../models/SupportTicket')
const Feedback = require('../models/Feedback')

const createTicket = async (req, res) => {
  try {
    const category = req.body?.category?.trim()
    const message = req.body?.message?.trim()
    if (!category || !message) return res.status(400).json({ success: false, message: 'A category and message are required.' })

    const ticket = await SupportTicket.create({ userId: req.user._id, category, message })
    return res.status(201).json({ success: true, ticket: { id: ticket._id, category: ticket.category, status: ticket.status, createdAt: ticket.createdAt } })
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Please provide a valid support request.' })
    console.error('[createTicket] Error:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to create your support ticket.' })
  }
}

const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ createdAt: -1 }).select('category message status createdAt')
    return res.status(200).json({ success: true, tickets })
  } catch (error) {
    console.error('[getTickets] Error:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to load support tickets.' })
  }
}

const createFeedback = async (req, res) => {
  try {
    const rating = Number(req.body?.rating)
    const message = req.body?.message?.trim()
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !message) {
      return res.status(400).json({ success: false, message: 'Choose a rating from 1 to 5 and add your feedback.' })
    }
    await Feedback.create({ userId: req.user._id, rating, message })
    return res.status(201).json({ success: true, message: 'Thanks for your feedback.' })
  } catch (error) {
    console.error('[createFeedback] Error:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to submit feedback.' })
  }
}

module.exports = { createTicket, getTickets, createFeedback }
