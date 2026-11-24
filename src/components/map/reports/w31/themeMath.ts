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
export const CANVAS = { width: 1440, height: 900, divider: 720, maxBlob: 191, minBlob: 36 }

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

export function rankPole(summary: ThemeSummary, pole: Pole): ThemeStat[] {
  return summary.themes
    .filter((t) => t.pole === pole)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
