'use client'

import { useEffect, useRef } from 'react'
import type { InfoPanel } from './types'

/**
 * A box that drops down from its nav button. Closes on Escape, the ×
 * button, or a click anywhere outside the nav. `onClose` must be stable
 * (wrap it in useCallback) so focus isn't reset on every render.
 */
export function InfoDropdown({ id, panel, onClose }: { id: string; panel: InfoPanel; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = ref.current
    // The nav button that controls this box (not activeElement: Safari doesn't focus buttons on click).
    const opener = document.querySelector<HTMLElement>(`[aria-controls="${id}"]`)
    box?.querySelector<HTMLButtonElement>('.map-info-close')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    // Clicks inside the nav (including the opening button, which toggles) don't count as "outside".
    const onDown = (e: MouseEvent) => {
      if (box?.parentElement && !box.parentElement.contains(e.target as Node)) onClose()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
      opener?.focus()
    }
  }, [id, onClose])

  return (
    <div ref={ref} id={id} className="map-info-dropdown" role="dialog" aria-labelledby={`${id}-title`}>
      <button type="button" className="map-info-close" aria-label="Close" onClick={onClose}>
        &#215;
      </button>
      <h2 id={`${id}-title`}>{panel.title}</h2>
      {panel.body.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}
