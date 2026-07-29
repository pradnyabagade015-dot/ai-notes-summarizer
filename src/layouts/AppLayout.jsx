import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RouteSeo from '../components/RouteSeo'

function AppLayout() {
  return (
    <div>
      <a href="#main-content" className="sr-only z-[100] rounded-b-lg bg-indigo-700 px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-0">Skip to main content</a>
      <RouteSeo />
      <Navbar />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
