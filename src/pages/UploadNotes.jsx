import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorker } from 'tesseract.js'
import { apiUploadNote, apiCreateSummary } from '../services/api'
import { FiUploadCloud, FiFileText, FiZap, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

function UploadNotes() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [imageName, setImageName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState('')
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setError('')
      const isImage = ['image/jpeg', 'image/png'].includes(selectedFile.type)

      if (isImage) {
        extractImageText(selectedFile)
        return
      }

      setImageName('')
      setFile(selectedFile)

      // If plain text file, read and prefill textarea
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setText(event.target.result)
          }
        }
        reader.readAsText(selectedFile)
      }
    }
  }

  const extractImageText = async (imageFile) => {
    try {
      setOcrProcessing(true)
      setOcrProgress('Preparing image for OCR…')
      setFile(null)
      setImageName(imageFile.name)
      const worker = await createWorker('eng', 1, {
        logger: (message) => {
          if (message.status === 'recognizing text' && typeof message.progress === 'number') {
            setOcrProgress(`Extracting text… ${Math.round(message.progress * 100)}%`)
          }
        },
      })
      const { data } = await worker.recognize(imageFile)
      await worker.terminate()
      const extractedText = data.text?.trim() || ''
      if (!extractedText) throw new Error('No readable text was found in this image.')
      setText(extractedText)
      setOcrProgress('Text extracted. Review and edit it before generating a summary.')
    } catch (err) {
      console.error('[UploadNotes] OCR failed:', err)
      setImageName('')
      setText('')
      setError(err.message || 'Unable to extract text from this image.')
    } finally {
      setOcrProcessing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (ocrProcessing) {
      setError('Please wait for OCR to finish before generating a summary.')
      return
    }

    if (!file && (!text || text.trim().length < 10)) {
      setError('Please upload a file or paste text content (minimum 10 characters).')
      return
    }

    setLoading(true)
    setLoadingStep('Uploading your notes...')

    try {
      let uploadResponse

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        if (text) {
          formData.append('text', text)
        }
        uploadResponse = await apiUploadNote(formData)
      } else {
        uploadResponse = await apiUploadNote({
          text,
          ...(imageName ? { originalFileName: imageName, sourceFileType: imageName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg' } : {}),
        })
      }

      const note = uploadResponse.note
      if (!note || !note.id) {
        throw new Error('Note upload failed to return a valid note ID.')
      }

      setLoadingStep('Generating AI Summary with Gemini...')

      const textToSummarize = text || note.content || ''
      const summaryResponse = await apiCreateSummary({
        noteId: note.id,
        text: textToSummarize,
      })

      const summary = summaryResponse.summary

      // Navigate to summary page and pass summary object
      navigate('/summary', { state: { summary, note } })
    } catch (err) {
      console.error('[UploadNotes] Error during upload flow:', err)
      setError(err.message || 'An unexpected error occurred during note processing.')
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
            <FiZap className="h-3.5 w-3.5" />
            AI-Powered Summarization
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Upload & Summarize Your Notes
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Upload a document (TXT, PDF, DOCX) or paste your study notes below to get an instant AI summary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error ? (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
              <FiAlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* File Upload Area */}
          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Upload Note File (.txt, .pdf, .docx)
            </label>

            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
              <input
                type="file"
              accept=".txt,.pdf,.docx,.jpg,.jpeg,.png,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <FiUploadCloud className="h-7 w-7" />
              </div>

              {file || imageName ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-200">
                  <FiCheckCircle className="h-4 w-4" />
                  <span>{ocrProcessing ? ocrProgress : `Selected: ${file?.name || imageName}`}</span>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700">
                    Click to browse or drag and drop your file here
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Supports TXT, PDF, DOCX, JPG, JPEG, and PNG files up to 20MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Direct Text Input */}
          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="notesText" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FiFileText className="h-4 w-4 text-indigo-600" />
                Or Paste Your Study Notes
              </label>
              <span className="text-xs text-slate-400">
                {text.length} character{text.length !== 1 ? 's' : ''}
              </span>
            </div>

            <textarea
              id="notesText"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your lecture notes, article excerpts, chapter text, or study material here..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {imageName && !ocrProcessing ? <p className="mt-2 text-xs text-emerald-700">OCR text from {imageName} is ready for review. You can edit it before continuing.</p> : null}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || ocrProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-200 transition duration-300 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{loadingStep || 'Processing...'}</span>
              </>
            ) : ocrProcessing ? (
              <><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /><span>{ocrProgress || 'Extracting text...'}</span></>
            ) : (
              <>
                <FiZap className="h-5 w-5" />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadNotes
