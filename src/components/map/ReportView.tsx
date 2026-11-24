'use client'

import { useEffect, useState } from 'react'
import type { Report } from '@/sanity/types'
import { AnalyticsScripts } from '@/components/AnalyticsScripts'
import { getMapReport } from './reports'
import { Landing } from './Landing'
import { Ticker } from './Ticker'
import { MapStage } from './MapStage'
import { SignupGate } from './SignupGate'
import { useReportAccess } from './useReportAccess'
import './map.css'

/**
 * Interactive Map template. Reusable layout: a central visual with the
 * report's sections as stops around it. Report-specific pieces live in
 * ./reports/<key>/.
 */
export function ReportView({ report }: { report: Report }) {
  const config = getMapReport(report.slug.current)
  const { hasAccess, grantAccess } = useReportAccess(report)
  const [showGate, setShowGate] = useState(false)
  // Until the reader clicks Explore (and signs up, if needed) the report isn't
  // on the page at all, so the landing can't be scrolled past (Anthem pattern).
  const [entered, setEntered] = useState(false)

  // Once the report mounts, jump down to it.
  useEffect(() => {
    if (entered) document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })
  }, [entered])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <main className={`map-root ${config.className}`}>
      <AnalyticsScripts report={report} />
      <Landing
        content={config.content}
        onExplore={() => {
          if (!hasAccess) setShowGate(true)
          else if (entered) document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })
          else setEntered(true)
        }}
      >
        <Ticker label={config.content.tickerLabel} items={config.content.ticker} />
      </Landing>
      {entered && (
        <MapStage config={config} selectedId={selectedId} onSelect={setSelectedId} />
      )}
      {showGate && (
        <SignupGate
          report={report}
          copy={config.content.gate}
          logo={config.content.logo}
          onClose={() => setShowGate(false)}
          onComplete={() => {
            grantAccess()
            setShowGate(false)
            setEntered(true)
          }}
        />
      )}
    </main>
  )
}
