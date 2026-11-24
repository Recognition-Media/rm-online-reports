'use client'

import { useEffect, useRef, useState } from 'react'
import type { MapReportConfig } from './types'

const W = 1440
const H = 900

export function MapStage({
  config,
  locked,
  onUnlock,
  selectedId,
  onSelect,
}: {
  config: MapReportConfig
  locked: boolean
  onUnlock: () => void
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const { content, Center, Panel } = config

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onSelect(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, onSelect])

  return (
    <section id="map" className={`map-stage-wrap${locked ? ' is-locked' : ''}`}>
      <header className="map-header">
        <div className="map-brand">
          {content.brandLines.map((l) => <div key={l}>{l}</div>)}
        </div>
        <div className="map-header-title">
          {content.reportTitle} · <span>{content.reportSubtitle}</span>
        </div>
        <div aria-hidden="true" />
      </header>
      {/* inert: while locked, nothing in the blurred field can be focused, clicked or read. */}
      <div className="map-stage" ref={stageRef} inert={locked}>
        <div className="map-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Center selectedId={selectedId} onSelect={onSelect} />
        </div>
        {selectedId && !locked && <Panel id={selectedId} onClose={() => onSelect(null)} />}
      </div>
      {locked && (
        <div className="map-focus-lock">
          <p>{content.focusLock.eyebrow}</p>
          <h2>{content.focusLock.headline}</h2>
          <button type="button" className="map-button" onClick={onUnlock}>
            {content.focusLock.button}
          </button>
        </div>
      )}
    </section>
  )
}
