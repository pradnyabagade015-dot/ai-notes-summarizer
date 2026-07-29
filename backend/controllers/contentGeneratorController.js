const Note = require('../models/Note')
const Summary = require('../models/Summary')
const { generateContentFromSource } = require('../services/geminiService')

const generateContent = async (req, res) => {
  try {
    const { sourceType, sourceId, contentType } = req.body
    if (!['note', 'summary'].includes(sourceType) || !sourceId || !contentType) {
      return res.status(400).json({ success: false, message: 'Select a source and content type.' })
    }

    const source = sourceType === 'note'
      ? await Note.findOne({ _id: sourceId, userId: req.user._id })
      : await Summary.findOne({ _id: sourceId, userId: req.user._id })
    if (!source) return res.status(404).json({ success: false, message: 'Selected source was not found.' })

    const sourceText = sourceType === 'note' ? source.content : source.summary
    if (!sourceText?.trim()) return res.status(400).json({ success: false, message: 'The selected source has no usable text.' })

    const content = await generateContentFromSource({ sourceText, contentType })
    res.status(200).json({ success: true, content })
  } catch (error) {
    console.error('[generateContent] Error:', error.message, error.stack)
    res.status(500).json({ success: false, message: 'Unable to generate content. Please try again.' })
  }
}

module.exports = { generateContent }
