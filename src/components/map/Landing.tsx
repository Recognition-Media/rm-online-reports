'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { assetPath } from '@/lib/assetPath'
import type { InfoPanel, MapContent } from './types'
import { InfoDropdown } from './InfoDropdown'

export function Landing({ content, onExplore, children }: { content: MapContent; onExplore: () => void; children?: ReactNode }) {
  const { landing } = content
  const [open, setOpen] = useState<string | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const openPanel: InfoPanel | undefined = landing.nav.find((n) => n.label === open)?.panel

  return (
    <section className="map-landing">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, plain img like the other templates */}
      <img className="map-landing-logo" src={assetPath(content.logo.src)} alt={content.logo.alt} />
      <nav className="map-nav">
        {landing.nav.map((n) => {
          const cls = 'map-btn map-btn-secondary'
          if (n.panel) {
            const isOpen = open === n.label
            return (
              <button
                key={n.label}
                type="button"
                className={cls}
                aria-expanded={isOpen}
                aria-controls={isOpen ? 'map-info' : undefined}
                onClick={() => setOpen(isOpen ? null : n.label)}
              >
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
        {openPanel && <InfoDropdown id="map-info" panel={openPanel} onClose={close} />}
      </nav>
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
