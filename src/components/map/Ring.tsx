'use client'

import type { MapStop } from './types'
import { PILL_HEIGHT, pillLabel, pillWidth } from './ringGeometry'

export function Ring({
  stops,
  current,
  visited,
  ariaLabel,
  onOpen,
}: {
  stops: MapStop[]
  current: string | null
  visited: string[]
  ariaLabel: string
  onOpen: (id: string) => void
}) {
  return (
    <nav className="map-ring" aria-label={ariaLabel}>
      {stops.map((s) => {
        const w = pillWidth(pillLabel(s))
        const cls = `map-ring-stop${current === s.id ? ' is-current' : ''}${visited.includes(s.id) ? ' is-visited' : ''}`
        return (
          <button
            key={s.id}
            type="button"
            className={cls}
            style={{ left: s.position.x - w / 2, top: s.position.y - PILL_HEIGHT / 2, width: w, height: PILL_HEIGHT }}
            data-stop-id={s.id}
            onClick={() => onOpen(s.id)}
            aria-current={current === s.id ? 'step' : undefined}
          >
            <span className="map-ring-num">{s.number}</span> {s.title}
          </button>
        )
      })}
    </nav>
  )
}
