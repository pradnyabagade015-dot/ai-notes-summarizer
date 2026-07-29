import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiHelpCircle, FiSearch } from 'react-icons/fi'

const faqs = [
  ['Account & Login', 'How do I sign in?', 'Use the Sign In page with your registered email and password. Use Forgot Password if you cannot access your account.'],
  ['Notes Upload', 'How do I upload notes?', 'Open Upload Notes, choose a PDF, DOCX, or TXT file, or paste your text directly. Files can be up to 20 MB.'],
  ['Notes Upload', 'Which file formats are supported?', 'AI Notes Summarizer supports PDF, DOCX, and TXT documents, plus pasted text.'],
  ['AI Summarization', 'How does AI summarization work?', 'Your note is processed to produce a concise study summary, then you can create flashcards and MCQs from the same content.'],
  ['Premium & Payments', 'How does Premium payment work?', 'Select Upgrade to Premium, complete the secure Razorpay Checkout flow, and your account is activated after payment verification.'],
  ['Premium & Payments', 'What should I do if a payment fails?', 'No plan is activated for an unverified payment. Retry once after checking your payment method, then contact support with the approximate time of the attempt.'],
  ['Troubleshooting', 'How can I contact support?', 'Use the Contact Support page to submit a ticket. You can also rate your experience and leave feedback there.'],
]

function HelpCenter() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(null)
  const filtered = useMemo(() => faqs.filter(([, question, answer]) => `${question} ${answer}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl">
    <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl sm:p-10"><FiHelpCircle className="h-8 w-8" /><h1 className="mt-4 text-3xl font-bold">How can we help?</h1><p className="mt-2 text-indigo-100">Find clear answers for your study workspace.</p>
      <label className="mt-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700"><FiSearch className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full outline-none" placeholder="Search help articles..." /></label></div>
    <div className="mt-8 space-y-3">{filtered.map(([category, question, answer], index) => <article key={question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><button type="button" onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><span><span className="block text-xs font-bold uppercase tracking-wider text-indigo-600">{category}</span><span className="mt-1 block font-semibold text-slate-900">{question}</span></span><FiChevronDown className={`shrink-0 transition ${open === index ? 'rotate-180' : ''}`} /></button>{open === index && <p className="border-t border-slate-100 px-5 py-4 text-sm leading-6 text-slate-600">{answer}</p>}</article>)}</div>
    {!filtered.length && <p className="mt-8 rounded-2xl bg-white p-8 text-center text-slate-500">No help articles matched that search.</p>}
    <p className="mt-8 text-center text-sm text-slate-600">Still need help? <Link className="font-semibold text-indigo-600" to="/support">Contact Support</Link></p>
  </div></div>
}
export default HelpCenter
