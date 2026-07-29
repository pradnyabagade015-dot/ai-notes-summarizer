const Note = require('../models/Note')
const { answerQuestionAboutNotes } = require('../services/geminiService')

const askAboutNote = async (req, res) => {
  try {
    const question = req.body.question?.trim()
    if (!question || question.length > 2000) {
      return res.status(400).json({ success: false, message: 'Please ask a question between 1 and 2,000 characters.' })
    }

    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id })
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' })
    if (!note.content?.trim()) {
      return res.status(400).json({ success: false, message: 'This note has no text available for chat.' })
    }

    const history = Array.isArray(req.body.history)
      ? req.body.history
          .filter((message) => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
          .slice(-10)
          .map((message) => ({ role: message.role, content: message.content.slice(0, 2000) }))
      : []

    const answer = await answerQuestionAboutNotes({ noteContent: note.content, question, history })
    res.status(200).json({ success: true, answer })
  } catch (error) {
    console.error('[askAboutNote] Chat request failed:', {
      noteId: req.params.id,
      userId: req.user?._id?.toString(),
      message: error.message,
      stack: error.stack,
    })
    res.status(500).json({ success: false, message: 'Unable to answer your question about this note. Please try again.' })
  }
}

module.exports = { askAboutNote }
