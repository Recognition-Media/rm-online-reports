'use client'

import type { ReactNode } from 'react'

export function SidePanel({ onClose, closeLabel, children }: { onClose: () => void; closeLabel: string; children: ReactNode }) {
  return (
    <aside className="map-panel" role="dialog" aria-modal="false">
      <button type="button" className="map-panel-close" onClick={onClose}>
        {closeLabel}
      </button>
      {children}
    </aside>
  )
}
