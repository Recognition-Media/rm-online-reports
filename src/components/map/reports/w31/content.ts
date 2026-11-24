import type { MapContent } from '../../types'
import { themes } from './themes'

// ALL COPY for the W31 report. Edit text here; components hold none.
// Moves into Sanity fields in Phase 3.

const colorOf = (id: string) => themes.find((t) => t.id === id)?.color ?? '#9B978E'

export const content: MapContent = {
  brandLines: ['The', 'Webby', 'Awards'],
  reportTitle: 'By Popular Demand',
  reportSubtitle: 'The 2026 Webby Trend Report',
  landing: {
    eyebrow: 'The 2026 Webby Trend Report',
    headlineTop: 'By Popular',
    headlineCircled: 'Demand',
    subtitle: 'On an Internet built to capture attention, what makes work actually last?',
    nav: [
      { label: 'About the report', href: '#about' },
      { label: 'Methodology', href: '#methodology' },
      { label: 'Enter the 31st Webbys', href: 'https://www.webbyawards.com/', primary: true },
    ],
  },
  prompt: {
    question: 'What stuck with you on the Internet this year?',
    placeholder: 'Type it here',
    button: 'Drop it in',
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
  },
  focusLock: {
    eyebrow: 'The report is out of focus',
    headline: 'Get the report to bring it into focus.',
    button: 'Get the report ↑',
  },
  gate: {
    title: 'Get By Popular Demand',
    subhead: "What people remembered from this year's Internet, why, and what Webby Judges think makes work last.",
  },
}
