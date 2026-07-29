import { FiBookOpen, FiHeart, FiTarget, FiUsers } from 'react-icons/fi'
import PublicPageLayout from '../components/PublicPageLayout'

const values = [
  { icon: FiTarget, title: 'Purposeful AI', description: 'We turn long, student-owned notes into clear study materials that make revision more focused.' },
  { icon: FiBookOpen, title: 'Learning first', description: 'Summaries, flashcards, MCQs, and study plans are designed to support understanding—not replace it.' },
  { icon: FiUsers, title: 'Built for real learners', description: 'The experience is made for students, self-learners, and busy professionals preparing for what matters next.' },
  { icon: FiHeart, title: 'Trust by design', description: 'We use secure authentication and thoughtful data practices while keeping the product simple to use.' },
]

function AboutUs() {
  return (
    <PublicPageLayout
      title="About Us"
      description="AI Notes Summarizer helps learners spend less time organizing notes and more time understanding them."
      eyebrow="Our mission"
    >
      <div className="space-y-10 text-slate-600">
        <section className="space-y-4 text-base leading-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Study material should work harder for you</h2>
          <p>AI Notes Summarizer was created for the moment when a folder of notes feels more overwhelming than helpful. Upload a PDF, DOCX, or TXT file—or paste your material—and turn it into concise summaries, revision flashcards, practice MCQs, and a practical study plan.</p>
          <p>We are built for students preparing for exams, lifelong learners building a new skill, and professionals who want to review complex material with more structure. AI assists with the first draft; you remain in control of what you learn and use.</p>
        </section>

        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">How the platform works</h2>
          <p className="mt-3 text-base leading-8">Your account is protected with secure authentication, and your saved notes and study materials are managed through our MongoDB-backed application. When you request an AI feature, the relevant study content is processed to create the output you asked for. We encourage every learner to review AI-generated material against their source notes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">What we value</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <Icon className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-100 pt-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Keep in touch</h2>
          <p className="mt-3 text-base leading-8">Your feedback helps us improve the tools learners use every day. Visit our Contact Us page for general questions, or use in-app support when you are signed in and need account-specific help.</p>
        </section>
      </div>
    </PublicPageLayout>
  )
}

export default AboutUs
