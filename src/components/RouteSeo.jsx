import { useLocation } from 'react-router-dom'
import Seo from './Seo'
import { site } from '../config/site'

const publicPages = {
  '/': { title: 'AI-Powered Study Tools for Better Revision', description: site.description, type: 'WebSite' },
  '/about': { title: 'About Us', description: 'Learn how AI Notes Summarizer helps students turn study material into focused revision resources.' },
  '/contact': { title: 'Contact Us', description: 'Contact AI Notes Summarizer for general questions, account help, and Premium payment support.' },
  '/privacy-policy': { title: 'Privacy Policy', description: 'Learn how AI Notes Summarizer handles study content, account data, payments, and cookies.' },
  '/terms-and-conditions': { title: 'Terms & Conditions', description: 'Read the rules for using AI Notes Summarizer and accessing Premium features.' },
  '/refund-policy': { title: 'Refund Policy', description: 'Understand eligibility and support options for AI Notes Summarizer Premium payments via Razorpay.' },
  '/cookie-policy': { title: 'Cookie Policy', description: 'Understand essential, analytics, and Google AdSense advertising cookies on AI Notes Summarizer.' },
}

const privatePrefixes = ['/dashboard', '/notes', '/upload-notes', '/summary', '/study-planner', '/content-generator', '/profile', '/premium', '/help', '/support']
const authPrefixes = ['/login', '/signup', '/forgot-password', '/reset-password']
const privatePageDetails = [
  ['/dashboard', 'Dashboard', 'Your private AI Notes Summarizer study dashboard.'],
  ['/upload-notes', 'Upload Notes', 'Upload notes and create AI-powered study resources.'],
  ['/notes', 'My Notes', 'Manage your saved notes and study materials.'],
  ['/summary', 'Summaries', 'Review your AI-generated note summaries.'],
  ['/study-planner', 'Study Planner', 'Plan your next study session.'],
  ['/content-generator', 'Content Generator', 'Create AI-assisted study content.'],
  ['/profile', 'Profile', 'Manage your AI Notes Summarizer account.'],
  ['/premium', 'Premium', 'Manage AI Notes Summarizer Premium access.'],
  ['/help', 'Help Center', 'Find answers about AI Notes Summarizer.'],
  ['/support', 'Support', 'Contact AI Notes Summarizer support.'],
  ['/login', 'Sign In', 'Sign in to your AI Notes Summarizer account.'],
  ['/signup', 'Create Account', 'Create an AI Notes Summarizer account.'],
  ['/forgot-password', 'Reset Password', 'Request an AI Notes Summarizer password reset.'],
  ['/reset-password', 'Reset Password', 'Set a new AI Notes Summarizer password.'],
]

function RouteSeo() {
  const { pathname } = useLocation()
  const page = publicPages[pathname]
  const noIndex = !page && (privatePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) || authPrefixes.some((prefix) => pathname.startsWith(prefix)))
  const privatePage = privatePageDetails.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  const title = page?.title || privatePage?.[1] || (noIndex ? 'Account' : 'Page Not Found')
  const description = page?.description || privatePage?.[2] || (noIndex ? 'Your private AI Notes Summarizer workspace.' : 'The page you requested could not be found.')

  const structuredData = page?.type === 'WebSite'
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', name: site.name, url: site.url, description: site.description },
          { '@type': 'SoftwareApplication', name: site.name, applicationCategory: 'EducationalApplication', operatingSystem: 'Web', description: site.description, url: site.url },
        ],
      }
    : undefined

  return <Seo title={title} description={description} noIndex={noIndex} structuredData={structuredData} />
}

export default RouteSeo
