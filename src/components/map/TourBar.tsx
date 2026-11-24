'use client'

import type { MapContent, MapStop } from './types'

export function TourBar({
  stops,
  labels,
  current,
  isLast,
  onGo,
  onPrev,
  onNext,
}: {
  stops: MapStop[]
  labels: MapContent['tour']
  current: string | null
  isLast: boolean
  onGo: (id: string) => void
  onPrev: () => void
  onNext: () => void
}) {
  const primary = current === null ? labels.start : isLast ? labels.end : labels.next
  return (
    <nav className="map-tour" aria-label={labels.aria}>
      <button type="button" className="map-tour-prev" onClick={onPrev} disabled={current === null} aria-label={labels.prev}>
        ←
      </button>
      <ol className="map-tour-steps">
        {stops.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`map-tour-pill${current === s.id ? ' is-current' : ''}`}
              aria-current={current === s.id ? 'step' : undefined}
              onClick={() => onGo(s.id)}
            >
              {s.tourLabel ?? s.number}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="map-btn map-btn-secondary map-tour-next" onClick={onNext}>
        {primary} <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}
