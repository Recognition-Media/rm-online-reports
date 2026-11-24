'use client'

import { useEffect, useRef, useState } from 'react'
import { assetPath } from '@/lib/assetPath'
import type { MapReportConfig } from './types'

const W = 1440
const H = 900

export function MapStage({
  config,
  selectedId,
  onSelect,
}: {
  config: MapReportConfig
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
    <section id="map" className="map-stage-wrap">
      <header className="map-header">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, plain img like the other templates */}
        <img className="map-header-logo" src={assetPath(content.logo.src)} alt={content.logo.alt} />
        <div className="map-header-title">
          <strong>{content.reportTitle}</strong>
          <span>{content.reportSubtitle}</span>
        </div>
        <div aria-hidden="true" />
      </header>
      <div className="map-stage" ref={stageRef}>
        <div className="map-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Center selectedId={selectedId} onSelect={onSelect} />
        </div>
        {selectedId && <Panel id={selectedId} onClose={() => onSelect(null)} />}
      </div>
    </section>
  )
}
