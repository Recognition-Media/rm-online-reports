'use client'

import { useState } from 'react'
import type { Report } from '@/sanity/types'
import { AnalyticsScripts } from '@/components/AnalyticsScripts'
import { getMapReport } from './reports'
import { Landing } from './Landing'
import { PromptBar } from './PromptBar'
import { MapStage } from './MapStage'
import './map.css'

/**
 * Interactive Map template. Reusable layout: a central visual with the
 * report's sections as stops around it. Report-specific pieces live in
 * ./reports/<key>/.
 */
export function ReportView({ report }: { report: Report }) {
  const config = getMapReport(report.slug.current)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  return (
    <main className={`map-root ${config.className}`}>
      <AnalyticsScripts report={report} />
      <Landing content={config.content} />
      <PromptBar prompt={config.content.prompt} />
      <MapStage
        config={config}
        locked={false}
        onUnlock={() => {}}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </main>
  )
}
