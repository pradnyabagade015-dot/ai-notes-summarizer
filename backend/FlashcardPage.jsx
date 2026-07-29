import React, 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFlashcardsByNoteId, generateFlashcardsForNote } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { ArrowLeft, RefreshCw } from 'lucide-react'

const FlashcardViewer = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)

  if (!flashcards || flashcards.length === 0) {
    return <p className="text-center text-gray-500">No flashcards available for this note.</p>
  }

  const currentCard = flashcards[currentIndex]

  const goToNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const goToPrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative w-full h-64 bg-white rounded-lg shadow-lg cursor-pointer perspective"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`absolute w-full h-full flex items-center justify-center p-6 text-center transition-transform duration-500 transform-style-3d backface-hidden ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <p className="text-xl font-semibold">{currentCard.question}</p>
        </div>
        <div
          className={`absolute w-full h-full flex items-center justify-center p-6 text-center bg-gray-100 transition-transform duration-500 transform-style-3d backface-hidden ${
            isFlipped ? '' : 'rotate-y-180'
          }`}
        >
          <p className="text-lg">{currentCard.answer}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={goToPrev} className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
          Prev
        </button>
        <p className="text-sm text-gray-600">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
        <button onClick={goToNext} className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
          Next
        </button>
      </div>
    </div>
  )
}

const FlashcardPage = () => {
  const { noteId } = useParams()
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: flashcards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['flashcards', noteId],
    queryFn: () => getFlashcardsByNoteId(token, noteId),
    enabled: !!token && !!noteId,
  })

  const { mutate: generateFlashcards, isPending: isGenerating } = useMutation({
    mutationFn: () => generateFlashcardsForNote(token, noteId),
    onSuccess: () => {
      toast.success('Flashcards regenerated successfully!')
      queryClient.invalidateQueries({ queryKey: ['flashcards', noteId] })
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to generate flashcards.')
    },
  })

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to={`/note/${noteId}`} className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft size={20} className="mr-2" />
          Back to Note
        </Link>
        <h1 className="text-3xl font-bold text-center">Flashcards</h1>
        <button
          onClick={() => generateFlashcards()}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          <RefreshCw size={16} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {isLoading && <p className="text-center">Loading flashcards...</p>}
      {error && <p className="text-center text-red-500">Error: {error.message}</p>}
      {!isLoading && !error && <FlashcardViewer flashcards={flashcards} />}
    </div>
  )
}

export default FlashcardPage