// Geometry for the ring of stop pills on the 1440×900 canvas, and the
// field zoom that keeps every blob clear of them.

export const PILL_HEIGHT = 45

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Circle {
  x: number
  y: number
  r: number
}

export function pillLabel(s: { number: string; title: string }): string {
  return `${s.number} ${s.title}`
}

/** Fixed pill width from the label (17px text ≈ 9.14px/char incl. margin) + padding, so layout math matches what renders. */
export function pillWidth(label: string): number {
  return Math.round(40 + label.length * 9.14)
}

export function pillRect(s: { number: string; title: string; position: { x: number; y: number } }): Rect {
  const w = pillWidth(pillLabel(s))
  return { x: s.position.x - w / 2, y: s.position.y - PILL_HEIGHT / 2, w, h: PILL_HEIGHT }
}

export function circleHitsRect(c: Circle, rect: Rect, pad: number): boolean {
  const nx = Math.max(rect.x - pad, Math.min(c.x, rect.x + rect.w + pad))
  const ny = Math.max(rect.y - pad, Math.min(c.y, rect.y + rect.h + pad))
  return Math.hypot(c.x - nx, c.y - ny) < c.r
}

/**
 * Largest zoom (stepping down by 0.01 from `max`) at which no circle,
 * scaled around `origin`, touches any rect. Returns `min` if none fits.
 */
export function fitZoom(
  circles: Circle[],
  rects: Rect[],
  origin: { x: number; y: number },
  max: number,
  min = 0.6,
  pad = 12,
): number {
  for (let z = max; z >= min; z = Math.round((z - 0.01) * 100) / 100) {
    const hit = circles.some((c) => {
      const zc = { x: origin.x + (c.x - origin.x) * z, y: origin.y + (c.y - origin.y) * z, r: c.r * z }
      return rects.some((r) => circleHitsRect(zc, r, pad))
    })
    if (!hit) return z
  }
  return min
}
