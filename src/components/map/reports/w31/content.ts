import type { MapContent } from '../../types'

// ALL COPY for the W31 report. Edit text here; components hold none.
// Moves into Sanity fields in Phase 3.

export const content: MapContent = {
  logo: { src: '/map/w31/webby-logo-black.svg', alt: 'The Webby Awards' },
  logoOnDark: { src: '/map/w31/webby-logo-beige.svg' },
  reportTitle: 'By Popular Demand',
  landing: {
    headline: ['By', 'Popular', 'Demand'],
    subtitle: 'A report on what makes work memorable on the Internet in 2026, by The Webby Awards',
    cta: 'See What Stuck',
    nav: [
      {
        label: 'About the Report',
        panel: {
          title: 'About the Report',
          body: [
            'TKTK: what the report is and why The Webby Awards made it.',
            'TKTK: who we asked (Internet Memory Project events and Webby Judges) and how the answers were read.',
            'TKTK: how to explore the report.',
            // How to read the field (moved here from the old tour intro).
            'How to read the field: each shape is one reason people gave for why something stuck. Its size shows how many answers led with that reason.',
            'Warm colors are Meaning, the human insight, feeling or point of view behind the work; cool colors are Form, the shape and execution that carry it. Shapes in the same color belong to the same family of reasons.',
          ],
        },
      },
      { label: 'Enter the 31st Webbys', href: 'https://www.webbyawards.com/' },
    ],
  },
  tickerLabel: 'What Stuck on the Internet This Year?',
  ticker: [
    { text: "'Punch' the baby monkey", color: 'var(--w31-orange)' },
    { text: "Bad Bunny's Super Bowl halftime", color: 'var(--w31-blue)' },
    { text: 'GAP x KATSEYE', color: 'var(--w31-yellow)' },
    { text: 'Jimothy the raccoon', color: 'var(--w31-forest)' },
    { text: 'Subway Takes', color: 'var(--w31-pink)' },
    { text: 'Fat Bear Week', color: 'var(--w31-blue-light)' },
    { text: 'Mariah opening Christmas season', color: 'var(--w31-green)' },
    { text: 'Las Culturistas x Nicole Kidman', color: 'var(--w31-yellow)' },
    { text: 'M&S store deep-dives', color: 'var(--w31-forest)' },
    { text: "Yung Lean 'Storm'", color: 'var(--w31-orange)' },
    { text: "Jacquemus x Simon's grandma", color: 'var(--w31-blue)' },
  ],
  gate: {
    title: 'Get By Popular Demand',
    subhead: "What people remembered from this year's Internet, why, and what Webby Judges think makes work last.",
    submit: 'See What Stuck',
  },
  // Stops around the map. ALL COPY BELOW IS PLACEHOLDER from the content outline; edit freely.
  stops: [
    {
      id: 'attention',
      number: '01',
      title: 'The Attention Trap',
      position: { x: 132, y: 300 },
      color: 'var(--w31-pink)',
      copy: ['About 10 hours of media a day. Roughly 1,500 pieces of content. Most of it ends up as noise. [Copy TK]'],
      voice: {
        kind: 'video',
        video: {
          speaker: 'Lea Karam',
          role: 'Founder & CEO, Mindscope',
          length: '03:37',
          // LOCAL PREVIEW ONLY: compressed copy, not committed (too large for git). Swap for a hosted link before launch.
          src: '/map/w31/video/01-lea-karam.mp4',
          quote: "Because of this cognitive overload that we're all exposed to, humans have built sharper filters.",
        },
      },
      module: {
        type: 'slider',
        question: 'Compared with a few years ago, how hard is it to remember what you see online?',
        minLabel: 'Easier',
        maxLabel: 'Much harder',
        value: 69,
        valueLabel: 'Webby Judges rated it 69 out of 100.',
        lines: ['79% say it has become at least moderately harder (50+).', '54% say significantly harder (70+).'],
        revealButton: 'Reveal the answer',
        guessLabel: 'Your guess',
      },
    },
    {
      id: 'metrics',
      number: '02',
      title: 'When Metrics Lose Meaning',
      position: { x: 720, y: 110 },
      color: 'var(--w31-orange)',
      copy: ['Metrics were a gift to creative work. But once everyone optimizes for views, the view count says less and less. [Copy TK]'],
      voice: { kind: 'quote', quote: { text: 'Craft and effectiveness are not two sides of the same coin anymore.', name: 'Matheus Faustino', role: 'Creative Director, Monks' } },
      module: {
        type: 'split',
        headline: 57,
        headlineLabel: 'of Webby Judges have stopped treating views or likes as proof that work is good.',
        parts: [
          { label: 'Stopped, but still report on it', value: 34 },
          { label: 'Stopped, and changed how I work', value: 23 },
          { label: 'Still read it as evidence', value: 29 },
          { label: 'I never did', value: 14 },
        ],
      },
    },
    {
      id: 'optimization',
      number: '03',
      title: 'Optimization-Maxxing',
      position: { x: 1299, y: 300 },
      color: 'var(--w31-yellow)',
      copy: ['When everyone optimizes toward the same numbers, everyone arrives at the same work. [Copy TK]'],
      voice: { kind: 'quote', quote: { text: "We've gotten incredibly good at optimizing for what performs, which can also mean optimizing toward sameness.", name: 'Kaare Wesnaes', role: 'Head of Innovation, Ogilvy' } },
      module: {
        type: 'bars',
        bars: [
          { label: "AI for AI's sake", value: 27 },
          { label: 'Formulaic voice, look or format', value: 23 },
          { label: 'Influencer + celebrity formulas', value: 17 },
          { label: 'Trend-chasing', value: 16 },
        ],
      },
    },
    {
      id: 'signals',
      number: '04',
      title: 'What Are the Signals?',
      position: { x: 1295, y: 610 },
      color: 'var(--w31-blue)',
      copy: ['Judges agree a high view count proves one thing: the work was put in front of people. [Copy TK]'],
      voice: { kind: 'quote', quote: { text: 'The comment section has become one of the most valuable spaces in social.', name: 'Wangari Nderi', role: 'Group Brand, Digital & Communications Lead, Live54 Plus' } },
      module: {
        type: 'bars',
        bars: [
          { label: 'It was put in front of people', value: 69 },
          { label: 'People chose to watch it', value: 36 },
          { label: 'People stayed with it', value: 26 },
          { label: 'People got something out of it', value: 12 },
          { label: 'People will remember it', value: 9 },
        ],
      },
    },
    {
      id: 'listening',
      number: '05',
      title: 'Listening vs. Experimenting',
      position: { x: 720, y: 858 },
      color: 'var(--w31-green)',
      copy: ['Audience feedback still matters. The line to draw is between experimentation and optimization. [Copy TK]'],
      voice: {
        kind: 'video',
        video: {
          speaker: 'James Gerde',
          role: 'Artist & Filmmaker',
          quote: 'Everything I make starts from something that I like, and it always ends somewhere that I like.',
        },
      },
      module: { type: 'case', title: 'Case study: Vaseline Verified', body: '[TK] Listening to culture to build memory with an audience.' },
    },
    {
      id: 'meaning',
      number: '06',
      title: 'Meaning',
      color: 'var(--w31-orange)',
      ring: false,
      panel: 'pole:meaning',
      copy: [],
    },
    {
      id: 'form',
      number: '07',
      title: 'Form',
      color: 'var(--w31-blue)',
      ring: false,
      panel: 'pole:form',
      copy: [],
    },
    {
      id: 'takeaways',
      number: '08',
      title: 'Takeaways',
      position: { x: 91, y: 610 },
      color: 'var(--w31-watermelon)',
      copy: [],
      module: {
        type: 'takeaways',
        title: 'How to make memorable work in an attention economy',
        items: [
          { headline: 'Stop treating reach as memory.', line: 'Views prove distribution, not that anyone will remember.' },
          { headline: 'Listen for meaning, not formats.', line: "Use feedback to find what moves people, not to copy last week's winner." },
          { headline: 'Lead with a feeling.', line: "A laugh, a feeling, a new way of seeing: that's what people carry with them." },
          { headline: 'Give it a shape people can hold.', line: 'A ritual, a character, a world makes meaning easy to return to.' },
        ],
      },
    },
  ],
  tour: {
    hint: 'Click a section to explore',
    prev: 'Previous section',
    next: 'Next section',
    aria: 'Report sections',
  },
  labels: {
    ringEyebrow: 'Trend',
    ringAria: 'Report sections',
    close: 'Close',
    prevStop: 'Previous',
    nextStop: 'Next',
    videoSoon: 'Video coming soon',
    playVideo: 'Play video',
  },
}

/** MEANING / FORM drawer copy. Definitions from w31-report-data-themes.json; the rest is placeholder. */
export const poleCopy = {
  meaning: {
    name: 'Meaning',
    headline: 'Meaning: people remember what moved them.',
    definition: 'The human insight, emotion or point of view that makes the work matter.',
    copy: 'A laugh, a voice that felt real, a moment everyone shared. Tap any shape on the left to open it. [Copy TK]',
    listLabel: 'Reasons on this side',
    // Placeholder from the mockup. Judge answers are anonymous: confirm permission before printing a judge's name.
    quote: { text: 'What is harder to replicate is a clear understanding of people.', name: 'Vaishnavi Ramamoorthy, Webby Judge' },
  },
  form: {
    name: 'Form',
    headline: 'Form: a shape people can hold onto.',
    definition: 'A shape that helps people hold on to a meaningful idea, and the execution that carries it.',
    copy: 'Novelty, craft, things built to spread. Tap any shape on the left to open it. [Copy TK]',
    listLabel: 'Reasons on this side',
    quote: { text: "Quite often it's the thing that stops you when you are browsing, or feels like there was a decision to buck a trend.", name: 'Richard Foster, SVP Creative, Leftfield Labs' },
  },
}
