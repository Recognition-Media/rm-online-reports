'use client'

import type { PanelProps } from '../../types'
import { SidePanel } from '../../SidePanel'
import { summary } from './summary'

export function ThemePanel({ id, onClose }: PanelProps) {
  const t = summary.themes.find((x) => x.id === id)
  if (!t) return null
  const poleName = t.pole === 'meaning' ? 'Meaning' : 'Form'

  return (
    <SidePanel onClose={onClose} closeLabel="Back to the field">
      <p className="w31-panel-eyebrow">{poleName}</p>
      <div className="w31-panel-stat">
        <span className="w31-panel-swatch" style={{ background: t.color, clipPath: t.shape }} />
        <span className="w31-panel-pct">{t.label}</span>
      </div>
      <h2 className="w31-panel-headline">{t.name}: {t.line}</h2>
      <p className="w31-panel-copy">
        {t.label} of the {summary.total} coded answers led with this reason.
        {t.copy ? ` ${t.copy}` : ' [Copy TK: what it means for people making work.]'}
      </p>
      {t.answers.length > 0 && (
        <>
          <p className="w31-panel-eyebrow">In their words</p>
          {t.answers.map((a) => (
            <figure key={a.project} className="w31-panel-answer">
              <figcaption>{a.project}</figcaption>
              <blockquote>“{a.why}”</blockquote>
            </figure>
          ))}
        </>
      )}
    </SidePanel>
  )
}
