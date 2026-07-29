import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  apiGetNotes,
  apiGetNoteById,
  apiDeleteNote,
  apiCreateSummary,
  apiGetSummaries,
} from '../services/api'
import {
  FiFolder,
  FiFileText,
  FiSearch,
  FiTrash2,
  FiZap,
  FiClock,
  FiEye,
  FiX,
  FiUploadCloud,
  FiArrowRight,
  FiAlertCircle,
  FiCreditCard,
  FiHelpCircle,
  FiMessageCircle,
} from 'react-icons/fi'

const formatFileSize = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileTypeLabel = (fileType, fileName) => {
  if (fileType === 'application/pdf' || fileName?.toLowerCase().endsWith('.pdf')) return 'PDF'
  if (fileType?.includes('officedocument') || fileName?.toLowerCase().endsWith('.docx')) return 'DOCX'
  if (fileType === 'text/plain' || fileName?.toLowerCase().endsWith('.txt')) return 'TXT'
  if (fileType?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(fileName || '')) return 'IMAGE'
  return 'Text'
}

const getFileTypeColor = (label) => {
  switch (label) {
    case 'PDF':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'DOCX':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'TXT':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    default:
      return 'bg-violet-50 text-violet-700 border-violet-200'
  }
}

function NotesLibrary() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteSummaries, setNoteSummaries] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiGetNotes()
      setNotes(response.notes || [])
    } catch (err) {
      console.error('[NotesLibrary] Failed to load notes:', err)
      setError(err.message || 'Failed to load notes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return notes
    return notes.filter(
      (note) =>
        note.originalFileName?.toLowerCase().includes(query) ||
        note.contentPreview?.toLowerCase().includes(query),
    )
  }, [notes, search])

  const openNoteDetail = async (noteId) => {
    try {
      setDetailLoading(true)
      setError('')
      const [noteResponse, summariesResponse] = await Promise.all([
        apiGetNoteById(noteId),
        apiGetSummaries(noteId),
      ])
      setSelectedNote(noteResponse.note)
      setNoteSummaries(summariesResponse.summaries || [])
    } catch (err) {
      console.error('[NotesLibrary] Failed to load note detail:', err)
      setError(err.message || 'Failed to load note details.')
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => {
    setSelectedNote(null)
    setNoteSummaries([])
  }

  const handleGenerateSummary = async (note) => {
    const noteId = note.id
    try {
      setActionLoading(noteId)
      setError('')
      const response = await apiCreateSummary({
        noteId,
        ...(note.content ? { text: note.content } : {}),
      })
      await loadNotes()
      if (selectedNote?.id === noteId) {
        setNoteSummaries((prev) => [response.summary, ...prev])
      }
      navigate('/summary', { state: { summary: response.summary, note } })
    } catch (err) {
      console.error('[NotesLibrary] Summary generation failed:', err)
      setError(err.message || 'Failed to generate summary.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (noteId) => {
    try {
      setActionLoading(noteId)
      setError('')
      await apiDeleteNote(noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        closeDetail()
      }
      setDeleteConfirmId(null)
    } catch (err) {
      console.error('[NotesLibrary] Delete failed:', err)
      setError(err.message || 'Failed to delete note.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewFlashcards = (noteId) => {
    navigate(`/notes/${noteId}/flashcards`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
              <FiFolder className="h-3.5 w-3.5" />
              Notes Library
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Uploaded Notes
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Browse saved notes, view content, and re-generate summaries without re-uploading.
            </p>
          </div>

          <Link
            to="/upload-notes"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 shrink-0"
          >
            <FiUploadCloud className="h-4 w-4" />
            Upload New Note
          </Link>
        </div>

        {error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="rounded-3xl border border-white/80 bg-white/90 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6">
          <div className="relative mb-6">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file name or content..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {loading ? (
            <div className="flex py-16 justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-4">
                <FiFileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                {search ? 'No notes match your search' : 'No notes saved yet'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? 'Try a different search term.'
                  : 'Upload a PDF, DOCX, or TXT file to build your notes library.'}
              </p>
              {!search ? (
                <Link
                  to="/upload-notes"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <FiUploadCloud className="h-4 w-4" />
                  Upload Your First Note
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => {
                const typeLabel = getFileTypeLabel(note.fileType, note.originalFileName)
                const isDeleting = deleteConfirmId === note.id
                const isBusy = actionLoading === note.id

                return (
                  <div
                    key={note.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/20 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getFileTypeColor(typeLabel)}`}
                          >
                            {typeLabel}
                          </span>
                          <span className="text-xs text-slate-400">{formatFileSize(note.fileSize)}</span>
                          {note.summaryCount > 0 ? (
                            <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                              {note.summaryCount} summar{note.summaryCount === 1 ? 'y' : 'ies'}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-2 truncate text-base font-semibold text-slate-900">
                          {note.originalFileName}
                        </h3>

                        {note.contentPreview ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                            {note.contentPreview}
                          </p>
                        ) : null}

                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <FiClock className="h-3.5 w-3.5" />
                          Uploaded {new Date(note.uploadDate || note.createdAt).toLocaleDateString()} at{' '}
                          {new Date(note.uploadDate || note.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openNoteDetail(note.id)}
                          disabled={detailLoading}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          <FiEye className="h-3.5 w-3.5" />
                          View
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleViewFlashcards(note.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiCreditCard className="h-3.5 w-3.5" />
                          View Flashcards
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/notes/${note.id}/mcqs`)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiHelpCircle className="h-3.5 w-3.5" />
                          View MCQs
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/notes/${note.id}/chat`)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiMessageCircle className="h-3.5 w-3.5" />
                          Chat With Notes
                        </button>

                        <button
                          type="button"
                          onClick={() => handleGenerateSummary(note)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                        >
                          {isBusy ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <FiZap className="h-3.5 w-3.5" />
                          )}
                          Generate Summary
                        </button>

                        {isDeleting ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDelete(note.id)}
                              disabled={isBusy}
                              className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(note.id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedNote ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div className="min-w-0 pr-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Note Details</p>
                <h2 className="mt-1 truncate text-xl font-bold text-slate-900">{selectedNote.originalFileName}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {getFileTypeLabel(selectedNote.fileType, selectedNote.originalFileName)} ·{' '}
                  {formatFileSize(selectedNote.fileSize)} · {selectedNote.summaryCount || 0} summar
                  {(selectedNote.summaryCount || 0) === 1 ? 'y' : 'ies'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Full Content
                </h3>
                <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {selectedNote.content}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Summaries for this note
                </h3>
                {noteSummaries.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    No summaries yet. Use Generate Summary to create one.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {noteSummaries.map((summary) => (
                      <Link
                        key={summary.id}
                        to="/summary"
                        state={{ summary, note: selectedNote }}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {summary.summary?.slice(0, 80) || 'Summary'}...
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(summary.createdAt).toLocaleDateString()} at{' '}
                            {new Date(summary.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <FiArrowRight className="h-4 w-4 shrink-0 text-indigo-600" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleGenerateSummary(selectedNote)}
                disabled={actionLoading === selectedNote.id}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {actionLoading === selectedNote.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <FiZap className="h-4 w-4" />
                )}
                Generate Summary
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NotesLibrary
