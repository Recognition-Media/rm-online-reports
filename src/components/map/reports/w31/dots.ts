// Grey "feed" dots behind the field. Seeded so they're identical on the
// server and in the browser (no hydration mismatch) and on every visit.
export function makeDots(count: number, seed: number) {
  let s = seed >>> 0
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: count }, () => ({
    x: Math.round(rand() * 1440),
    y: Math.round(rand() * 900),
    r: Math.round(3 + rand() * rand() * 22),
    o: Math.round((0.15 + rand() * 0.45) * 100) / 100,
  }))
}
