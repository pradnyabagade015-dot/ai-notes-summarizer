import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetAccountOverview, apiGetSummaries } from '../services/api'
import AiUsageDashboard from '../components/AiUsageDashboard'
import { FiUploadCloud, FiFileText, FiBookOpen, FiArrowRight, FiClock, FiZap, FiFolder } from 'react-icons/fi'

function Dashboard() {
  const { user } = useAuth()
  const [summaries, setSummaries] = useState([])
  const [analytics, setAnalytics] = useState({ notes: 0, summaries: 0, flashcards: 0, mcqs: 0, completedPlans: 0, totalPlans: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [summariesResponse, overviewResponse] = await Promise.all([
          apiGetSummaries(),
          apiGetAccountOverview(),
        ])
        if (summariesResponse.summaries) {
          setSummaries(summariesResponse.summaries)
        }
        if (overviewResponse.profile?.stats) setAnalytics(overviewResponse.profile.stats)
      } catch (err) {
        console.error('[Dashboard] Error fetching summaries:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome Header */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-indigo-200/50 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
                <FiZap className="h-3.5 w-3.5" />
                Study Workspace Active
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {user?.fullName || 'Student'}!
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-indigo-100 sm:text-base">
                Your AI Notes Summarizer workspace is ready. Upload notes to generate instant summaries.
              </p>
            </div>

            <Link
              to="/upload-notes"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-600 shadow-md transition duration-300 hover:bg-indigo-50 hover:shadow-lg shrink-0"
            >
              <FiUploadCloud className="h-5 w-5" />
              <span>Upload Notes</span>
            </Link>
          </div>
        </div>

        <AiUsageDashboard user={user} />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Notes</span>
              <div className="rounded-2xl bg-violet-50 p-2.5 text-violet-600">
                <FiFolder className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{analytics.notes}</p>
            <Link to="/notes" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              View library <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Summaries</span>
              <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                <FiBookOpen className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{analytics.summaries}</p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan Status</span>
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <FiZap className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold capitalize text-slate-900">{user?.plan || 'free'}</p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Engine</span>
              <div className="rounded-2xl bg-violet-50 p-2.5 text-violet-600">
                <FiFileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{analytics.flashcards + analytics.mcqs}</p>
            <p className="mt-1 text-xs text-slate-500">{analytics.flashcards} cards · {analytics.mcqs} MCQs · {analytics.completedPlans}/{analytics.totalPlans} plans</p>
          </div>
        </div>

        {/* Recent Summaries List */}
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Recent Summaries</h2>
            <Link
              to="/upload-notes"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>Create New</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex py-12 justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : summaries.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <FiFileText className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No summaries created yet</h3>
              <p className="mt-1 text-xs text-slate-500">Upload your first note file or paste text to generate AI summaries.</p>
              <Link
                to="/upload-notes"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                Upload Notes Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {summaries.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-indigo-50/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {s.originalText ? s.originalText.slice(0, 60) + '...' : 'AI Generated Summary'}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <FiClock className="h-3.5 w-3.5" />
                      {new Date(s.createdAt).toLocaleDateString()} at{' '}
                      {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <Link
                    to="/summary"
                    state={{ summary: s }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 shrink-0"
                  >
                    <span>View Summary</span>
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
