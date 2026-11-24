'use client'

import { useState } from 'react'
import { assetPath } from '@/lib/assetPath'
import type { InfoPanel, MapContent } from './types'
import { InfoDialog } from './InfoDialog'

export function Landing({ content }: { content: MapContent }) {
  const { landing } = content
  const [openPanel, setOpenPanel] = useState<InfoPanel | null>(null)

  return (
    <section className="map-landing">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, plain img like the other templates */}
      <img className="map-landing-logo" src={assetPath(content.logo.src)} alt={content.logo.alt} />
      <nav className="map-nav">
        {landing.nav.map((n) => {
          const cls = n.primary ? 'is-primary' : undefined
          if (n.panel) {
            const panel = n.panel
            return (
              <button key={n.label} type="button" className={cls} onClick={() => setOpenPanel(panel)}>
                {n.label}
              </button>
            )
          }
          return (
            <a
              key={n.label}
              href={n.href}
              className={cls}
              {...(n.href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {n.label}
            </a>
          )
        })}
      </nav>
      <div className="map-landing-center">
        <h1 className="map-hero">
          {landing.headline.map((line) => (
            <span key={line} className="map-hero-line">{line}</span>
          ))}
        </h1>
        <p className="map-subtitle">{landing.subtitle}</p>
      </div>
      {openPanel && <InfoDialog panel={openPanel} onClose={() => setOpenPanel(null)} />}
    </section>
  )
}
