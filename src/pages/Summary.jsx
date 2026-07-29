import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { apiGetSummaries } from '../services/api'
import { FiCopy, FiCheck, FiDownload, FiPlusCircle, FiFileText, FiClock, FiBookOpen, FiVolume2, FiPause, FiPlay, FiSquare } from 'react-icons/fi'

function Summary() {
  const location = useLocation()
  const navigate = useNavigate()
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const [summaryData, setSummaryData] = useState(location.state?.summary || null)
  const [noteData] = useState(location.state?.note || null)
  const [loading, setLoading] = useState(!location.state?.summary)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      setSelectedVoice((current) => current || availableVoices.find((voice) => voice.default)?.name || availableVoices[0]?.name || '')
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    if (summaryData) return

    const fetchLatestSummary = async () => {
      try {
        setLoading(true)
        const response = await apiGetSummaries()
        if (response.summaries && response.summaries.length > 0) {
          setSummaryData(response.summaries[0])
        } else {
          setError('No summaries found. Please upload notes to generate a summary.')
        }
      } catch (err) {
        console.error('[Summary] Failed to fetch summaries:', err)
        setError('Failed to load summary.')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestSummary()
  }, [summaryData])

  const handleCopy = () => {
    if (!summaryData?.summary) return
    navigator.clipboard.writeText(summaryData.summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!summaryData?.summary) return
    const blob = new Blob([summaryData.summary], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `summary-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSpeak = () => {
    if (!summaryData?.summary || !('speechSynthesis' in window)) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsSpeaking(true)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(summaryData.summary)
    const voice = voices.find((item) => item.name === selectedVoice)
    if (voice) utterance.voice = voice
    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      utteranceRef.current = null
    }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPaused(true)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setIsSpeaking(false)
    setIsPaused(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading summary...</p>
        </div>
      </div>
    )
  }

  if (error || !summaryData) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
            <FiFileText className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">No Summary Available</h2>
          <p className="mt-2 text-slate-600">{error || 'Upload your study notes to generate your first AI summary.'}</p>
          <div className="mt-6">
            <Link
              to="/upload-notes"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FiPlusCircle className="h-4 w-4" />
              Upload Notes Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <FiBookOpen className="h-4 w-4" />
              <span>AI Summary Result</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {noteData?.originalFileName || 'Study Summary'}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <FiClock className="h-3.5 w-3.5" />
              Generated {new Date(summaryData.createdAt || Date.now()).toLocaleDateString()} at{' '}
              {new Date(summaryData.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {copied ? <FiCheck className="h-4 w-4 text-emerald-600" /> : <FiCopy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiDownload className="h-4 w-4" />
              <span>Download</span>
            </button>

            <button
              onClick={() => navigate('/upload-notes')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              <FiPlusCircle className="h-4 w-4" />
              <span>New Summary</span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900"><FiVolume2 /> Listen to this summary</div>
              <p className="mt-1 text-xs text-indigo-700">{speechSupported ? 'Choose a browser voice and play the generated summary aloud.' : 'Text-to-speech is not supported by this browser.'}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0">
              <select value={selectedVoice} onChange={(event) => setSelectedVoice(event.target.value)} disabled={!speechSupported || isSpeaking} className="max-w-52 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
                {voices.length === 0 ? <option>Loading voices…</option> : voices.map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} ({voice.lang})</option>)}
              </select>
              {!isSpeaking || isPaused ? <button onClick={handleSpeak} disabled={!speechSupported} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><FiPlay />{isPaused ? 'Resume' : 'Play'}</button> : <button onClick={handlePause} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"><FiPause />Pause</button>}
              <button onClick={handleStop} disabled={!isSpeaking} className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"><FiSquare />Stop</button>
            </div>
        </div>

        {/* AI Generated Content Card */}
        <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Generated Insights & Takeaways
            </h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {summaryData.summary}
            </div>
          </div>
        </div>

        {/* Original Text Disclosure */}
        {summaryData.originalText ? (
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Original Note Text
            </h3>
            <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
              {summaryData.originalText}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Summary
