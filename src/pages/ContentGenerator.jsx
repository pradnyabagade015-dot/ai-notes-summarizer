import { useEffect, useState } from 'react'
import { FiCheck, FiCopy, FiEdit3, FiFileText, FiLoader, FiZap } from 'react-icons/fi'
import { apiGenerateContent, apiGetNotes, apiGetSummaries } from '../services/api'

const contentTypes = [
  { value: 'email', label: 'Professional Email' },
  { value: 'report', label: 'Report' },
  { value: 'minutes', label: 'Meeting Minutes' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'coverLetter', label: 'Cover Letter' },
  { value: 'assignment', label: 'Assignment Answer' },
]

function ContentGenerator() {
  const [notes, setNotes] = useState([])
  const [summaries, setSummaries] = useState([])
  const [sourceType, setSourceType] = useState('note')
  const [sourceId, setSourceId] = useState('')
  const [contentType, setContentType] = useState('email')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const sources = sourceType === 'note' ? notes : summaries

  useEffect(() => {
    const loadSources = async () => {
      try {
        const [notesResponse, summariesResponse] = await Promise.all([apiGetNotes(), apiGetSummaries()])
        setNotes(notesResponse.notes || [])
        setSummaries(summariesResponse.summaries || [])
      } catch (err) {
        setError(err.message || 'Unable to load your notes and summaries.')
      } finally {
        setLoading(false)
      }
    }
    loadSources()
  }, [])

  const switchSourceType = (type) => {
    setSourceType(type)
    setSourceId('')
    setContent('')
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    if (!sourceId) return setError('Select a note or summary first.')
    try {
      setGenerating(true)
      setError('')
      const response = await apiGenerateContent({ sourceType, sourceId, contentType })
      setContent(response.content || '')
    } catch (err) {
      setError(err.message || 'Unable to generate content.')
    } finally {
      setGenerating(false)
    }
  }

  const copyContent = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-7 text-white shadow-xl shadow-indigo-200/50"><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"><FiZap /> AI Writing Assistant</div><h1 className="mt-3 text-3xl font-bold">AI Content Generator</h1><p className="mt-2 max-w-2xl text-sm text-indigo-100">Turn your own notes and summaries into polished, ready-to-use content.</p></div>
        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleGenerate} className="space-y-5 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
            <div><p className="text-sm font-semibold text-slate-800">1. Choose source material</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => switchSourceType('note')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${sourceType === 'note' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Uploaded Note</button><button type="button" onClick={() => switchSourceType('summary')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${sourceType === 'summary' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Generated Summary</button></div></div>
            <select value={sourceId} onChange={(event) => setSourceId(event.target.value)} disabled={loading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500"><option value="">{loading ? 'Loading sources…' : `Select a ${sourceType}`}</option>{sources.map((source) => <option key={source.id} value={source.id}>{sourceType === 'note' ? source.originalFileName : `${source.summary?.slice(0, 80) || 'Summary'}…`}</option>)}</select>
            <div><p className="text-sm font-semibold text-slate-800">2. Choose content type</p><div className="mt-3 grid grid-cols-2 gap-2">{contentTypes.map((type) => <button key={type.value} type="button" onClick={() => setContentType(type.value)} className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${contentType === type.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{type.label}</button>)}</div></div>
            <button disabled={generating || loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{generating ? <><FiLoader className="animate-spin" />Generating…</> : <><FiZap />Generate Content</>}</button>
          </form>
          <div className="flex min-h-[420px] flex-col rounded-3xl border border-white/80 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)]"><div className="flex items-center justify-between border-b border-slate-100 pb-3"><h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800"><FiEdit3 className="text-indigo-600" />Generated Content</h2>{content && <button onClick={copyContent} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">{copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}{copied ? 'Copied' : 'Copy'}</button>}</div>{content ? <pre className="mt-4 flex-1 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">{content}</pre> : <div className="flex flex-1 flex-col items-center justify-center text-center text-slate-400"><FiFileText className="h-8 w-8" /><p className="mt-3 text-sm">Choose a source and format to generate your draft.</p></div>}</div>
        </div>
      </div>
    </div>
  )
}

export default ContentGenerator
