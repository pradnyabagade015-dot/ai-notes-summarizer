import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiShield, FiLogOut, FiAward, FiCalendar, FiCreditCard } from 'react-icons/fi'
import AiUsageDashboard from '../components/AiUsageDashboard'
import { apiGetAccountOverview } from '../services/api'

function Profile() {
  const { user, logout } = useAuth()
  const [overview, setOverview] = useState(null)
  useEffect(() => { apiGetAccountOverview().then((data) => setOverview(data.profile)).catch(() => {}) }, [])
  const stats = overview?.stats

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/80 bg-white/90 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-200">
            {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.fullName || 'User'}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FiUser className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="text-sm font-semibold text-slate-800">{user?.fullName || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FiMail className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="text-sm font-semibold text-slate-800">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FiShield className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Account Plan</p>
                <p className="text-sm font-semibold capitalize text-slate-800">{user?.plan || 'free'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"><FiCalendar className="h-5 w-5 text-indigo-600" /><div><p className="text-xs text-slate-500">Member since</p><p className="text-sm font-semibold text-slate-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p></div></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Notes', stats?.notes], ['Summaries', stats?.summaries], ['Flashcards', stats?.flashcards], ['MCQs', stats?.mcqs]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 p-4 text-center"><p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>)}</div>
        <div className="mt-6 rounded-2xl border border-slate-100 p-5"><div className="flex items-center gap-2"><FiCreditCard className="text-indigo-600" /><h2 className="font-bold text-slate-900">Payment history</h2></div><div className="mt-3 space-y-2">{overview?.payments?.length ? overview.payments.map((payment) => <div key={payment._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span className="font-medium capitalize">{payment.plan} · {payment.currency} {payment.amount / 100}</span><span className={payment.status === 'verified' ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-500'}>{payment.status}</span></div>) : <p className="text-sm text-slate-500">No payments yet.</p>}</div>{user?.premiumActivatedAt && <p className="mt-3 text-xs text-emerald-700">Premium activated {new Date(user.premiumActivatedAt).toLocaleDateString()}.</p>}</div>

        <div className="mt-6">
          <AiUsageDashboard user={user} />
        </div>

        {user?.plan !== 'premium' && (
          <Link to="/premium" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700">
            <FiAward className="h-4 w-4" />
            Explore Premium
          </Link>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
