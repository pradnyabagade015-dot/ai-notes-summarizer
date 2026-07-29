import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi'

function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await register({
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
      navigate('/upload-notes', { replace: true })
    } catch (err) {
      console.error('[Signup] Auth error:', err)
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">Create Account</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Start your smarter study journey</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-indigo-100 sm:text-base">
            Join AI Notes Summarizer and turn your notes into summaries, flashcards, and exam prep materials.
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
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

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
                  required
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
                  placeholder="Create a password"
                  required
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm text-slate-700 outline-none transition focus:border-indigo-500"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
