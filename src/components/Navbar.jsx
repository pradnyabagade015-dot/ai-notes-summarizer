import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <Link to="/" className="text-sm font-semibold text-slate-900">
        AI Notes Summarizer
      </Link>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <Link to="/login" className="hover:text-indigo-600">Login</Link>
        <Link to="/signup" className="hover:text-indigo-600">Signup</Link>
        <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
        <Link to="/profile" className="hover:text-indigo-600">Profile</Link>
      </div>
    </nav>
  )
}

export default Navbar
