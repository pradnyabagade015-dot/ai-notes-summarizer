import PolicyPage from '../components/PolicyPage'

const sections = [
  { title: 'Acceptance of these terms', paragraphs: ['By using AI Notes Summarizer, you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the service.'] },
  { title: 'Our service', paragraphs: ['AI Notes Summarizer helps users transform their own study materials into summaries, flashcards, MCQs, study plans, and other AI-assisted learning content. It is a study aid, not a substitute for teaching, professional advice, or independent verification.'] },
  { title: 'Accounts and security', items: ['Provide accurate information and keep your credentials confidential.', 'You are responsible for activity performed through your account.', 'Notify us promptly if you believe your account has been accessed without permission.'] },
  { title: 'Acceptable use', items: ['Upload only content you own or have permission to use.', 'Do not use the service to violate law, infringe intellectual-property rights, distribute harmful content, bypass limits, or interfere with the platform.', 'Do not rely on generated content as a guaranteed factual, academic, medical, legal, or financial answer. Review it before use.'] },
  { title: 'Your content and intellectual property', paragraphs: ['You retain your rights in the notes and materials you submit. You grant us the limited permission needed to host, process, and transform that content to provide the service. The AI Notes Summarizer brand, interface, and original platform materials remain our intellectual property.'] },
  { title: 'Premium and Razorpay payments', paragraphs: ['Premium access, pricing, and the access period are presented at checkout. Payments are processed by Razorpay and are subject to Razorpay’s applicable terms. You authorize the charge shown before payment confirmation. If recurring billing is offered in the future, the renewal terms shown at checkout will apply.'] },
  { title: 'Availability and limitation of liability', paragraphs: ['We aim to keep the service available and useful, but it is provided on an “as available” basis. To the fullest extent permitted by law, we are not liable for indirect loss, lost study time, inaccurate AI output, or loss arising from your use of or inability to use the service. Nothing here limits rights that cannot legally be excluded.'] },
  { title: 'Suspension and termination', paragraphs: ['We may suspend or terminate access when we reasonably believe these terms, security, or applicable law have been violated. You may stop using the service at any time and request account assistance through support.'] },
  { title: 'Changes and contact', paragraphs: ['We may update these terms as the service evolves. Continued use after an updated effective date means you accept the revised terms. Questions can be sent to support@ainotessummarizer.com.'] },
]

export default function TermsAndConditions() {
  return <PolicyPage title="Terms & Conditions" description="The rules for using AI Notes Summarizer, managing an account, and accessing Premium features." sections={sections} />
}
