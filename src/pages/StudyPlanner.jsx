import { useEffect, useState } from 'react'
import { FiCalendar, FiCheck, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi'
import { apiCreateStudyPlan, apiDeleteStudyPlan, apiGetNotes, apiGetStudyPlans, apiUpdateStudyPlan } from '../services/api'

function StudyPlanner() {
  const [plans, setPlans] = useState([])
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState({ title: '', scheduledFor: '', durationMinutes: '60', noteId: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      const [plansResponse, notesResponse] = await Promise.all([apiGetStudyPlans(), apiGetNotes()])
      setPlans(plansResponse.plans || [])
      setNotes(notesResponse.notes || [])
    } catch (err) {
      setError(err.message || 'Unable to load your study plan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      setError('')
      const response = await apiCreateStudyPlan(form)
      setPlans((current) => [...current, response.plan].sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor)))
      setForm({ title: '', scheduledFor: '', durationMinutes: '60', noteId: '' })
    } catch (err) {
      setError(err.message || 'Unable to add study session.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleComplete = async (plan) => {
    try {
      const response = await apiUpdateStudyPlan(plan.id, { completed: !plan.completed })
      setPlans((current) => current.map((item) => item.id === plan.id ? response.plan : item))
    } catch (err) { setError(err.message || 'Unable to update study session.') }
  }

  const removePlan = async (id) => {
    try {
      await apiDeleteStudyPlan(id)
      setPlans((current) => current.filter((plan) => plan.id !== id))
    } catch (err) { setError(err.message || 'Unable to delete study session.') }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div><div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700"><FiCalendar /> Study Planner</div><h1 className="mt-3 text-3xl font-bold text-slate-900">Plan your revision</h1><p className="mt-2 text-slate-600">Schedule focused study sessions and keep track of what you complete.</p></div>
        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm sm:grid-cols-2">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Study session title" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          <input required type="datetime-local" value={form.scheduledFor} onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          <select value={form.noteId} onChange={(e) => setForm({ ...form, noteId: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"><option value="">No linked note</option>{notes.map((note) => <option key={note.id} value={note.id}>{note.originalFileName}</option>)}</select>
          <select value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">2 hours</option></select>
          <button disabled={submitting} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"><FiPlus />{submitting ? 'Adding…' : 'Add study session'}</button>
        </form>
        <div className="space-y-3">{loading ? <p className="py-10 text-center text-slate-500">Loading your plan…</p> : plans.length === 0 ? <p className="rounded-3xl bg-white/80 py-10 text-center text-slate-500">No sessions scheduled yet.</p> : plans.map((plan) => <div key={plan.id} className={`flex flex-col gap-3 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center sm:justify-between ${plan.completed ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100'}`}><div><p className={`font-semibold ${plan.completed ? 'text-emerald-800 line-through' : 'text-slate-900'}`}>{plan.title}</p><p className="mt-1 flex items-center gap-3 text-sm text-slate-500"><span className="inline-flex items-center gap-1"><FiCalendar />{new Date(plan.scheduledFor).toLocaleString()}</span><span className="inline-flex items-center gap-1"><FiClock />{plan.durationMinutes} min</span></p></div><div className="flex gap-2"><button onClick={() => toggleComplete(plan)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" title="Mark complete"><FiCheck /></button><button onClick={() => removePlan(plan.id)} className="rounded-xl border border-rose-100 p-2.5 text-rose-600 hover:bg-rose-50" title="Delete session"><FiTrash2 /></button></div></div>)}</div>
      </div>
    </div>
  )
}

export default StudyPlanner
