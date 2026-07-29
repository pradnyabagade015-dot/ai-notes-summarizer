const Note = require('../models/Note');
const { generateMCQs } = require('../services/geminiService');

const isValidMCQ = (mcq) =>
  mcq &&
  typeof mcq.question === 'string' &&
  mcq.question.trim() &&
  Array.isArray(mcq.options) &&
  mcq.options.length === 4 &&
  mcq.options.every((option) => typeof option === 'string' && option.trim()) &&
  typeof mcq.correctAnswer === 'string' &&
  mcq.options.includes(mcq.correctAnswer);

const createMCQs = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (!note.content || note.content.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Note content is too short to generate MCQs' });
    }

    const mcqs = await generateMCQs(note.content);
    if (!Array.isArray(mcqs) || mcqs.length === 0 || !mcqs.every(isValidMCQ)) {
      throw new Error('MCQ generation returned invalid data');
    }

    note.mcqs = mcqs;
    await note.save();

    res.status(201).json({ success: true, mcqs: note.mcqs });
  } catch (error) {
    console.error('[mcqController] createMCQs error:', error.message);
    res.status(500).json({ success: false, message: 'MCQ generation failed', error: error.message });
  }
};

const getMCQsByNoteId = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, mcqs: note.mcqs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get MCQs', error: error.message });
  }
};

module.exports = { createMCQs, getMCQsByNoteId };
