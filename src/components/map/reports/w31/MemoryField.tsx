'use client'

import type { CenterProps } from '../../types'
import { CANVAS } from './themeMath'
import { makeDots } from './dots'
import { summary } from './summary'

const DOTS = makeDots(90, 31)
// Below this size the theme name is hidden and only the % shows (as in the design).
const NAME_MIN_SIZE = 90

export function MemoryField({ selectedId, onSelect }: CenterProps) {
  const visible = summary.themes.filter((t) => t.count > 0)
  return (
    <div className="w31-field">
      {/* Faint color washes behind each side */}
      <div className="w31-wash w31-wash-meaning" aria-hidden="true" />
      <div className="w31-wash w31-wash-form" aria-hidden="true" />
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="w31-dot"
          style={{ left: d.x, top: d.y, width: d.r * 2, height: d.r * 2, opacity: d.o }}
        />
      ))}

      <div className="w31-pole w31-pole-meaning">
        <span className="w31-pole-name">Meaning</span>
        <span className="w31-pole-pct">{summary.poles.meaning.label}</span>
      </div>
      <div className="w31-pole w31-pole-form">
        <span className="w31-pole-pct">{summary.poles.form.label}</span>
        <span className="w31-pole-name">Form</span>
      </div>
      <div className="w31-divider" style={{ left: CANVAS.divider }} />

      {visible.map((t, i) => {
        // Like the brand shapes: crisp on one side, fading out on the other.
        // The direction of the fade varies per blob.
        const fadeAngle = (i * 67 + 20) % 360
        const dimmed = selectedId !== null && selectedId !== t.id
        return (
          <button
            key={t.id}
            type="button"
            className={`w31-blob${dimmed ? ' is-dimmed' : ''}${selectedId === t.id ? ' is-selected' : ''}`}
            style={{
              left: t.x - t.size / 2,
              top: t.y - t.size / 2,
              width: t.size,
              height: t.size,
              color: t.ink,
            }}
            onClick={() => onSelect(selectedId === t.id ? null : t.id)}
            aria-label={`${t.name}, ${t.label}`}
          >
            <span className="w31-blob-glow" aria-hidden="true">
              <span className="w31-blob-fill" style={{ background: t.color, clipPath: t.shape }} />
            </span>
            <span
              className="w31-blob-fill w31-blob-crisp"
              aria-hidden="true"
              style={{ background: t.color, clipPath: t.shape, ['--fade' as string]: `${fadeAngle}deg` }}
            />
            <span className="w31-blob-pct">{t.label}</span>
            {t.size >= NAME_MIN_SIZE && <span className="w31-blob-name">{t.name}</span>}
          </button>
        )
      })}
    </div>
  )
}
