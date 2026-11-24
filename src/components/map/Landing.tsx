import type { MapContent } from './types'

export function Landing({ content }: { content: MapContent }) {
  const { landing } = content
  return (
    <section className="map-landing">
      <div className="map-landing-top">
        <div className="map-brand">
          {content.brandLines.map((l) => <div key={l}>{l}</div>)}
        </div>
        <nav className="map-nav">
          {landing.nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className={n.primary ? 'is-primary' : undefined}
              {...(n.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <span className="map-eyebrow">{landing.eyebrow}</span>
      <h1 className="map-hero">
        {landing.headlineTop}
        <br />
        <span className="map-hero-circled">
          {landing.headlineCircled}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="50" cy="20" rx="49" ry="19" vectorEffect="non-scaling-stroke" />
          </svg>
        </span>
      </h1>
      <p className="map-subtitle">{landing.subtitle}</p>
    </section>
  )
}
