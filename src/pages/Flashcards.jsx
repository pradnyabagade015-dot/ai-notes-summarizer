import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  apiGetNoteById,
  apiGetFlashcardsByNoteId,
  apiGenerateFlashcardsForNote,
} from '../services/api'
import {
  FiCreditCard,
  FiLoader,
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiZap,
} from 'react-icons/fi'

const Flashcard = ({ card, isFlipped, onFlip }) => (
  <div
    className="w-full h-80 perspective-1000"
    onClick={onFlip}
  >
    <div
      className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${
        isFlipped ? 'rotate-y-180' : ''
      }`}
    >
      <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 text-center rounded-3xl bg-white shadow-xl border border-slate-100">
        <p className="text-2xl font-semibold text-slate-800">{card.question}</p>
      </div>
      <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 text-center rounded-3xl bg-indigo-600 shadow-xl text-white">
        <p className="text-xl font-medium">{card.answer}</p>
      </div>
    </div>
  </div>
);

function FlashcardsPage() {
  const { noteId } = useParams()
  const [note, setNote] = useState(null)
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [generating, setGenerating] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [noteResponse, flashcardsResponse] = await Promise.all([
        apiGetNoteById(noteId),
        apiGetFlashcardsByNoteId(noteId),
      ])
      setNote(noteResponse.note)
      setFlashcards(flashcardsResponse.flashcards || [])
    } catch (err) {
      console.error('Failed to load data:', err)
      setError(err.message || 'Failed to load flashcards and note details.')
    } finally {
      setLoading(false)
    }
  }, [noteId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleGenerateFlashcards = async () => {
    try {
      setGenerating(true)
      setError('')
      await apiGenerateFlashcardsForNote(noteId)
      await loadData()
    } catch (err) {
      console.error('Failed to generate flashcards:', err)
      setError(err.message || 'Failed to generate flashcards.')
    } finally {
      setGenerating(false)
    }
  }

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }, 150)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }, 150)
  }
  
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <FiLoader className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
            <FiCreditCard className="h-3.5 w-3.5" />
            Flashcards
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {note?.originalFileName || 'Study Flashcards'}
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Review key concepts from your notes. Click a card to flip it.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={loadData}
              className="ml-auto text-rose-800"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>
          </div>
        )}

        {flashcards.length > 0 ? (
          <div>
            <div className="relative">
              <Flashcard
                card={flashcards[currentIndex]}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <FiArrowLeft />
                Prev
              </button>
              <p className="text-sm font-semibold text-slate-600">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Next
                <FiArrowRight />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No Flashcards Found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Generate a set of flashcards from this note's content.
            </p>
            <button
              onClick={handleGenerateFlashcards}
              disabled={generating}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap className="h-4 w-4" />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/notes"
            className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            &larr; Back to Notes Library
          </Link>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  )
}

export default FlashcardsPage;
