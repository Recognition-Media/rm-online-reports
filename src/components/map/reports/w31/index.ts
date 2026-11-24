import './brand.css'
import type { MapReportConfig } from '../../types'
import { content } from './content'
import { MemoryField } from './MemoryField'
import { ThemePanel } from './ThemePanel'
import { assertValidStops } from '../../modules/validate'

// Throws on survey-number typos in content.ts (e.g. 690 for 69) so they can't ship.
assertValidStops(content.stops)

export const w31: MapReportConfig = {
  className: 'map-w31',
  content,
  Center: MemoryField,
  Panel: ThemePanel,
}
