const fs = require('fs')
const path = require('path')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const Note = require('../models/Note')
const Summary = require('../models/Summary')

const PREVIEW_LENGTH = 200

const formatNote = (note, options = {}) => {
  const base = {
    id: note._id,
    originalFileName: note.originalFileName,
    storedFileName: note.storedFileName,
    fileType: note.fileType,
    fileSize: note.fileSize,
    uploadDate: note.uploadDate,
    createdAt: note.createdAt,
    summaryCount: options.summaryCount ?? 0,
  }

  if (options.includeContent) {
    base.content = note.content
  } else if (note.content) {
    base.contentPreview =
      note.content.length > PREVIEW_LENGTH
        ? `${note.content.slice(0, PREVIEW_LENGTH)}...`
        : note.content
  }

  return base
}

const uploadNote = async (req, res) => {
  try {
    let originalFileName = req.body.originalFileName?.trim() || 'Pasted Notes'
    let storedFileName = ''
    let fileType = req.body.sourceFileType || 'text/plain'
    let fileSize = 0
    let content = req.body.text || ''

    if (req.file) {
      originalFileName = req.file.originalname
      storedFileName = req.file.filename
      fileType = req.file.mimetype
      fileSize = req.file.size

      // If content was not provided in body, extract it from uploaded file
      if (!content || content.trim().length === 0) {
        const filePath = req.file.path
        const isPdf = fileType === 'application/pdf' || originalFileName.toLowerCase().endsWith('.pdf')
        const isDocx = fileType.includes('officedocument') || originalFileName.toLowerCase().endsWith('.docx')
        const isTxt = fileType === 'text/plain' || originalFileName.toLowerCase().endsWith('.txt')

        if (isPdf) {
          try {
            const dataBuffer = fs.readFileSync(filePath)
            const pdfData = await pdfParse(dataBuffer)
            content = pdfData.text || ''
          } catch (pdfErr) {
            console.error(`[uploadNote] Failed to extract text from PDF "${originalFileName}":`, pdfErr.message)
          }
        } else if (isDocx) {
          try {
            const docxResult = await mammoth.extractRawText({ path: filePath })
            content = docxResult.value || ''
          } catch (docxErr) {
            console.error(`[uploadNote] Failed to extract text from DOCX "${originalFileName}":`, docxErr.message)
          }
        } else if (isTxt) {
          try {
            content = fs.readFileSync(filePath, 'utf8')
          } catch (txtErr) {
            console.error(`[uploadNote] Failed to read TXT file "${originalFileName}":`, txtErr.message)
          }
        }
      }
    }

    content = content ? content.trim() : ''

    if (!content || content.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from the uploaded file or empty content provided. Please upload a valid document or paste text (minimum 10 characters).',
      })
    }

    if (!fileSize && content) {
      fileSize = Buffer.byteLength(content, 'utf8')
    }

    const note = await Note.create({
      userId: req.user._id,
      originalFileName,
      storedFileName: storedFileName || `text-${Date.now()}.txt`,
      fileType,
      fileSize,
      content,
    })

    res.status(201).json({
      success: true,
      message: 'File uploaded and parsed successfully',
      note: {
        id: note._id,
        userId: note.userId,
        originalFileName: note.originalFileName,
        storedFileName: note.storedFileName,
        fileType: note.fileType,
        fileSize: note.fileSize,
        content: note.content,
        uploadDate: note.uploadDate,
      },
    })
  } catch (error) {
    console.error('[uploadNote] Error:', error.message)
    res.status(500).json({ success: false, message: 'File upload failed', error: error.message })
  }
}

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ uploadDate: -1 })

    const noteIds = notes.map((note) => note._id)
    const summaryCounts = noteIds.length
      ? await Summary.aggregate([
          { $match: { userId: req.user._id, noteId: { $in: noteIds } } },
          { $group: { _id: '$noteId', count: { $sum: 1 } } },
        ])
      : []

    const countByNoteId = summaryCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count
      return acc
    }, {})

    res.status(200).json({
      success: true,
      notes: notes.map((note) =>
        formatNote(note, { summaryCount: countByNoteId[note._id.toString()] || 0 }),
      ),
    })
  } catch (error) {
    console.error('[getNotes] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to fetch notes', error: error.message })
  }
}

const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id })
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' })
    }

    const summaryCount = await Summary.countDocuments({ userId: req.user._id, noteId: note._id })

    res.status(200).json({
      success: true,
      note: formatNote(note, { includeContent: true, summaryCount }),
    })
  } catch (error) {
    console.error('[getNoteById] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to fetch note', error: error.message })
  }
}

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id })
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' })
    }

    if (note.storedFileName && !note.storedFileName.startsWith('text-')) {
      const filePath = path.join(__dirname, '..', 'uploads', note.storedFileName)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await Summary.deleteMany({ userId: req.user._id, noteId: note._id })
    await note.deleteOne()

    res.status(200).json({ success: true, message: 'Note deleted successfully' })
  } catch (error) {
    console.error('[deleteNote] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to delete note', error: error.message })
  }
}

module.exports = {
  uploadNote,
  getNotes,
  getNoteById,
  deleteNote,
}
