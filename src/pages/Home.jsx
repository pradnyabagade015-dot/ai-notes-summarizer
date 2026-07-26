import { useState } from 'react'
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
  FiChevronDown,
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

const stats = [
  {
    number: '10x',
    title: 'Faster Revision',
    description: 'Summarize lengthy notes in seconds.',
  },
  {
    number: '99%',
    title: 'Accurate AI Summaries',
    description: 'Powered by advanced Gemini AI.',
  },
  {
    number: '24/7',
    title: 'Available Anytime',
    description: 'Study whenever you want.',
  },
  {
    number: 'Unlimited',
    title: 'Notes Supported',
    description: 'Upload as many notes as you need.',
  },
]

const testimonials = [
  {
    name: 'Aisha Sharma',
    role: 'Engineering Student',
    review: 'This AI summarizer helped me prepare for exams in half the time.',
    initials: 'AS',
  },
  {
    name: 'Rahul Patil',
    role: 'Medical Student',
    review: 'The flashcards and MCQs are amazing for quick revision.',
    initials: 'RP',
  },
  {
    name: 'Sneha Verma',
    role: 'Computer Science Student',
    review: 'I love how simple and fast the summaries are.',
    initials: 'SV',
  },
]

const faqs = [
  {
    question: 'Which file formats are supported?',
    answer: 'You can upload PDF, DOCX, and TXT files, or paste notes directly into the platform.',
  },
  {
    question: 'Can I generate MCQs?',
    answer: 'Yes, the platform can generate multiple-choice questions from your uploaded content.',
  },
  {
    question: 'Does it support multiple languages?',
    answer: 'Yes, it supports multiple languages so you can study and translate notes more easily.',
  },
  {
    question: 'Can I save my summaries?',
    answer: 'Yes, your summaries and generated study materials can be saved for later review.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Your data is handled securely and the app is designed with privacy in mind.',
  },
  {
    question: 'Is it free to use?',
    answer: 'The app offers a free experience for getting started with study tools and summaries.',
  },
]

function Home() {
  const [openFaq, setOpenFaq] = useState(0)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }
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

      <div className="mx-auto mt-16 max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Why Students Love AI Notes Summarizer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Everything you need to study faster, smarter, and with more confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2 text-lg font-semibold text-white shadow-lg">
                {stat.number}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{stat.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            What Students Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Thousands of students are studying smarter with AI Notes Summarizer.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{testimonial.name}</h3>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">“{testimonial.review}”</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                  <FiChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-center text-white shadow-[0_20px_60px_rgba(99,102,241,0.25)] sm:p-10 lg:p-14">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Ready to Study Smarter?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-50 sm:text-xl">
          Join students using AI to summarize notes, create flashcards, and prepare for exams faster.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition duration-300 hover:-translate-y-1 hover:bg-slate-100">
            Get Started
          </button>
          <button className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/20">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

export default Home
