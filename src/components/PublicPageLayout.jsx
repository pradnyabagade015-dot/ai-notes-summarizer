import Seo from './Seo'

function PublicPageLayout({ title, description, eyebrow = 'AI Notes Summarizer', children }) {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.17),_transparent_34%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <Seo title={title} description={description} structuredData={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }} />
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[2rem] border border-white/80 bg-white/75 px-6 py-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </header>
        <article className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">{children}</article>
      </div>
    </section>
  )
}

export default PublicPageLayout
