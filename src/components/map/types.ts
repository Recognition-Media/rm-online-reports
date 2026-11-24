import type { ComponentType } from 'react'

/** Text shown in a pop-up box (e.g. "About the Report"). */
export interface InfoPanel {
  title: string
  /** One entry per paragraph. */
  body: string[]
}

/** A landing nav button: either a link (href) or a pop-up box (panel). */
export interface NavLink {
  label: string
  href?: string
  panel?: InfoPanel
  primary?: boolean
}

export interface TickerItem {
  text: string
  color: string
}

/** All copy for one map report. Moves into Sanity fields in Phase 3. */
export interface MapContent {
  /** Brand logo shown on the landing and in the field header. */
  logo: { src: string; alt: string }
  reportTitle: string
  reportSubtitle: string
  landing: {
    /** One entry per line of the big title. */
    headline: string[]
    subtitle: string
    nav: NavLink[]
  }
  prompt: {
    question: string
    placeholder: string
    button: string
    ticker: TickerItem[]
  }
  focusLock: {
    eyebrow: string
    headline: string
    button: string
  }
  gate: {
    title: string
    subhead: string
  }
}

export interface CenterProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export interface PanelProps {
  id: string
  onClose: () => void
}

/** Everything report-specific the reusable map template needs. */
export interface MapReportConfig {
  /** Extra class on .map-root that scopes the report's brand.css. */
  className: string
  content: MapContent
  Center: ComponentType<CenterProps>
  Panel: ComponentType<PanelProps>
}
