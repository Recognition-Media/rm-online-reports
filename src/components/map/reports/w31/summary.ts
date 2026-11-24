import { assertValidThemes, computeThemeStats, spreadPositions } from './themeMath'
import { themes } from './themes'
import { content } from './content'
import { fitZoom, pillRect } from '../../ringGeometry'
import { isRingStop } from '../../types'

// Throws on duplicate ids, bad counts or unknown poles, so a typo in
// themes.ts can't ship: the dev server and the build both fail loudly.
assertValidThemes(themes)

/** How much extra room between blobs, from the center of each side (1 = mockup positions). */
const SPREAD = 1.15

/** Calculated once from the counts in themes.ts. */
export const summary = spreadPositions(computeThemeStats(themes), SPREAD)

/** The field zooms around this point (same as before). */
export const FIELD_ORIGIN = { x: 720, y: 470 }
/** Jordana: field at 100% with the ring (was 1.2 before the ring). Smaller only if a pill would cover a blob. */
export const MAX_FIELD_ZOOM = 1.0

/** Biggest zoom at which no blob sits under a stop pill. Recomputed if data or stop positions change. */
export const fieldZoom = fitZoom(
  summary.themes.filter((t) => t.size > 0).map((t) => ({ x: t.x, y: t.y, r: t.size / 2 })),
  content.stops.filter(isRingStop).map(pillRect),
  FIELD_ORIGIN,
  MAX_FIELD_ZOOM,
)
