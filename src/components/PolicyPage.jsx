import PublicPageLayout from './PublicPageLayout'

function PolicyPage({ title, description, updatedAt = '29 July 2026', sections }) {
  return (
    <PublicPageLayout title={title} description={description} eyebrow="Legal & Trust">
      <p className="border-b border-slate-100 pb-6 text-sm text-slate-500">Last updated: {updatedAt}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && (
                <ul className="list-disc space-y-2 pl-5 marker:text-indigo-500">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </PublicPageLayout>
  )
}

export default PolicyPage
