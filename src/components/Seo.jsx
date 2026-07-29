import { useEffect } from 'react'
import { absoluteUrl, site } from '../config/site'

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [, key] = selector.match(/\[(?:name|property)="(.+)"\]/) || []
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = value
}

function Seo({ title, description, noIndex = false, structuredData }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${site.name}` : site.name
    const canonicalUrl = absoluteUrl(window.location.pathname)
    document.title = pageTitle

    setMeta('meta[name="description"]', 'name', description)
    setMeta('meta[name="robots"]', 'name', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', 'property', pageTitle)
    setMeta('meta[property="og:description"]', 'property', description)
    setMeta('meta[property="og:type"]', 'property', 'website')
    setMeta('meta[property="og:url"]', 'property', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', absoluteUrl(site.socialImage))
    setMeta('meta[name="twitter:card"]', 'name', 'summary')
    setMeta('meta[name="twitter:title"]', 'name', pageTitle)
    setMeta('meta[name="twitter:description"]', 'name', description)
    setMeta('meta[name="twitter:image"]', 'name', absoluteUrl(site.socialImage))

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    const existingSchema = document.getElementById('site-structured-data')
    if (structuredData) {
      const schema = existingSchema || document.createElement('script')
      schema.id = 'site-structured-data'
      schema.type = 'application/ld+json'
      schema.textContent = JSON.stringify(structuredData)
      if (!existingSchema) document.head.appendChild(schema)
    } else {
      existingSchema?.remove()
    }
  }, [title, description, noIndex, structuredData])

  return null
}

export default Seo
