'use client'

import { useState } from 'react'
import type { MapContent } from './types'

// The input is UI only for now: nothing is saved. Storing answers has
// its own spec before launch.
export function PromptBar({ prompt }: { prompt: MapContent['prompt'] }) {
  const [value, setValue] = useState('')
  // Rendered twice so the -50% scroll loops seamlessly.
  const items = [...prompt.ticker, ...prompt.ticker]

  return (
    <div className="map-prompt">
      <form
        className="map-prompt-form"
        onSubmit={(e) => {
          e.preventDefault()
          setValue('')
        }}
      >
        <label htmlFor="map-prompt-input">{prompt.question}</label>
        <input
          id="map-prompt-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={prompt.placeholder}
          maxLength={200}
        />
        <button type="submit" disabled={!value.trim()}>{prompt.button}</button>
      </form>
      <div className="map-ticker" aria-hidden="true">
        <div className="map-ticker-track">
          {items.map((item, i) => (
            <span key={i} className="map-ticker-item">
              <span className="map-ticker-dot" style={{ background: item.color }} />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
