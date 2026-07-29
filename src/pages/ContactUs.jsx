import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiMail, FiMessageCircle, FiShield } from 'react-icons/fi'
import PublicPageLayout from '../components/PublicPageLayout'

const supportEmail = 'support@ainotessummarizer.com'

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(`[AI Notes Summarizer] ${form.subject}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    setStatus('Your email app is opening with your message addressed to our support team.')
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
  }

  return (
    <PublicPageLayout
      title="Contact Us"
      description="Questions about AI Notes Summarizer, your account, or Premium? Our support team is here to help."
      eyebrow="Support"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-5">
          <div className="rounded-3xl bg-slate-950 p-6 text-slate-300">
            <FiMail className="h-7 w-7 text-indigo-300" />
            <h2 className="mt-4 text-xl font-bold text-white">Email support</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">For general questions, email us at:</p>
            <a href={`mailto:${supportEmail}`} className="mt-3 inline-block break-all text-sm font-semibold text-indigo-300 hover:text-white">{supportEmail}</a>
            <p className="mt-4 text-xs leading-5 text-slate-500">Replace this placeholder address with your verified production support inbox before launch.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <FiMessageCircle className="h-6 w-6 text-indigo-600" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">Need account help?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Signed-in users can create a private support ticket for notes, login, or Razorpay Premium payment issues.</p>
            <Link to="/support" className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700">Open in-app support →</Link>
          </div>

          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            <FiShield className="mt-0.5 h-5 w-5 shrink-0" />
            <p>Do not email passwords, UPI PINs, card details, or other sensitive payment credentials.</p>
          </div>
        </aside>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Send us a message</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">This form prepares an email to our support address so you can review it before sending.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Name<input required name="name" value={form.name} onChange={updateField} autoComplete="name" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
              <label className="text-sm font-medium text-slate-700">Email<input required type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            </div>
            <label className="block text-sm font-medium text-slate-700">Subject<input required name="subject" value={form.subject} onChange={updateField} maxLength="120" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="How can we help?" /></label>
            <label className="block text-sm font-medium text-slate-700">Message<textarea required name="message" value={form.message} onChange={updateField} minLength="10" maxLength="2000" rows="7" className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Share the details of your question or issue..." /></label>
            <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700">Prepare support email</button>
            {status && <p role="status" className="flex items-center gap-2 text-sm text-emerald-700"><FiCheckCircle />{status}</p>}
          </form>
        </section>
      </div>
    </PublicPageLayout>
  )
}

export default ContactUs
