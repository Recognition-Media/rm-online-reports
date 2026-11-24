'use client'

import { useEffect, useRef } from 'react'
import type { InfoPanel } from './types'

// Native <dialog>: the browser handles focus, Escape and the backdrop.
export function InfoDialog({ panel, onClose }: { panel: InfoPanel; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="map-info-dialog"
      aria-labelledby="map-info-title"
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop (outside the box) closes it.
        if (e.target === e.currentTarget) ref.current?.close()
      }}
    >
      <div className="map-info-box">
        <button type="button" className="map-info-close" aria-label="Close" onClick={() => ref.current?.close()}>
          &#215;
        </button>
        <h2 id="map-info-title">{panel.title}</h2>
        {panel.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </dialog>
  )
}
