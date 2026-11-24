'use client'

import { useEffect, useRef } from 'react'
import type { MapContent, MapStop, TourIntro } from './types'
import { StopModule } from './modules/StopModule'
import { VoiceBlock } from './modules/VoiceBlock'

/**
 * Large center pop-up for a stop (or the tour's intro card when `stop` is null).
 * Native <dialog>: focus is trapped, Escape closes, and the page behind is inert.
 */
export function StopModal({
  stop,
  intro,
  labels,
  onClose,
  onPrev,
  onNext,
}: {
  stop: MapStop | null
  intro: TourIntro
  labels: MapContent['labels']
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])

  const isTakeaways = stop?.module.type === 'takeaways'

  return (
    <dialog
      ref={ref}
      className={`map-stop${stop ? '' : ' is-intro'}${isTakeaways ? ' is-wide' : ''}`}
      aria-labelledby="map-stop-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close()
      }}
      onKeyDown={(e) => {
        // Arrow keys move between stops, except inside the slider.
        if ((e.target as HTMLElement).tagName === 'INPUT') return
        if (e.key === 'ArrowLeft' && onPrev) onPrev()
        if (e.key === 'ArrowRight' && onNext) onNext()
      }}
    >
      <div className="map-stop-card">
        <div className="map-stop-controls">
          <button type="button" className="map-btn map-btn-secondary" onClick={onPrev} disabled={!onPrev} aria-label={labels.prevStop}>
            ←
          </button>
          <button type="button" className="map-btn map-btn-secondary" onClick={onNext} disabled={!onNext} aria-label={labels.nextStop}>
            →
          </button>
          <button type="button" className="map-btn map-btn-primary" onClick={() => ref.current?.close()}>
            {labels.close} ×
          </button>
        </div>

        {stop === null ? (
          <div className="map-stop-intro">
            <h2 id="map-stop-title">{intro.title}</h2>
            {intro.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        ) : isTakeaways ? (
          <div className="map-stop-full">
            <p className="map-stop-eyebrow">
              {labels.ringEyebrow} · {stop.number}
            </p>
            <h2 id="map-stop-title" className="map-visually-hidden">{stop.title}</h2>
            <StopModule module={stop.module} />
          </div>
        ) : (
          <div className="map-stop-panels">
            <div className="map-stop-left">
              <p className="map-stop-eyebrow">
                {labels.ringEyebrow} · {stop.number}
              </p>
              <h2 id="map-stop-title">{stop.title}</h2>
              {stop.copy.map((p) => <p key={p}>{p}</p>)}
              {stop.voice && <VoiceBlock voice={stop.voice} labels={labels} />}
            </div>
            <div className="map-stop-right">
              <StopModule module={stop.module} />
            </div>
          </div>
        )}
      </div>
    </dialog>
  )
}
