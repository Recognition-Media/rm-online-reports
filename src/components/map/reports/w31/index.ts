import './brand.css'
import type { MapReportConfig } from '../../types'
import { content } from './content'
import { MemoryField } from './MemoryField'
import { ThemePanel } from './ThemePanel'

export const w31: MapReportConfig = {
  className: 'map-w31',
  content,
  Center: MemoryField,
  Panel: ThemePanel,
}
