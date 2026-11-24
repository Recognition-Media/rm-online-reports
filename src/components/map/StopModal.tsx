'use client'

import { useEffect, useRef } from 'react'
import type { MapContent, MapStop } from './types'
import { StopModule } from './modules/StopModule'
import { VoiceBlock } from './modules/VoiceBlock'

/**
 * Large pop-up for a stop. It sits between the top bar and the bottom
 * navigation (both stay usable), over a dim layer that covers only the field.
 * Escape, × and a click on the dim layer close it; ← / → (and arrow keys) move between stops.
 */
export function StopModal({
  stop,
  labels,
  onClose,
  onPrev,
  onNext,
}: {
  stop: MapStop
  labels: MapContent['labels']
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  // Keyboard: arrows move between stops wherever focus is (except inside inputs
  // like the Q10 slider); Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.altKey || e.metaKey || e.ctrlKey) return
      if ((e.target as HTMLElement | null)?.tagName === 'INPUT') return
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  // Move focus to the title whenever a new stop shows.
  const titleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    titleRef.current?.focus()
  }, [stop.id])

  const isTakeaways = stop.module.type === 'takeaways'
  const isSide = stop.layout === 'side'

  return (
    <>
      {!isSide && <div className="map-stop-scrim" onClick={onClose} aria-hidden="true" />}
      <div
        className={`map-stop${isTakeaways ? ' is-wide' : ''}${isSide ? ' is-side' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="map-stop-title"
        style={{ ['--stop-color' as string]: stop.color }}
      >
        <div className="map-stop-card">
          <div className="map-stop-controls">
            {/* aria-disabled (not disabled) so a focused arrow keeps focus at the first/last stop */}
            <button type="button" className="map-btn map-btn-secondary" onClick={() => onPrev?.()} aria-disabled={!onPrev} aria-label={labels.prevStop}>
              ←
            </button>
            <button type="button" className="map-btn map-btn-secondary" onClick={() => onNext?.()} aria-disabled={!onNext} aria-label={labels.nextStop}>
              →
            </button>
            <button type="button" className="map-btn map-btn-primary" onClick={onClose}>
              {labels.close} ×
            </button>
          </div>

          {isTakeaways ? (
            <div className="map-stop-full">
              <p className="map-stop-eyebrow">
                {labels.ringEyebrow} · {stop.number}
              </p>
              <h2 id="map-stop-title" ref={titleRef} tabIndex={-1} className="map-visually-hidden">
                {stop.title}
              </h2>
              <StopModule module={stop.module} />
            </div>
          ) : (
            <div className="map-stop-panels">
              <div className="map-stop-left">
                <p className="map-stop-eyebrow">
                  {labels.ringEyebrow} · {stop.number}
                </p>
                <h2 id="map-stop-title" ref={titleRef} tabIndex={-1}>
                  {stop.title}
                </h2>
                {stop.copy.map((p) => <p key={p}>{p}</p>)}
                {stop.voice && <VoiceBlock voice={stop.voice} labels={labels} />}
              </div>
              <div className="map-stop-right">
                <StopModule module={stop.module} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
