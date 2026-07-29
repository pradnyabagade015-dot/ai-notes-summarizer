const express = require('express')
const router = express.Router()
const upload = require('../utils/upload')
const protect = require('../middleware/auth')
const { checkAiUsageLimit } = require('../middleware/aiUsageLimit')
const { uploadNote, getNotes, getNoteById, deleteNote } = require('../controllers/noteController')
const { askAboutNote } = require('../controllers/chatController')

router.post('/upload', protect, upload.single('file'), uploadNote)
router.get('/', protect, getNotes)
router.get('/:id', protect, getNoteById)
router.post('/:id/chat', protect, checkAiUsageLimit, askAboutNote)
router.delete('/:id', protect, deleteNote)

module.exports = router
