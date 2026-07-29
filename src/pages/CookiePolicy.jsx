import PolicyPage from '../components/PolicyPage'

const sections = [
  { title: 'What cookies are', paragraphs: ['Cookies are small text files that a website can store in your browser. Similar technologies, including local storage and pixels, can serve related purposes.'] },
  { title: 'Essential cookies and storage', paragraphs: ['These are needed to keep the service secure and functional. For example, we may use browser storage to retain an authentication token after you sign in and to preserve basic application state. Disabling essential storage may prevent account-only features from working.'] },
  { title: 'Analytics cookies', paragraphs: ['If we enable analytics, analytics providers may use cookies or similar identifiers to measure aggregated traffic, understand which pages are useful, and improve performance. We will use such tools in accordance with applicable law and any required consent.'] },
  { title: 'Advertising cookies and Google AdSense', paragraphs: ['If Google AdSense is enabled, Google and its partners may use cookies to serve, personalize, limit, and measure ads. Google may use information about visits to this and other websites in accordance with its policies. Where required, we will request consent before enabling personalized advertising cookies and provide choices for non-personalized ads.'] },
  { title: 'Managing cookies', paragraphs: ['You can control cookies through your browser settings, clear browser storage, and use Google’s ad settings where available. Blocking or deleting cookies may affect how the website works.'] },
  { title: 'Changes and contact', paragraphs: ['We may update this policy when our tools or legal requirements change. Questions about cookies can be sent to support@ainotessummarizer.com.'] },
]

export default function CookiePolicy() {
  return <PolicyPage title="Cookie Policy" description="How essential storage, analytics, and Google AdSense advertising technologies may be used on our website." sections={sections} />
}
