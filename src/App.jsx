import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import { NotificationProvider } from './context/NotificationContext'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const UploadNotes = lazy(() => import('./pages/UploadNotes'))
const NotesLibrary = lazy(() => import('./pages/NotesLibrary'))
const Summary = lazy(() => import('./pages/Summary'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const MCQsPage = lazy(() => import('./pages/MCQsPage'))
const ChatWithNotes = lazy(() => import('./pages/ChatWithNotes'))
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'))
const StudyPlanner = lazy(() => import('./pages/StudyPlanner'))
const Profile = lazy(() => import('./pages/Profile'))
const Premium = lazy(() => import('./pages/Premium'))
const NotFound = lazy(() => import('./pages/NotFound'))
const HelpCenter = lazy(() => import('./pages/HelpCenter'))
const Support = lazy(() => import('./pages/Support'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))

function App() {
  return (
    <AuthProvider><NotificationProvider>
      <BrowserRouter>
        <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-50 p-4 text-sm font-medium text-slate-600" aria-live="polite">Loading page…</main>}>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

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
        </Suspense>
      </BrowserRouter>
    </NotificationProvider></AuthProvider>
  )
}

export default App
