'use client'

import { useCallback, useEffect, useState } from 'react'
import { assetPath } from '@/lib/assetPath'
import type { InfoPanel, MapContent } from './types'
import { InfoDropdown } from './InfoDropdown'

/**
 * One bar pinned to the top of the screen: logo + nav buttons. It floats
 * over the landing art, then turns solid (with the report title) once the
 * reader has scrolled down into the report.
 */
export function TopBar({ content }: { content: MapContent }) {
  const { landing } = content
  const [open, setOpen] = useState<string | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const openPanel: InfoPanel | undefined = landing.nav.find((n) => n.label === open)?.panel
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    // Solid once the report section reaches the top of the screen.
    const onScroll = () => {
      const report = document.getElementById('map')
      setSolid(!!report && report.getBoundingClientRect().top <= 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <header className={`map-topbar${solid ? ' is-solid' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, plain img like the other templates */}
      <img className="map-topbar-logo" src={assetPath(content.logo.src)} alt={content.logo.alt} />
      <div className="map-header-title" aria-hidden={!solid}>
        <strong>{content.reportTitle}</strong>
      </div>
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
    </header>
  )
}
