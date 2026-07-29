import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import UploadNotes from './pages/UploadNotes'
import NotesLibrary from './pages/NotesLibrary'
import Summary from './pages/Summary'
import Flashcards from './pages/Flashcards'
import MCQsPage from './pages/MCQsPage'
import ChatWithNotes from './pages/ChatWithNotes'
import ContentGenerator from './pages/ContentGenerator'
import StudyPlanner from './pages/StudyPlanner'
import Profile from './pages/Profile'
import Premium from './pages/Premium'
import NotFound from './pages/NotFound'
import HelpCenter from './pages/HelpCenter'
import Support from './pages/Support'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <AuthProvider><NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<NotesLibrary />} />
              <Route path="/upload-notes" element={<UploadNotes />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/notes/:noteId/flashcards" element={<Flashcards />} />
              <Route path="/notes/:noteId/mcqs" element={<MCQsPage />} />
              <Route path="/notes/:noteId/chat" element={<ChatWithNotes />} />
              <Route path="/study-planner" element={<StudyPlanner />} />
              <Route path="/content-generator" element={<ContentGenerator />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/support" element={<Support />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider></AuthProvider>
  )
}

export default App
