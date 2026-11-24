'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapReportConfig } from './types'
import { Ring } from './Ring'
import { StopModal } from './StopModal'
import { TourBar } from './TourBar'
import { nextStep, prevStep } from './tour'

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
  const { Center, Panel, content } = config
  const steps = useMemo(() => content.stops.map((s) => s.id), [content.stops])
  // Which stop's pop-up is open, or null (none).
  const [step, setStep] = useState<string | null>(null)
  const [visited, setVisited] = useState<string[]>([])

  const go = useCallback(
    (id: string | null) => {
      setStep(id)
      // A pop-up stop replaces any open drawer; a drawer stop (e.g. Meaning) opens its own.
      const target = content.stops.find((s) => s.id === id)
      onSelect(target?.panel ?? null)
      if (id) setVisited((v) => (v.includes(id) ? v : [...v, id]))
    },
    [onSelect, content.stops],
  )

  const stop = content.stops.find((s) => s.id === step) ?? null
  const panelStop = stop?.panel ? stop : null

  // Selecting from the field or a drawer: a stop's panel id (e.g. clicking MEANING)
  // opens that stop; anything else (a theme) opens in the drawer.
  const select = useCallback(
    (id: string | null) => {
      const owner = id ? content.stops.find((s) => s.panel === id) : undefined
      if (owner) return go(owner.id)
      if (id === null && panelStop) return go(null)
      onSelect(id)
    },
    [content.stops, go, onSelect, panelStop],
  )

  // Drawer "Back": from a theme opened inside Meaning/Form, return to that view; otherwise close.
  const closePanel = useCallback(() => {
    if (panelStop && selectedId !== panelStop.panel) onSelect(panelStop.panel ?? null)
    else select(null)
  }, [panelStop, selectedId, onSelect, select])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const prev = prevStep(steps, step)
  const next = nextStep(steps, step)

  // Keys while a drawer is open: Escape goes back/closes; in a drawer stop, arrows move between stops.
  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return closePanel()
      if (!panelStop || e.altKey || e.metaKey || e.ctrlKey) return
      if ((e.target as HTMLElement | null)?.tagName === 'INPUT') return
      if (e.key === 'ArrowLeft' && prev) go(prev)
      if (e.key === 'ArrowRight' && next) go(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, closePanel, panelStop, prev, next, go])

  const popupStop = stop && !stop.panel ? stop : null

  return (
    <section
      id="map"
      className={`map-stage-wrap${popupStop ? ' has-stop' : ''}${panelStop ? ' has-panel-stop' : ''}`}
      data-stop={stop?.id}
    >
      <div className="map-stage" ref={stageRef} inert={popupStop !== null}>
        <div className="map-canvas" style={{ transform: `translate(-50%, calc(-50% + var(--map-canvas-shift, 0px))) scale(${scale})` }}>
          {/* Wrapper so a report can zoom its center visual for a drawer stop (e.g. into the Meaning half). */}
          <div className="map-center">
            <Center selectedId={selectedId} onSelect={select} />
          </div>
          <Ring stops={content.stops} current={step} visited={visited} ariaLabel={content.labels.ringAria} onOpen={go} />
        </div>
        {selectedId && <Panel id={selectedId} onClose={closePanel} onSelect={select} />}
      </div>
      <div className="map-band">
        <TourBar
          stops={content.stops}
          labels={content.tour}
          current={step}
          onGo={go}
          onPrev={prev ? () => go(prev) : undefined}
          onNext={next ? () => go(next) : undefined}
        />
      </div>
      {popupStop && (
        <StopModal
          stop={popupStop}
          labels={content.labels}
          onClose={() => {
            // Return focus to the pill of the stop the reader was on (or the tour button after the intro).
            const last = step
            setStep(null)
            requestAnimationFrame(() => {
              const target = document.querySelector<HTMLElement>(`[data-stop-id="${last}"]`)
              target?.focus()
            })
          }}
          onPrev={prev ? () => go(prev) : undefined}
          onNext={next ? () => go(next) : undefined}
        />
      )}
    </section>
  )
}
