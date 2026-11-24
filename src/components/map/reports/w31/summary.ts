import { assertValidThemes, computeThemeStats } from './themeMath'
import { themes } from './themes'

// Throws on duplicate ids, bad counts or unknown poles, so a typo in
// themes.ts can't ship: the dev server and the build both fail loudly.
assertValidThemes(themes)

/** Calculated once from the counts in themes.ts. */
export const summary = computeThemeStats(themes)
