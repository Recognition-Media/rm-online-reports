'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapReportConfig } from './types'
import { Ring } from './Ring'
import { StopModal } from './StopModal'
import { TourBar } from './TourBar'
import { Ticker } from './Ticker'
import { INTRO, nextStep, prevStep, tourSteps } from './tour'

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
  const steps = useMemo(() => tourSteps(content.stops.map((s) => s.id)), [content.stops])
  // Which pop-up is open: INTRO, a stop id, or null (none).
  const [step, setStep] = useState<string | null>(null)
  const [visited, setVisited] = useState<string[]>([])

  const go = useCallback(
    (id: string | null) => {
      setStep(id)
      if (id) {
        onSelect(null) // a stop pop-up replaces any open drawer
        setVisited((v) => (v.includes(id) ? v : [...v, id]))
      }
    },
    [onSelect],
  )

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

  const stop = content.stops.find((s) => s.id === step) ?? null
  const prev = prevStep(steps, step)
  const next = nextStep(steps, step)

  return (
    <section id="map" className="map-stage-wrap">
      <div className="map-stage" ref={stageRef}>
        <div className="map-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Center selectedId={selectedId} onSelect={onSelect} />
          <Ring stops={content.stops} current={step} visited={visited} ariaLabel={content.labels.ringAria} onOpen={go} />
        </div>
        {selectedId && <Panel id={selectedId} onClose={() => onSelect(null)} onSelect={onSelect} />}
      </div>
      <div className="map-band">
        <TourBar
          stops={content.stops}
          labels={content.tour}
          current={step}
          isLast={step === steps[steps.length - 1]}
          onGo={go}
          onPrev={() => go(prev)}
          onNext={() => go(next)}
        />
        <Ticker
          label={content.tickerLabel}
          items={content.ticker}
          className={`map-ticker-field${step !== null ? ' is-muted' : ''}`}
        />
      </div>
      {step !== null && (
        <StopModal
          stop={step === INTRO ? null : stop}
          intro={content.tour.intro}
          labels={content.labels}
          onClose={() => {
            // Return focus to the pill of the stop the reader was on (or the tour button after the intro).
            const last = step
            setStep(null)
            requestAnimationFrame(() => {
              const target = document.querySelector<HTMLElement>(`[data-stop-id="${last}"]`) ?? document.querySelector<HTMLElement>('.map-tour-next')
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
