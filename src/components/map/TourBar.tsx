'use client'

import type { MapContent, MapStop } from './types'

/**
 * Bottom navigation on the field page: a hint, ← / →, and a pill per stop.
 * Stays usable while a stop pop-up is open (the pop-up sits above it, not over it).
 */
export function TourBar({
  stops,
  labels,
  current,
  onGo,
  onPrev,
  onNext,
}: {
  stops: MapStop[]
  labels: MapContent['tour']
  current: string | null
  onGo: (id: string) => void
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <nav className="map-tour" aria-label={labels.aria}>
      <p className="map-tour-hint">
        {labels.hint} <span aria-hidden="true">→</span>
      </p>
      <button type="button" className="map-tour-arrow" onClick={() => onPrev?.()} aria-disabled={!onPrev} aria-label={labels.prev}>
        ←
      </button>
      <ol className="map-tour-steps">
        {stops.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`map-tour-pill${current === s.id ? ' is-current' : ''}`}
              style={{ ['--stop-color' as string]: s.color }}
              aria-current={current === s.id ? 'step' : undefined}
              aria-label={`${s.number} ${s.title}`}
              onClick={() => onGo(s.id)}
            >
              {s.tourLabel ?? s.number}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="map-tour-arrow" onClick={() => onNext?.()} aria-disabled={!onNext} aria-label={labels.next}>
        →
      </button>
    </nav>
  )
}
