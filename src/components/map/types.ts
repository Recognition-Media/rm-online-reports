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
  /** Same logo for dark backgrounds (the top bar over the report). */
  logoOnDark: { src: string }
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
  /** The stops around the map, in tour order. */
  stops: MapStop[]
  /** Bottom navigation bar on the field page. */
  tour: { hint: string; prev: string; next: string; aria: string }
  /** Small UI labels used by the map template. */
  labels: { ringEyebrow: string; ringAria: string; close: string; prevStop: string; nextStop: string; videoSoon: string }
}

export interface CenterProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export interface PanelProps {
  id: string
  onClose: () => void
  /** Open another item in the same drawer (e.g. a theme from the Meaning list). */
  onSelect: (id: string) => void
}

/** Everything report-specific the reusable map template needs. */
export interface MapReportConfig {
  /** Extra class on .map-root that scopes the report's brand.css. */
  className: string
  content: MapContent
  Center: ComponentType<CenterProps>
  Panel: ComponentType<PanelProps>
}

export interface Quote {
  text: string
  name: string
  role?: string
}

export interface Video {
  speaker: string
  role?: string
  /** e.g. "03:37" */
  length?: string
  /** Embed URL (Vimeo/YouTube). Without one, a placeholder shows. */
  url?: string
  /** Optional pull quote shown under the video. */
  quote?: string
}

export type StopVoice = { kind: 'quote'; quote: Quote } | { kind: 'video'; video: Video }

export interface SliderRevealModule {
  type: 'slider'
  source: string
  question: string
  minLabel: string
  maxLabel: string
  /** The real answer, 0–100. */
  value: number
  valueLabel: string
  lines: string[]
  revealButton: string
  guessLabel: string
}

export interface SplitStatModule {
  type: 'split'
  source: string
  /** Headline percent, 0–100. */
  headline: number
  headlineLabel: string
  parts: { label: string; value: number }[]
}

export interface RankedBarsModule {
  type: 'bars'
  source: string
  bars: { label: string; value: number }[]
}

export interface CaseStudyModule {
  type: 'case'
  title: string
  body: string
}

export interface TakeawaysModule {
  type: 'takeaways'
  title: string
  items: { headline: string; line: string }[]
}

export type StopModule = SliderRevealModule | SplitStatModule | RankedBarsModule | CaseStudyModule | TakeawaysModule

/** One stop on the ring around the map. */
export interface MapStop {
  id: string
  /** "01" … */
  number: string
  title: string
  /** Shown on the navigation bar instead of the number, e.g. "06 Takeaways". */
  tourLabel?: string
  /** Brand color the stop turns on hover and while open (a CSS color / var). */
  color: string
  /** How the stop opens: large centered pop-up (default) or a right-hand drawer beside a shrunken field. */
  layout?: 'center' | 'side'
  /** Pill center on the 1440×900 canvas. */
  position: { x: number; y: number }
  /** One entry per paragraph. */
  copy: string[]
  voice?: StopVoice
  module: StopModule
}

