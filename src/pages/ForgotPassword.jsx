import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { apiRequestPasswordReset, apiResetPassword } from '../services/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!token && !email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (token && password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (token) {
        const response = await apiResetPassword(token, password)
        setMessage(response.message)
        setPassword('')
        window.setTimeout(() => navigate('/login'), 1500)
      } else {
        const response = await apiRequestPasswordReset(email.trim())
        setMessage(response.message)
        setEmail('')
      }
    } catch (err) {
      setError(err.message || 'Unable to process your request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">Reset Password</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{token ? 'Choose a new password' : 'Recover your account'}</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-indigo-100 sm:text-base">
            {token ? 'Choose a secure new password for your account.' : 'Enter your email and we will send you a password reset link so you can get back into your account.'}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {!token ? <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none ring-0 transition focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div> : <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">New Password</label>
              <input id="password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500" placeholder="At least 6 characters" required />
            </div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending...' : token ? 'Reset Password' : 'Send Reset Link'}
            </button>

            <div className="text-center text-sm text-slate-600">
              <Link to="/login" className="inline-flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700">
                <FiArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
