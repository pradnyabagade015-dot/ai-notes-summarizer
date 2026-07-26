import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> {' | '}
      <Link to="/login">Login</Link> {' | '}
      <Link to="/signup">Signup</Link> {' | '}
      <Link to="/dashboard">Dashboard</Link> {' | '}
      <Link to="/profile">Profile</Link>
    </nav>
  )
}

export default Navbar
