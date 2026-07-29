const express = require('express')
const protect = require('../middleware/auth')
const { createTicket, getTickets, createFeedback } = require('../controllers/supportController')

const router = express.Router()
router.use(protect)
router.get('/tickets', getTickets)
router.post('/tickets', createTicket)
router.post('/feedback', createFeedback)

module.exports = router
