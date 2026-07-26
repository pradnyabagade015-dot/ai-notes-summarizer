import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import UploadNotes from './pages/UploadNotes'
import Summary from './pages/Summary'
import Flashcards from './pages/Flashcards'
import StudyPlanner from './pages/StudyPlanner'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload-notes" element={<UploadNotes />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
