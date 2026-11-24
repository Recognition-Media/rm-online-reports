import type { MapReportConfig } from '../types'
import { w31 } from './w31'

// Report-specific pieces for each map report, keyed by Sanity slug.
// W31 is the only map report so far, so it is also the default.
const BY_SLUG: Record<string, MapReportConfig> = {
  'by-popular-demand': w31,
}

export function getMapReport(slug: string): MapReportConfig {
  return BY_SLUG[slug] ?? w31
}
