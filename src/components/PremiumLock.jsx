import { Link } from 'react-router-dom'
import { FiAward, FiLock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

function PremiumLock({ children, featureName = 'This feature', className = '', onUpgrade, isUpgrading = false }) {
  const { user } = useAuth()

  if (user?.plan === 'premium') return children

  return (
    <section className={`rounded-2xl border border-indigo-100 bg-indigo-50/80 p-5 text-slate-800 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 text-indigo-600 shadow-sm"><FiLock className="h-5 w-5" /></div>
        <div>
          <p className="font-semibold">{featureName} is a Premium benefit.</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">Upgrade to unlock higher daily AI capacity and future Premium study tools.</p>
          {onUpgrade ? (
            <button type="button" onClick={onUpgrade} disabled={isUpgrading} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
              <FiAward className="h-4 w-4" />
              {isUpgrading ? 'Preparing checkout...' : 'Upgrade to Premium'}
            </button>
          ) : (
            <Link to="/premium" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              <FiAward className="h-4 w-4" />
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default PremiumLock
