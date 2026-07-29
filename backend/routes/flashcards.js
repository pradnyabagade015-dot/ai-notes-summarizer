const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { checkAiUsageLimit } = require('../middleware/aiUsageLimit')
const { generateFlashcardsForNote, getFlashcardsByNoteId } = require('../controllers/flashcardController')

router.post('/generate', protect, checkAiUsageLimit, generateFlashcardsForNote)
router.get('/:noteId', protect, getFlashcardsByNoteId)

module.exports = router
