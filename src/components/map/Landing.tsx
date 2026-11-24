import { assetPath } from '@/lib/assetPath'
import type { MapContent } from './types'

export function Landing({ content }: { content: MapContent }) {
  const { landing } = content
  return (
    <section className="map-landing">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, plain img like the other templates */}
      <img className="map-landing-logo" src={assetPath(content.logo.src)} alt={content.logo.alt} />
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
      <div className="map-landing-center">
        <h1 className="map-hero">
          {landing.headline.map((line) => (
            <span key={line} className="map-hero-line">{line}</span>
          ))}
        </h1>
        <p className="map-subtitle">{landing.subtitle}</p>
      </div>
    </section>
  )
}
