import type { SliderRevealModule } from '../types'

/** A 0–100 score shown on the green → red scale, with the answer marked (always open, no guessing). */
export function SliderReveal({ m }: { m: SliderRevealModule }) {
  return (
    <div className="map-mod map-mod-slider">
      {m.source && <p className="map-mod-source">{m.source}</p>}
      <p className="map-mod-question">{m.question}</p>
      <div className="map-scale" role="img" aria-label={`${m.value} out of 100`}>
        <div className="map-scale-track">
          <span className="map-scale-knob" style={{ left: `${m.value}%` }} />
        </div>
        <div className="map-slider-scale">
          <span>{m.minLabel}</span>
          <span>{m.maxLabel}</span>
        </div>
      </div>
      <div className="map-mod-reveal">
        <p className="map-mod-big">
          {m.value}
          <span>/100</span>
        </p>
        <p className="map-mod-label">{m.valueLabel}</p>
        <ul className="map-mod-lines">
          {m.lines.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </div>
    </div>
  )
}
