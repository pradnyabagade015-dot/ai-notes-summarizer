const express = require('express');
const router = express.Router();
const { createMCQs, getMCQsByNoteId } = require('../controllers/mcqController');
const protect = require('../middleware/auth');
const { checkAiUsageLimit } = require('../middleware/aiUsageLimit');

// GET /api/mcqs/:noteId
router.get('/:noteId', protect, getMCQsByNoteId);

// POST /api/mcqs/:noteId
router.post('/:noteId', protect, checkAiUsageLimit, createMCQs);

module.exports = router;
