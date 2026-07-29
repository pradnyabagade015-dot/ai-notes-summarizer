const express = require('express')
const protect = require('../middleware/auth')
const { checkAiUsageLimit } = require('../middleware/aiUsageLimit')
const { generateContent } = require('../controllers/contentGeneratorController')

const router = express.Router()
router.post('/', protect, checkAiUsageLimit, generateContent)

module.exports = router
