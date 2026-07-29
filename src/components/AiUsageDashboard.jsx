import { Link } from 'react-router-dom'
import { FiArrowRight, FiAward, FiZap } from 'react-icons/fi'

const PLAN_LIMITS = {
  free: 10,
  premium: 100,
}

const getUsageDate = () => new Date().toISOString().slice(0, 10)

function AiUsageDashboard({ user }) {
  const plan = user?.plan === 'premium' ? 'premium' : 'free'
  const limit = PLAN_LIMITS[plan]
  const used = user?.aiUsage?.date === getUsageDate() ? Math.min(Number(user.aiUsage.count) || 0, limit) : 0
  const remaining = limit - used
  const percentUsed = Math.round((used / limit) * 100)
  const isPremium = plan === 'premium'

  return (
    <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className={`rounded-xl p-2 ${isPremium ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {isPremium ? <FiAward className="h-5 w-5" /> : <FiZap className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI usage today</p>
              <h2 className="text-xl font-bold text-slate-900">{isPremium ? 'Premium' : 'Free'} plan</h2>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Your daily AI requests reset automatically each day.</p>
        </div>

        {!isPremium && (
          <Link to="/premium" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Upgrade plan <FiArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Used</p><p className="mt-1 text-2xl font-bold text-slate-900">{used}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Remaining</p><p className="mt-1 text-2xl font-bold text-emerald-600">{remaining}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Daily limit</p><p className="mt-1 text-2xl font-bold text-slate-900">{limit}</p></div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-700">{used} of {limit} requests used</span><span className="text-slate-500">{percentUsed}%</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100" aria-label={`${used} of ${limit} AI requests used`}>
          <div className={`h-full rounded-full transition-all ${percentUsed >= 90 ? 'bg-rose-500' : isPremium ? 'bg-amber-500' : 'bg-indigo-600'}`} style={{ width: `${percentUsed}%` }} />
        </div>
      </div>
    </section>
  )
}

export default AiUsageDashboard
