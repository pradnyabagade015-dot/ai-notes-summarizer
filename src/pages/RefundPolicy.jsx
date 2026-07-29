import PolicyPage from '../components/PolicyPage'

const sections = [
  { title: 'Premium purchases', paragraphs: ['AI Notes Summarizer Premium payments are processed securely through Razorpay. The price, currency, and Premium access period shown in Razorpay Checkout apply to your purchase.'] },
  { title: 'Refund eligibility', paragraphs: ['Because Premium access and AI capacity are made available immediately after successful verification, payments are generally non-refundable once Premium has been activated or materially used. We will review eligible requests fairly where there was a duplicate charge, an unauthorized payment, or a verified technical failure that prevented access to the purchased Premium feature.'] },
  { title: 'How to request help', paragraphs: ['Email support@ainotessummarizer.com within 7 days of the payment. Include the email on your account, Razorpay payment ID or order ID, date of payment, and a short explanation. Do not send card, UPI PIN, or bank-account details by email.'] },
  { title: 'Review and processing', paragraphs: ['We may ask for additional information and verify the transaction with Razorpay before making a decision. Approved refunds are returned through the original payment method where possible and may take additional time to appear, depending on Razorpay and your bank or payment provider.'] },
  { title: 'Consumer rights', paragraphs: ['This policy does not limit any mandatory refund or consumer-protection rights that apply in your location. If a checkout page provides different terms for a specific offer, those terms apply to that offer.'] },
]

export default function RefundPolicy() {
  return <PolicyPage title="Refund Policy" description="How we handle Razorpay Premium payment questions, duplicate charges, and eligible refund requests." sections={sections} />
}
