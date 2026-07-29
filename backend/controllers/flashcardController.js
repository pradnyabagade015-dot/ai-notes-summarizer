const Note = require('../models/Note')
const Flashcard = require('../models/Flashcard')
const { generateFlashcards } = require('../services/geminiService')

const formatFlashcard = (card) => ({
  id: card._id,
  userId: card.userId,
  noteId: card.noteId,
  question: card.question,
  answer: card.answer,
  createdAt: card.createdAt,
});

const generateFlashcardsForNote = async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ success: false, message: 'noteId is required' });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this note' });
    }

    if (!note.content || note.content.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Note content is too short to generate flashcards' });
    }

    const generated = await generateFlashcards(note.content);
    
    if (!generated || !Array.isArray(generated)) {
      throw new Error('Flashcard generation service returned invalid data.');
    }

    await Flashcard.deleteMany({ userId: req.user._id, noteId: note._id });

    const flashcards = await Flashcard.insertMany(
      generated.map((card) => ({
        userId: req.user._id,
        noteId: note._id,
        question: card.question,
        answer: card.answer,
      }))
    );

    res.status(201).json({
      success: true,
      message: 'Flashcards generated successfully',
      flashcards: flashcards.map(formatFlashcard),
    });
  } catch (error) {
    console.error('[generateFlashcardsForNote] Final catch block error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Flashcard generation failed', error: error.message });
  }
};

const getFlashcardsByNoteId = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    const flashcards = await Flashcard.find({ userId: req.user._id, noteId: note._id }).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      flashcards: flashcards.map(formatFlashcard),
    });
  } catch (error) {
    console.error('[getFlashcardsByNoteId] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch flashcards', error: error.message });
  }
};

module.exports = {
  generateFlashcardsForNote,
  getFlashcardsByNoteId,
};
