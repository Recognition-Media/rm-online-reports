'use client'

import type { Report } from '@/sanity/types'

/**
 * Interactive Map template. Reusable layout: a central visual with the
 * report's sections as stops around it. Report-specific pieces live in
 * ./reports/<key>/.
 */
export function ReportView({ report }: { report: Report }) {
  return (
    <main className="map-root">
      <p>Interactive Map: {report.title}</p>
    </main>
  )
}
