import { Link } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'

const quickLinks = [{ label: 'Home', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Upload Notes', to: '/upload-notes' }, { label: 'Profile', to: '/profile' }]
const features = [{ label: 'AI Summaries', to: '/upload-notes' }, { label: 'Flashcards', to: '/notes' }, { label: 'MCQs', to: '/notes' }, { label: 'Study Planner', to: '/study-planner' }]

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white">
            <span className="mr-2 text-base">📝</span>
            AI Notes Summarizer
          </div>
          <p className="text-sm leading-7 text-slate-400">
            Turn your class notes into clear summaries, flashcards, quizzes, and study plans with the power of AI.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 lg:min-w-[480px]">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Features</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {features.map((feature) => (
                <li key={feature.label}><Link to={feature.to} className="transition hover:text-white">{feature.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <FiMail className="h-4 w-4" />
                <a href="mailto:hello@ainotessummarizer.com" className="transition hover:text-white">
                  hello@ainotessummarizer.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        © 2026 AI Notes Summarizer. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
