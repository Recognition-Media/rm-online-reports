import type { MapContent } from '../../types'
import { themes } from './themes'

// ALL COPY for the W31 report. Edit text here; components hold none.
// Moves into Sanity fields in Phase 3.

const colorOf = (id: string) => themes.find((t) => t.id === id)?.color ?? 'var(--map-dot)'

export const content: MapContent = {
  logo: { src: '/map/w31/webby-logo-black.svg', alt: 'The Webby Awards' },
  reportTitle: 'By Popular Demand',
  reportSubtitle: 'The 2026 Webby Trend Report',
  landing: {
    headline: ['By', 'Popular', 'Demand'],
    subtitle: 'A report on what makes work memorable on the Internet in 2026, by The Webby Awards',
    cta: 'Explore the Report',
    nav: [
      {
        label: 'About the Report',
        panel: {
          title: 'About the Report',
          body: [
            'TKTK: what the report is and why The Webby Awards made it.',
            'TKTK: who we asked (Internet Memory Project events and Webby Judges) and how the answers were read.',
            'TKTK: how to explore the report.',
          ],
        },
      },
      { label: 'Enter the 31st Webbys', href: 'https://www.webbyawards.com/' },
    ],
  },
  tickerLabel: 'What Stuck on the Internet This Year?',
  ticker: [
    { text: "'Punch' the baby monkey", color: colorOf('delight') },
    { text: "Bad Bunny's Super Bowl halftime", color: colorOf('novelty') },
    { text: 'GAP x KATSEYE', color: colorOf('insight') },
    { text: 'Jimothy the raccoon', color: colorOf('craft') },
    { text: 'Subway Takes', color: colorOf('voice') },
    { text: 'Fat Bear Week', color: colorOf('narrative') },
    { text: 'Mariah opening Christmas season', color: colorOf('stickiness') },
    { text: 'Las Culturistas x Nicole Kidman', color: colorOf('insight') },
    { text: 'M&S store deep-dives', color: colorOf('craft') },
    { text: "Yung Lean 'Storm'", color: colorOf('emotion') },
    { text: "Jacquemus x Simon's grandma", color: colorOf('novelty') },
  ],
  gate: {
    title: 'Get By Popular Demand',
    subhead: "What people remembered from this year's Internet, why, and what Webby Judges think makes work last.",
    submit: 'See What Stuck',
  },
}
