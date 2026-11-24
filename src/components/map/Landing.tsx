'use client'

import type { ReactNode } from 'react'
import type { MapContent } from './types'

export function Landing({ content, onExplore, children }: { content: MapContent; onExplore: () => void; children?: ReactNode }) {
  const { landing } = content

  return (
    <section className="map-landing">
      <div className="map-landing-center">
        <h1 className="map-hero">
          {landing.headline.map((line) => (
            <span key={line} className="map-hero-line">{line}</span>
          ))}
        </h1>
        <p className="map-subtitle">{landing.subtitle}</p>
        <button type="button" className="map-btn map-btn-primary map-cta" onClick={onExplore}>
          {landing.cta}
          <span aria-hidden="true">↓</span>
        </button>
      </div>
      {children}
    </section>
  )
}
