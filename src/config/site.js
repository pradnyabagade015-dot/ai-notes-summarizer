export const site = {
  name: 'AI Notes Summarizer',
  description: 'Turn study notes into AI-powered summaries, flashcards, MCQs, and study plans.',
  // Set VITE_SITE_URL to your real production domain in Vercel before launch.
  url: (import.meta.env.VITE_SITE_URL || 'https://ainotessummarizer.com').replace(/\/$/, ''),
  supportEmail: 'support@ainotessummarizer.com',
  socialImage: '/app-icon.svg',
}

export const absoluteUrl = (path = '/') => `${site.url}${path.startsWith('/') ? path : `/${path}`}`
