import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      navigate('/dashboard', { replace: true })
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">Welcome Back</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Sign in to your study workspace</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-indigo-100 sm:text-base">
            Continue summarizing notes, generating flashcards, and preparing for exams with your AI-powered study dashboard.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm text-slate-700 outline-none transition focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
