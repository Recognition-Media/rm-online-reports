// Pure functions that turn theme COUNTS into everything shown on the
// Memory Field. Nothing here is typed in by hand: change a count in
// themes.ts and every percentage, size and total follows.
//
// Kept free of imports and non-erasable TypeScript so `node --test`
// can run it directly.

export type Pole = 'meaning' | 'form'

export interface ThemeAnswer {
  project: string
  why: string
}

export interface Theme {
  id: string
  name: string
  pole: Pole
  /** Coded answers that LEAD with this theme. */
  count: number
  color: string
  /** Text color used on top of `color`. */
  ink: string
  /** CSS clip-path for the blob's outline. */
  shape: string
  line: string
  copy?: string
  /** Center of the blob on the 1440×900 canvas. Omit to auto-place. */
  position?: { x: number; y: number }
  answers: ThemeAnswer[]
}

export interface ThemeStat extends Theme {
  share: number
  label: string
  size: number
  x: number
  y: number
}

export interface PoleStat {
  count: number
  share: number
  label: string
}

export interface ThemeSummary {
  total: number
  themes: ThemeStat[]
  poles: Record<Pole, PoleStat>
}

/** The design canvas the field is drawn on (scaled to the screen). */
// Blob sizes were 191 / 36 in the 11.23 mockup; enlarged 30% on 2026-11-24.
export const CANVAS = { width: 1440, height: 900, divider: 720, maxBlob: 248, minBlob: 47 }

export function formatShare(share: number): string {
  if (!share) return '0%'
  if (share < 0.005) return '<1%'
  return `${Math.round(share * 100)}%`
}

/** Meaning/Form labels that always add up to 100% (largest remainder). */
export function poleLabels(meaningCount: number, formCount: number): Record<Pole, string> {
  const total = meaningCount + formCount
  if (!total) return { meaning: '0%', form: '0%' }
  const m = (meaningCount / total) * 100
  let mr = Math.floor(m)
  let fr = Math.floor(100 - m)
  if (mr + fr < 100) {
    if (m - mr >= 100 - m - fr) mr += 1
    else fr += 1
  }
  return { meaning: `${mr}%`, form: `${fr}%` }
}

/** Fallback spot for a theme with no hand-set position, inside its own half. */
export function autoPosition(indexInPole: number, pole: Pole): { x: number; y: number } {
  const col = indexInPole % 3
  const row = Math.floor(indexInPole / 3) % 5
  const x0 = pole === 'meaning' ? 360 : 850
  return { x: x0 + col * 120, y: 300 + row * 110 }
}

export function validateThemes(themes: Theme[]): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const t of themes) {
    if (seen.has(t.id)) errors.push(`duplicate id "${t.id}"`)
    seen.add(t.id)
    if (!Number.isInteger(t.count) || t.count < 0) {
      errors.push(`theme "${t.id}": count must be a whole number of 0 or more (got ${t.count})`)
    }
    if (t.pole !== 'meaning' && t.pole !== 'form') {
      errors.push(`theme "${t.id}": pole must be "meaning" or "form" (got "${t.pole}")`)
    }
  }
  return errors
}

/** Stops the dev server and the page build if themes.ts has a mistake. */
export function assertValidThemes(themes: Theme[]): void {
  const errors = validateThemes(themes)
  if (errors.length) throw new Error(`themes.ts has data mistakes:\n- ${errors.join('\n- ')}`)
}

export function computeThemeStats(themes: Theme[]): ThemeSummary {
  const total = themes.reduce((sum, t) => sum + t.count, 0)
  const maxCount = Math.max(0, ...themes.map((t) => t.count))
  const poleIndex: Record<Pole, number> = { meaning: 0, form: 0 }

  const stats: ThemeStat[] = themes.map((t) => {
    const share = total ? t.count / total : 0
    // Area (not width) is proportional to share, so size scales with the square root.
    const size = t.count && maxCount
      ? Math.max(CANVAS.minBlob, Math.round(CANVAS.maxBlob * Math.sqrt(t.count / maxCount)))
      : 0
    const pos = t.position ?? autoPosition(poleIndex[t.pole], t.pole)
    poleIndex[t.pole] += 1
    return { ...t, share, label: formatShare(share), size, x: pos.x, y: pos.y }
  })

  const meaningCount = themes.filter((t) => t.pole === 'meaning').reduce((s, t) => s + t.count, 0)
  const formCount = total - meaningCount
  const labels = poleLabels(meaningCount, formCount)

  return {
    total,
    themes: stats,
    poles: {
      meaning: { count: meaningCount, share: total ? meaningCount / total : 0, label: labels.meaning },
      form: { count: formCount, share: total ? formCount / total : 0, label: labels.form },
    },
  }
}

/** Collision radius as a fraction of blob size (the shapes are polygons, so a bit under half). */
export const BLOB_RADIUS = 0.42

/** Where blobs may sit on the canvas (below the MEANING / FORM labels, inside the dashed line's height). */
const FIELD = { top: 250, bottom: 790, left: 170, right: 1270 }

/**
 * Spreads each side's blobs away from that side's center by `factor`
 * (1.15 = 15% more room), then gently pushes overlapping blobs apart
 * while keeping every blob on its own side of the center line and
 * close to its spread-out spot. Deterministic: same data, same layout.
 */
export function spreadPositions(summary: ThemeSummary, factor: number): ThemeSummary {
  const center: Record<Pole, { x: number; y: number }> = { meaning: { x: 0, y: 0 }, form: { x: 0, y: 0 } }
  for (const pole of ['meaning', 'form'] as Pole[]) {
    const side = summary.themes.filter((t) => t.pole === pole)
    if (!side.length) continue
    center[pole] = {
      x: side.reduce((s, t) => s + t.x, 0) / side.length,
      y: side.reduce((s, t) => s + t.y, 0) / side.length,
    }
  }
  const targets = summary.themes.map((t) => {
    const c = center[t.pole]
    return { x: c.x + (t.x - c.x) * factor, y: c.y + (t.y - c.y) * factor }
  })
  const pos = targets.map((p) => ({ ...p }))

  const keepInBounds = (i: number) => {
    const t = summary.themes[i]
    const r = t.size * BLOB_RADIUS
    const half = t.size / 2
    const p = pos[i]
    if (t.pole === 'meaning') p.x = Math.min(Math.max(p.x, FIELD.left + r), CANVAS.divider - half)
    else p.x = Math.max(Math.min(p.x, FIELD.right - r), CANVAS.divider + half)
    p.y = Math.min(Math.max(p.y, FIELD.top + r), FIELD.bottom - r)
  }

  for (let iter = 0; iter < 400; iter++) {
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = summary.themes[i]
        const b = summary.themes[j]
        if (a.pole !== b.pole || !a.size || !b.size) continue
        const min = (a.size + b.size) * BLOB_RADIUS
        let dx = pos[j].x - pos[i].x
        let dy = pos[j].y - pos[i].y
        let d = Math.hypot(dx, dy)
        if (d >= min) continue
        if (d < 0.001) { dx = 1; dy = 0; d = 1 }
        const push = (min - d) / 2
        pos[i].x -= (dx / d) * push
        pos[i].y -= (dy / d) * push
        pos[j].x += (dx / d) * push
        pos[j].y += (dy / d) * push
      }
    }
    for (let i = 0; i < pos.length; i++) {
      // Light pull back toward the spread-out spot keeps the mockup's arrangement.
      pos[i].x += (targets[i].x - pos[i].x) * 0.01
      pos[i].y += (targets[i].y - pos[i].y) * 0.01
      keepInBounds(i)
    }
  }

  const themes = summary.themes.map((t, i) => ({ ...t, x: Math.round(pos[i].x), y: Math.round(pos[i].y) }))
  return { ...summary, themes }
}

export function rankPole(summary: ThemeSummary, pole: Pole): ThemeStat[] {
  return summary.themes
    .filter((t) => t.pole === pole)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
