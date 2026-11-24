'use client'

import type { PanelProps } from '../../types'
import { SidePanel } from '../../SidePanel'
import { summary } from './summary'
import { content, poleCopy } from './content'
import { rankPole, type Pole } from './themeMath'

export function ThemePanel({ id, onClose, onSelect }: PanelProps) {
  if (id.startsWith('pole:')) {
    const pole = id.slice(5) as Pole
    const info = poleCopy[pole]
    if (!info) return null
    const number = content.stops.find((st) => st.panel === id)?.number
    return (
      <SidePanel onClose={onClose} closeLabel="Back">
        <div className="w31-pole-drawer">
          <p className="w31-pole-eyebrow">
            {number ? `${number} · ` : ''}
            {info.name}
          </p>
          <p className="w31-pole-big">{summary.poles[pole].label}</p>
          <h2 className="w31-pole-headline">{info.headline}</h2>
          <p className="w31-pole-copy">{info.copy}</p>
          <ol className="w31-pole-list" aria-label={info.listLabel}>
            {rankPole(summary, pole).map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => onSelect(t.id)}>
                  <span className="w31-pole-swatch" style={{ background: t.color, clipPath: t.shape }} />
                  <span className="w31-pole-list-name">{t.name}</span>
                  <span className="w31-pole-list-pct">{t.label}</span>
                </button>
              </li>
            ))}
          </ol>
          {info.quote && (
            <figure className="w31-pole-quote">
              <blockquote>“{info.quote.text}”</blockquote>
              <figcaption>{info.quote.name}</figcaption>
            </figure>
          )}
        </div>
      </SidePanel>
    )
  }


  const t = summary.themes.find((x) => x.id === id)
  if (!t) return null
  const poleName = t.pole === 'meaning' ? 'Meaning' : 'Form'

  return (
    <SidePanel onClose={onClose} closeLabel="Back">
      <p className="w31-panel-eyebrow w31-panel-pole">{poleName}</p>
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
          <p className="w31-panel-eyebrow">What We Remembered</p>
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
