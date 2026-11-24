import type { Report } from '@/sanity/types'
import { ReportView as VerticalReportView } from './vertical/ReportView'
import { ReportView as HorizontalReportView } from './horizontal/ReportView'
import dynamic from 'next/dynamic'

// Lazy so the map template's code and CSS only load for map reports.
const MapReportView = dynamic(() => import('./map/ReportView').then((m) => m.ReportView))

/**
 * Template router. Picks which scroll/layout template renders this report.
 *
 * Two layouts:
 *   - vertical   = Anthem-style (top-to-bottom scroll, no snap)
 *   - horizontal = Webby-style (snap-scroll trend slides, sideways trend
 *     navigation)
 *   - map        = Interactive Map (central visual + ring of section stops)
 *
 * Prefer the `template` field (editor's explicit choice). Fall back to
 * inferring from `property` for legacy docs that haven't been tagged
 * (Anthem → vertical, everything else → horizontal).
 */
export function ReportView({ report }: { report: Report }) {
  const template = report.template ?? (report.property === 'anthem' ? 'vertical' : 'horizontal')
  if (template === 'map') {
    return <MapReportView report={report} />
  }
  if (template === 'vertical') {
    return <VerticalReportView report={report} />
  }
  return <HorizontalReportView report={report} />
}
