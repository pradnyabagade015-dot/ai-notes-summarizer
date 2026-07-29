import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiAward, FiCheck, FiZap } from 'react-icons/fi'
import PremiumLock from '../components/PremiumLock'
import { useAuth } from '../context/AuthContext'
import { apiCreatePremiumOrder, apiVerifyRazorpayPayment } from '../services/api'
import { useNotification } from '../context/NotificationContext'

const benefits = [
  '100 AI requests per day',
  'AI summaries, chat, MCQs, flashcards, and writing tools',
  'Higher daily capacity for active study sessions',
  'Priority access to future premium features',
]

let razorpayScriptPromise

const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve()
  if (razorpayScriptPromise) return razorpayScriptPromise

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout. Please try again.'))
    document.body.appendChild(script)
  })
  return razorpayScriptPromise
}

function Premium() {
  const { user, refreshUser } = useAuth()
  const { notify } = useNotification()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [message, setMessage] = useState(null)
  const verificationStarted = useRef(false)

  const handleUpgrade = async () => {
    try {
      setMessage(null)
      setIsUpgrading(true)
      verificationStarted.current = false

      const { order } = await apiCreatePremiumOrder()
      await loadRazorpayCheckout()
      if (!window.Razorpay) throw new Error('Razorpay Checkout is unavailable. Please try again.')

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'AI Notes Summarizer',
        description: 'Premium plan',
        order_id: order.orderId,
        prefill: { name: user?.fullName || '', email: user?.email || '' },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          verificationStarted.current = true
          try {
            await apiVerifyRazorpayPayment({
              paymentAttemptId: String(order.paymentAttemptId),
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await refreshUser()
            notify('Payment successful — Premium is now active.')
            setMessage({ type: 'success', text: 'Payment verified. Your Premium plan is now active.' })
          } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Payment verification failed. Please contact support if you were charged.' })
          } finally {
            setIsUpgrading(false)
          }
        },
        modal: {
          ondismiss: () => {
            if (!verificationStarted.current) {
              setIsUpgrading(false)
              setMessage({ type: 'error', text: 'Checkout was closed before payment was completed.' })
            }
          },
        },
      })
      checkout.on('payment.failed', (response) => {
        setIsUpgrading(false)
        setMessage({ type: 'error', text: response.error?.description || 'Payment was not completed. Please try again.' })
      })
      checkout.open()
    } catch (error) {
      setIsUpgrading(false)
      setMessage({ type: 'error', text: error.message || 'Unable to start Razorpay Checkout.' })
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-indigo-100 bg-white/90 p-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200">
            <FiAward className="h-7 w-7" />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-indigo-600">AI Notes Summarizer Premium</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">More room for every study session</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">Premium raises your daily AI allowance while keeping every study tool in one place.</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Free</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">10 <span className="text-base font-medium text-slate-500">AI requests / day</span></p>
            <p className="mt-3 text-sm text-slate-600">A generous daily allowance to explore the study tools.</p>
          </section>

          <section className="rounded-3xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-indigo-100">Premium</p>
              <FiZap className="h-5 w-5 text-amber-300" />
            </div>
            <p className="mt-3 text-3xl font-bold">₹199 <span className="text-base font-medium text-indigo-100">/ month</span></p>
            <p className="mt-2 text-xl font-bold">100 <span className="text-base font-medium text-indigo-100">AI requests / day</span></p>
            <p className="mt-3 text-sm text-indigo-100">Advanced study tools, expanded summaries and MCQs, plus priority support.</p>
            <ul className="mt-5 space-y-3 text-sm text-indigo-50">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2"><FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{benefit}</li>
              ))}
            </ul>
            <div className="mt-7">
              <PremiumLock featureName="Premium study capacity" onUpgrade={handleUpgrade} isUpgrading={isUpgrading}>
                <p className="rounded-xl bg-white/15 px-4 py-3 text-center text-sm font-semibold">Your Premium plan is active.</p>
              </PremiumLock>
            </div>
          </section>
        </div>

        {message && (
          <p className={`mx-auto mt-6 max-w-2xl rounded-xl border px-4 py-3 text-center text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
            {message.text}
          </p>
        )}
        <div className="mt-8 text-center"><Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Back to dashboard</Link></div>
      </div>
    </div>
  )
}

export default Premium
