import type { MapStop } from '../types'

// Survey numbers are typed by hand in content.ts; this catches typos
// (690 for 69, an empty list, a duplicate number) before they ship.

const isPct = (v: number) => Number.isFinite(v) && v >= 0 && v <= 100

export function validateStops(stops: MapStop[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const numbers = new Set<string>()
  for (const s of stops) {
    if (ids.has(s.id)) errors.push(`duplicate stop id "${s.id}"`)
    ids.add(s.id)
    if (numbers.has(s.number)) errors.push(`duplicate stop number "${s.number}"`)
    numbers.add(s.number)
    const m = s.module
    if (m.type === 'slider' && !isPct(m.value)) errors.push(`stop "${s.id}": slider value must be 0–100 (got ${m.value})`)
    if (m.type === 'split') {
      const bad = [m.headline, ...m.parts.map((p) => p.value)].filter((v) => !isPct(v))
      if (bad.length) errors.push(`stop "${s.id}": split values must be 0–100 (got ${bad.join(', ')})`)
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
