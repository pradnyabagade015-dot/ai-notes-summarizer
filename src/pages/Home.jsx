import {
  FiZap,
  FiBookOpen,
  FiLayers,
  FiCalendar,
  FiGlobe,
  FiVolume2,
  FiUpload,
  FiCpu,
  FiTarget,
} from 'react-icons/fi'

const features = [
  {
    icon: FiZap,
    title: 'AI Summaries',
    description: 'Generate clear and concise summaries in seconds.',
  },
  {
    icon: FiBookOpen,
    title: 'Flashcards',
    description: 'Create smart flashcards for faster memorization.',
  },
  {
    icon: FiLayers,
    title: 'AI MCQs',
    description: 'Generate multiple-choice questions automatically.',
  },
  {
    icon: FiCalendar,
    title: 'Study Planner',
    description: 'Organize your study schedule with AI assistance.',
  },
  {
    icon: FiGlobe,
    title: 'Multi-language Support',
    description: 'Translate notes into multiple languages.',
  },
  {
    icon: FiVolume2,
    title: 'Text-to-Speech',
    description: 'Listen to your notes anytime.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Upload Your Notes',
    description: 'Upload PDF, DOCX, or TXT files, or simply paste your notes.',
    icon: FiUpload,
  },
  {
    number: '02',
    title: 'AI Processes Everything',
    description: 'Gemini AI analyzes your notes and generates summaries, key points, flashcards, and MCQs.',
    icon: FiCpu,
  },
  {
    number: '03',
    title: 'Study Smarter',
    description: 'Review summaries, practice with quizzes, save your notes, and prepare for exams faster.',
    icon: FiTarget,
  },
]

function Home() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-16">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm">
            <span className="mr-2 text-base">🚀</span>
            AI-Powered Learning
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Study Smarter with AI Notes Summarizer
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            Upload your notes and instantly get AI-powered summaries, flashcards, MCQs, chapter-wise explanations, and exam questions.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <button className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-indigo-700">
              Get Started
            </button>
            <button className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:text-indigo-700">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 shadow-2xl transition duration-300 hover:-translate-y-2 sm:p-8">
            <div className="rounded-[1.5rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400"></span>
                <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">Chapter Summary</p>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Ready
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    Concise insights generated from your uploaded notes.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm font-medium text-slate-200">Flashcards</p>
                    <p className="mt-1 text-sm text-slate-400">10 cards created</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm font-medium text-slate-200">MCQs</p>
                    <p className="mt-1 text-sm text-slate-400">12 questions ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Study Smarter
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Our AI helps students save time and improve learning with powerful study tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Start studying smarter in just three simple steps.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="group rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)]"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  {step.number}
                </div>
                <div className="mb-4 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Home
