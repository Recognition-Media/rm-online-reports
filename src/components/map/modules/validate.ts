import type { MapStop } from '../types'

// Survey numbers are typed by hand in content.ts; this catches typos
// (690 for 69, an empty list, a duplicate number) before they ship.

// Must match INTRO in ../tour.ts (kept literal so node --test can load this file; a test checks they match).
const RESERVED_ID = 'intro'
const isPct = (v: number) => Number.isFinite(v) && v >= 0 && v <= 100
const onCanvas = (p?: { x: number; y: number }) =>
  !!p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1440 && p.y >= 0 && p.y <= 900

export function validateStops(stops: MapStop[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const numbers = new Set<string>()
  for (const s of stops) {
    if (ids.has(s.id)) errors.push(`duplicate stop id "${s.id}"`)
    ids.add(s.id)
    if (numbers.has(s.number)) errors.push(`duplicate stop number "${s.number}"`)
    numbers.add(s.number)
    if (s.id === RESERVED_ID) errors.push(`stop id "${RESERVED_ID}" is reserved for the tour's intro card`)
    if (!onCanvas(s.position)) errors.push(`stop "${s.id}": position must be on the 1440×900 canvas`)
    const m = s.module
    if (m.type === 'slider' && !isPct(m.value)) errors.push(`stop "${s.id}": slider value must be 0–100 (got ${m.value})`)
    if (m.type === 'split') {
      const bad = [m.headline, ...m.parts.map((p) => p.value)].filter((v) => !isPct(v))
      if (bad.length) errors.push(`stop "${s.id}": split values must be 0–100 (got ${bad.join(', ')})`)
      if (m.parts.length < 1 || m.parts.length > 4) errors.push(`stop "${s.id}": split needs 1–4 parts (got ${m.parts.length})`)
      const sum = m.parts.reduce((t, p) => t + p.value, 0)
      if (m.parts.length && Math.abs(sum - 100) > 1) errors.push(`stop "${s.id}": split parts must add up to 100 (got ${sum})`)
    }
    if (m.type === 'bars') {
      if (!m.bars.length) errors.push(`stop "${s.id}": bar list is empty`)
      const bad = m.bars.map((b) => b.value).filter((v) => !isPct(v))
      if (bad.length) errors.push(`stop "${s.id}": bar values must be 0–100 (got ${bad.join(', ')})`)
    }
    if (m.type === 'takeaways' && !m.items.length) errors.push(`stop "${s.id}": no takeaways listed`)
  }
  return errors
}

export function assertValidStops(stops: MapStop[]): void {
  const errors = validateStops(stops)
  if (errors.length) throw new Error(`content.ts stops have mistakes:\n- ${errors.join('\n- ')}`)
}
