import { assertValidThemes, computeThemeStats, spreadPositions } from './themeMath'
import { themes } from './themes'

// Throws on duplicate ids, bad counts or unknown poles, so a typo in
// themes.ts can't ship: the dev server and the build both fail loudly.
assertValidThemes(themes)

/** How much extra room between blobs, from the center of each side (1 = mockup positions). */
const SPREAD = 1.15

/** Calculated once from the counts in themes.ts. */
export const summary = spreadPositions(computeThemeStats(themes), SPREAD)
