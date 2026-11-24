import { computeThemeStats, validateThemes } from './themeMath'
import { themes } from './themes'

if (process.env.NODE_ENV !== 'production') {
  const errors = validateThemes(themes)
  if (errors.length) console.error('[W31 themes.ts]', errors)
}

/** Calculated once from the counts in themes.ts. */
export const summary = computeThemeStats(themes)
