const Summary = require('../models/Summary')
const Note = require('../models/Note')
const { summarizeText } = require('../services/geminiService')

const createSummary = async (req, res) => {
  try {
    const { noteId } = req.body
    let text = req.body.text

    if (!noteId) {
      return res.status(400).json({ success: false, message: 'noteId is required' })
    }

    const note = await Note.findById(noteId)
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' })
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to summarize this note' })
    }

    if ((!text || text.trim().length === 0) && note.content) {
      text = note.content
    }

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Text is too short to summarize (minimum 10 characters required)' })
    }

    const summaryText = await summarizeText(text)

    const summary = await Summary.create({
      userId: req.user._id,
      noteId,
      originalText: text,
      summary: summaryText,
    })

    res.status(201).json({
      success: true,
      message: 'Summary created successfully',
      summary: {
        id: summary._id,
        noteId: summary.noteId,
        originalText: summary.originalText,
        summary: summary.summary,
        createdAt: summary.createdAt,
      },
    })
  } catch (error) {
    console.error('[createSummary] Error:', error.message)
    res.status(500).json({ success: false, message: 'Summary generation failed', error: error.message })
  }
}

const getSummaries = async (req, res) => {
  try {
    const filter = { userId: req.user._id }
    if (req.query.noteId) {
      filter.noteId = req.query.noteId
    }

    const summaries = await Summary.find(filter).sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      summaries: summaries.map((s) => ({
        id: s._id,
        noteId: s.noteId,
        originalText: s.originalText,
        summary: s.summary,
        createdAt: s.createdAt,
      })),
    })
  } catch (error) {
    console.error('[getSummaries] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to fetch summaries', error: error.message })
  }
}

const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findOne({ _id: req.params.id, userId: req.user._id })
    if (!summary) {
      return res.status(404).json({ success: false, message: 'Summary not found' })
    }

    res.status(200).json({
      success: true,
      summary: {
        id: summary._id,
        noteId: summary.noteId,
        originalText: summary.originalText,
        summary: summary.summary,
        createdAt: summary.createdAt,
      },
    })
  } catch (error) {
    console.error('[getSummaryById] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to fetch summary', error: error.message })
  }
}

module.exports = {
  createSummary,
  getSummaries,
  getSummaryById,
}
