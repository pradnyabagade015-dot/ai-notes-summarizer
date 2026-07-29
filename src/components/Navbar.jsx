import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiBookOpen, FiUpload, FiLayout, FiUser, FiLogOut, FiFolder, FiEdit3, FiAward, FiHelpCircle } from 'react-icons/fi'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
            <FiBookOpen className="h-5 w-5" />
          </span>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Notes Summarizer
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-slate-600 transition hover:text-indigo-600">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/upload-notes"
                className="flex items-center gap-1.5 text-slate-600 transition hover:text-indigo-600"
              >
                <FiUpload className="h-4 w-4" />
                Upload Notes
              </Link>
              <Link
                to="/notes"
                className="flex items-center gap-1.5 text-slate-600 transition hover:text-indigo-600"
              >
                <FiFolder className="h-4 w-4" />
                My Notes
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-slate-600 transition hover:text-indigo-600"
              >
                <FiLayout className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/content-generator"
                className="flex items-center gap-1.5 text-slate-600 transition hover:text-indigo-600"
              >
                <FiEdit3 className="h-4 w-4" />
                Write
              </Link>
              <Link
                to="/premium"
                className="flex items-center gap-1.5 text-amber-600 transition hover:text-amber-700"
              >
                <FiAward className="h-4 w-4" />
                Premium
              </Link>
              <Link to="/help" className="flex items-center gap-1.5 text-slate-600 transition hover:text-indigo-600"><FiHelpCircle className="h-4 w-4" />Help</Link>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-slate-600 transition hover:text-indigo-600"
              >
                <FiUser className="h-4 w-4" />
                {user?.fullName ? user.fullName.split(' ')[0] : 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 transition hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-indigo-600 px-4 py-2 text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
