const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { checkAiUsageLimit } = require('../middleware/aiUsageLimit')
const { createSummary, getSummaries, getSummaryById } = require('../controllers/summaryController')

router.post('/', protect, checkAiUsageLimit, createSummary)
router.get('/', protect, getSummaries)
router.get('/:id', protect, getSummaryById)

module.exports = router
