import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiAlertCircle, FiArrowLeft, FiBookOpen, FiLoader, FiMessageCircle, FiSend } from 'react-icons/fi'
import { apiAskAboutNote, apiGetNoteById } from '../services/api'

function ChatWithNotes() {
  const { noteId } = useParams()
  const [note, setNote] = useState(null)
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messageEndRef = useRef(null)

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true)
        const response = await apiGetNoteById(noteId)
        setNote(response.note)
      } catch (err) {
        setError(err.message || 'Unable to load this note.')
      } finally {
        setLoading(false)
      }
    }
    loadNote()
  }, [noteId])

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, sending])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || sending) return

    const conversation = messages.map(({ role, content }) => ({ role, content }))
    const userMessage = { role: 'user', content: trimmedQuestion }
    setMessages((current) => [...current, userMessage])
    setQuestion('')
    setSending(true)
    setError('')

    try {
      const response = await apiAskAboutNote(noteId, { question: trimmedQuestion, history: conversation })
      setMessages((current) => [...current, { role: 'assistant', content: response.answer }])
    } catch (err) {
      setError(err.message || 'Unable to answer your question.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-slate-500"><FiLoader className="h-10 w-10 animate-spin" /></div>

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"><FiMessageCircle /> AI Chat With Notes</div>
          <h1 className="mt-3 flex items-center gap-2 text-2xl font-bold text-slate-900"><FiBookOpen className="text-indigo-600" />{note?.originalFileName || 'Your Note'}</h1>
          <p className="mt-2 text-sm text-slate-600">Ask follow-up questions and get answers grounded in this note only.</p>
        </div>

        {error && <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><FiAlertCircle />{error}</div>}

        <div className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {messages.length === 0 ? <div className="mx-auto mt-14 max-w-md text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><FiMessageCircle className="h-6 w-6" /></div><h2 className="mt-4 font-semibold text-slate-800">Start a conversation</h2><p className="mt-2 text-sm leading-6 text-slate-500">Try asking “What are the main ideas?” or “Explain this topic simply.”</p></div> : messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{message.content}</div></div>)}
            {sending && <div className="flex justify-start"><div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600"><FiLoader className="animate-spin" />Thinking about your note…</div></div>}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <div className="flex gap-2"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} disabled={sending || !note} rows={2} placeholder="Ask a question about this note…" className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50" /><button type="submit" disabled={!question.trim() || sending || !note} className="inline-flex items-center gap-2 self-end rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><FiSend />Send</button></div>
          </form>
        </div>
        <Link to="/notes" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"><FiArrowLeft />Back to Notes Library</Link>
      </div>
    </div>
  )
}

export default ChatWithNotes
