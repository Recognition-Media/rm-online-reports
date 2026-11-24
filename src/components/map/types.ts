import type { ComponentType } from 'react'

/** Text shown in a pop-up box (e.g. "About the Report"). */
export interface InfoPanel {
  title: string
  /** One entry per paragraph. */
  body: string[]
}

/** A landing nav button (secondary style): either a link (href) or a drop-down box (panel). */
export interface NavLink {
  label: string
  href?: string
  panel?: InfoPanel
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
  landing: {
    /** One entry per line of the big title. */
    headline: string[]
    subtitle: string
    /** Main button: opens the sign-up gate, or scrolls into the report once signed up. */
    cta: string
    nav: NavLink[]
  }
  /** Prompt shown in a box at the start of the ticker strip. */
  tickerLabel: string
  /** Things people remembered, scrolling along the bottom of the landing. */
  ticker: TickerItem[]
  gate: {
    title: string
    subhead: string
    /** Submit button text if the Studio's "Submit Button Text" field is empty. */
    submit: string
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
