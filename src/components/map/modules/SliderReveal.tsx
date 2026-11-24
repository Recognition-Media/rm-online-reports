'use client'

import { useState } from 'react'
import type { SliderRevealModule } from '../types'

export function SliderReveal({ m }: { m: SliderRevealModule }) {
  const [guess, setGuess] = useState(50)
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="map-mod map-mod-slider">
      {m.source && <p className="map-mod-source">{m.source}</p>}
      <p className="map-mod-question">{m.question}</p>
      <div className="map-slider">
        <input
          type="range"
          min={0}
          max={100}
          value={guess}
          onChange={(e) => setGuess(Number(e.target.value))}
          disabled={revealed}
          aria-label={m.question}
        />
        {revealed && <span className="map-slider-answer" style={{ left: `${m.value}%` }} aria-hidden="true" />}
        <div className="map-slider-scale">
          <span>{m.minLabel}</span>
          <span>{m.maxLabel}</span>
        </div>
      </div>
      {!revealed ? (
        <button type="button" className="map-btn map-btn-primary" onClick={() => setRevealed(true)}>
          {m.revealButton}
        </button>
      ) : (
        <div className="map-mod-reveal" aria-live="polite">
          <p className="map-mod-big">
            {m.value}
            <span>/100</span>
          </p>
          <p className="map-mod-label">{m.valueLabel}</p>
          <p className="map-mod-guess">
            {m.guessLabel}: {guess}
          </p>
          <ul className="map-mod-lines">
            {m.lines.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
