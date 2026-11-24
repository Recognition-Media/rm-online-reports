# W31 Plan 2: Ring Stops, Tour Bar, Field Ticker, Takeaways, Meaning/Form Drawers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Memory Field into the full report: six clickable stops around the field open large center pop-ups with copy, a quote or video, and a data module; a bottom tour bar walks readers intro → 01 → 06; the "What stuck" ticker runs under it; MEANING and FORM open explanatory drawers.

**Architecture:** Reusable pieces go in `src/components/map/` (types, pure tour logic, ring geometry, ring, stop pop-up, data modules, tour bar). W31-specific content goes in `reports/w31/content.ts` (all copy is placeholder from Jordana's outline). The stop pop-up is a native `<dialog>` (focus trap, Escape, inert background for free). The field's zoom is now **calculated** (`fitZoom`) so no blob ever sits under a stop pill, rather than a fixed 1.2.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, scoped plain CSS, `node --test` (type-stripping) for pure logic.

**Spec:** `docs/superpowers/specs/2026-11-24-w31-plan2-stops-tour-design.md` (builds on `2026-11-23-w31-trend-report-design.md`).

## Global Constraints

- **Scope guardrail:** every new or changed file is under `src/components/map/` (or this plan/spec). No shared-file edits. Check: `git diff --name-only origin/main...HEAD` lists only `docs/superpowers/`, `src/components/map/`, `public/map/w31/`, `src/components/ReportView.tsx`, `src/sanity/schemas/report.ts`, `src/sanity/types.ts`.
- **Copy is placeholder:** every word lives in `reports/w31/content.ts` (or the theme data). Components hold no copy. **Tests never assert on wording**; they check structure, numbers and behavior.
- **Design system:** two fonts only (Terminal Grotesque for large headers and data numbers via `--map-font-display`; Aktiv Grotesk for everything else via `--map-font-body` / `--map-font-subhead`). Buttons use `.map-btn` + `.map-btn-primary` (black/beige) or `.map-btn-secondary` (beige/black). Palette colors only for data (new `--map-data-1..4` tokens). Every selector starts with `.map-root`.
- Stop names/numbers (exact): `01` The Attention Trap · `02` When Metrics Lose Meaning · `03` Optimization-Maxxing · `04` What Are the Signals? · `05` Listening vs. Experimenting · `06` Takeaways.
- Positions (pill centers on the 1440×900 canvas): 01 (165, 300) · 02 (720, 110) · 03 (1275, 300) · 04 (1275, 610) · 05 (720, 858) · 06 (165, 610).
- Q10 value: **69**. Takeaways has **no** "What stuck with you / Add your memory / Share my field". No "Kept n/25".
- Tests: `node --test 'src/components/map/**/*.test.mjs'` must stay green; lint gate is `npx eslint src/components/map` (repo-wide lint already fails on `main`).

## Review Focus

1. **Field shrinkage from the ring.** Pills at x≈165/1275 overlap where blobs currently reach; `fitZoom` will pick a zoom below 1.2 (likely ~0.8). Readers should get a field that is smaller but never covered. *(pinned in Task 3: `fitZoom` tests; Task 8: browser overlap + zoom report to Jordana)*
2. **Arrow keys inside the slider.** ←/→ on the Q10 slider must move the slider, not jump stops. *(pinned in Task 5: handler skips range inputs; Task 8 browser check)*
3. **Bad survey numbers in content.ts** (e.g. 690 instead of 69, empty bar list, duplicate stop number) must fail the dev server/build, not draw a broken chart. *(pinned in Task 2: `validateStops` tests + `assertValidStops` in the W31 config)*
4. **Drawer and pop-up at once.** Opening a stop while a theme drawer is open must close the drawer; Escape closes only the pop-up. *(pinned in Task 5: `go()` clears `selectedId`; Task 8 browser check)*
5. **Short screens.** With the top bar and the bottom band, a 1440×760 window leaves ~550px for the field; the stage must still fit and the band must not overlap it. *(pinned in Task 6 CSS; Task 8 browser check at 1440×760)*

## File Map

| File | Responsibility |
|---|---|
| `src/components/map/types.ts` *(modify)* | `MapStop`, module types, `TourIntro`, `content.stops/tour/labels`; `PanelProps.onSelect` |
| `src/components/map/tour.ts` + `tour.test.mjs` | Pure tour order: `INTRO`, `tourSteps`, `nextStep`, `prevStep` |
| `src/components/map/ringGeometry.ts` + `ringGeometry.test.mjs` | `PILL_HEIGHT`, `pillWidth`, `pillRect`, `circleHitsRect`, `fitZoom` |
| `src/components/map/modules/validate.ts` + `validate.test.mjs` | `validateStops`, `assertValidStops` |
| `src/components/map/modules/*.tsx` | `SliderReveal`, `SplitStat`, `RankedBars`, `CaseStudy`, `Takeaways`, `VoiceBlock`, `StopModule` (switch) |
| `src/components/map/Ring.tsx` | Six stop pills on the canvas |
| `src/components/map/StopModal.tsx` | Center `<dialog>`: intro or stop (two panels) |
| `src/components/map/TourBar.tsx` | Bottom tour controls |
| `src/components/map/MapStage.tsx` *(modify)* | Tour state, ring, modal, bottom band (tour bar + ticker) |
| `src/components/map/Ticker.tsx` *(modify)* | Optional `className` for the field variant |
| `src/components/map/map.css` *(modify)* | Ring, modal, modules, tour bar, band styles |
| `src/components/map/reports/w31/content.ts` *(modify)* | Stops, intro, tour/labels copy, `poleCopy` (all placeholder) |
| `src/components/map/reports/w31/content.test.mjs` | Content structure checks (no wording) |
| `src/components/map/reports/w31/summary.ts` *(modify)* | Export calculated `fieldZoom` |
| `src/components/map/reports/w31/MemoryField.tsx` *(modify)* | Uses `fieldZoom`; MEANING/FORM become buttons; pole dimming |
| `src/components/map/reports/w31/ThemePanel.tsx` *(modify)* | Pole drawer (`pole:meaning` / `pole:form`) |
| `src/components/map/reports/w31/index.ts` *(modify)* | `assertValidStops(content.stops)` |
| `src/components/map/reports/w31/brand.css` *(modify)* | Tokens: `--map-tour-height`, `--map-band-ticker-height`, `--map-data-1..4`; remove fixed `--map-field-zoom` |

---

### Task 1: Tour order logic

**Files:**
- Create: `src/components/map/tour.ts`, `src/components/map/tour.test.mjs`

**Interfaces:**
- Produces: `const INTRO = 'intro'`; `tourSteps(stopIds: string[]): string[]`; `nextStep(steps: string[], current: string | null): string | null`; `prevStep(steps: string[], current: string | null): string | null`

- [ ] **Step 1: Write the failing tests** — `src/components/map/tour.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { INTRO, tourSteps, nextStep, prevStep } from './tour.ts'

const steps = tourSteps(['a', 'b', 'c'])

test('the tour starts with the intro card, then the stops in order', () => {
  assert.deepEqual(steps, [INTRO, 'a', 'b', 'c'])
})

test('nextStep: closed → intro → stops → closes after the last', () => {
  assert.equal(nextStep(steps, null), INTRO)
  assert.equal(nextStep(steps, INTRO), 'a')
  assert.equal(nextStep(steps, 'b'), 'c')
  assert.equal(nextStep(steps, 'c'), null)
  assert.equal(nextStep(steps, 'unknown'), INTRO)
})

test('prevStep: goes back one, and closes from the intro or when closed', () => {
  assert.equal(prevStep(steps, 'c'), 'b')
  assert.equal(prevStep(steps, 'a'), INTRO)
  assert.equal(prevStep(steps, INTRO), null)
  assert.equal(prevStep(steps, null), null)
})
```

- [ ] **Step 2: Run, expect FAIL** — `node --test src/components/map/tour.test.mjs` → `Cannot find module … tour.ts`.

- [ ] **Step 3: Implement** — `src/components/map/tour.ts`:

```ts
// Pure tour order for the map template: intro card first, then each stop.
// `null` means no pop-up is open.

export const INTRO = 'intro'

export function tourSteps(stopIds: string[]): string[] {
  return [INTRO, ...stopIds]
}

export function nextStep(steps: string[], current: string | null): string | null {
  if (current === null) return steps[0] ?? null
  const i = steps.indexOf(current)
  if (i === -1) return steps[0] ?? null
  return i + 1 < steps.length ? steps[i + 1] : null
}

export function prevStep(steps: string[], current: string | null): string | null {
  if (current === null) return null
  const i = steps.indexOf(current)
  return i > 0 ? steps[i - 1] : null
}
```

- [ ] **Step 4: Run, expect PASS** (3 tests).
- [ ] **Step 5: Commit** — `git add src/components/map/tour.ts src/components/map/tour.test.mjs && git commit -m "feat(map): pure tour order (intro → stops)"`

---

### Task 2: Stop types, placeholder content, validation

**Files:**
- Modify: `src/components/map/types.ts`, `src/components/map/reports/w31/content.ts`, `src/components/map/reports/w31/index.ts`
- Create: `src/components/map/modules/validate.ts`, `src/components/map/modules/validate.test.mjs`, `src/components/map/reports/w31/content.test.mjs`

**Interfaces:**
- Produces (types.ts): `Quote`, `Video`, `StopVoice`, `SliderRevealModule`, `SplitStatModule`, `RankedBarsModule`, `CaseStudyModule`, `TakeawaysModule`, `StopModule`, `MapStop`, `TourIntro`; `MapContent` gains `stops: MapStop[]`, `tour: { intro: TourIntro; start: string; next: string; end: string; prev: string; aria: string }`, `labels: { ringEyebrow: string; ringAria: string; close: string; prevStop: string; nextStop: string; videoSoon: string }`; `PanelProps` gains `onSelect: (id: string) => void`.
- Produces (validate.ts): `validateStops(stops: MapStop[]): string[]`, `assertValidStops(stops: MapStop[]): void`
- Produces (w31 content.ts): `content.stops` (6), `content.tour`, `content.labels`, and `export const poleCopy: Record<'meaning' | 'form', { name: string; definition: string; copy: string; listLabel: string }>`

- [ ] **Step 1: Add the types** — append to `src/components/map/types.ts` (and add the three new fields to `MapContent`, and `onSelect` to `PanelProps`):

```ts
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
  /** Shown on the tour bar instead of the number, e.g. "06 Takeaways". */
  tourLabel?: string
  /** Pill center on the 1440×900 canvas. */
  position: { x: number; y: number }
  /** One entry per paragraph. */
  copy: string[]
  voice?: StopVoice
  module: StopModule
}

export interface TourIntro {
  title: string
  body: string[]
}
```

Add to `MapContent`:

```ts
  /** The stops around the map, in tour order. */
  stops: MapStop[]
  tour: { intro: TourIntro; start: string; next: string; end: string; prev: string; aria: string }
  /** Small UI labels used by the map template. */
  labels: { ringEyebrow: string; ringAria: string; close: string; prevStop: string; nextStop: string; videoSoon: string }
```

Change `PanelProps` to:

```ts
export interface PanelProps {
  id: string
  onClose: () => void
  /** Open another item in the same drawer (e.g. a theme from the Meaning list). */
  onSelect: (id: string) => void
}
```

- [ ] **Step 2: Write the failing validation tests** — `src/components/map/modules/validate.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateStops, assertValidStops } from './validate.ts'

const stop = (id, number, module) => ({ id, number, title: id, position: { x: 0, y: 0 }, copy: [], module })
const bars = (values) => ({ type: 'bars', source: '', bars: values.map((value) => ({ label: 'x', value })) })

test('valid stops pass', () => {
  assert.deepEqual(validateStops([stop('a', '01', bars([10, 20])), stop('b', '02', { type: 'takeaways', title: '', items: [{ headline: 'h', line: 'l' }] })]), [])
})

test('catches duplicate ids and numbers', () => {
  const errs = validateStops([stop('a', '01', bars([1])), stop('a', '01', bars([1]))])
  assert.ok(errs.some((e) => e.includes('duplicate stop id "a"')))
  assert.ok(errs.some((e) => e.includes('duplicate stop number "01"')))
})

test('catches percentages outside 0–100 and empty lists', () => {
  const errs = validateStops([
    stop('s', '01', { type: 'slider', source: '', question: '', minLabel: '', maxLabel: '', value: 690, valueLabel: '', lines: [], revealButton: '', guessLabel: '' }),
    stop('p', '02', { type: 'split', source: '', headline: 57, headlineLabel: '', parts: [{ label: 'x', value: -3 }] }),
    stop('b', '03', bars([])),
    stop('t', '04', { type: 'takeaways', title: '', items: [] }),
  ])
  assert.equal(errs.length, 4)
  for (const id of ['s', 'p', 'b', 't']) assert.ok(errs.some((e) => e.includes(`stop "${id}"`)), id)
})

test('assertValidStops throws with every mistake listed', () => {
  assert.throws(() => assertValidStops([stop('a', '01', bars([101]))]), /content\.ts[\s\S]*stop "a"/)
})
```

- [ ] **Step 3: Run, expect FAIL** — `node --test src/components/map/modules/validate.test.mjs` → module not found.

- [ ] **Step 4: Implement** — `src/components/map/modules/validate.ts`:

```ts
import type { MapStop } from '../types'

// Survey numbers are typed by hand in content.ts; this catches typos
// (690 for 69, an empty list, a duplicate number) before they ship.

const isPct = (v: number) => Number.isFinite(v) && v >= 0 && v <= 100

export function validateStops(stops: MapStop[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const numbers = new Set<string>()
  for (const s of stops) {
    if (ids.has(s.id)) errors.push(`duplicate stop id "${s.id}"`)
    ids.add(s.id)
    if (numbers.has(s.number)) errors.push(`duplicate stop number "${s.number}"`)
    numbers.add(s.number)
    const m = s.module
    if (m.type === 'slider' && !isPct(m.value)) errors.push(`stop "${s.id}": slider value must be 0–100 (got ${m.value})`)
    if (m.type === 'split') {
      const bad = [m.headline, ...m.parts.map((p) => p.value)].filter((v) => !isPct(v))
      if (bad.length) errors.push(`stop "${s.id}": split values must be 0–100 (got ${bad.join(', ')})`)
    }
    if (m.type === 'bars') {
      if (!m.bars.length) errors.push(`stop "${s.id}": bar list is empty`)
      const bad = m.bars.map((b) => b.value).filter((v) => !isPct(v))
      if (bad.length) errors.push(`stop "${s.id}": bar values must be 0–100 (got ${bad.join(', ')})`)
    }
    if (m.type === 'takeaways' && !m.items.length) errors.push(`stop "${s.id}": no takeaways listed`)
  }
  return errors
}

export function assertValidStops(stops: MapStop[]): void {
  const errors = validateStops(stops)
  if (errors.length) throw new Error(`content.ts stops have mistakes:\n- ${errors.join('\n- ')}`)
}
```

- [ ] **Step 5: Run, expect PASS** (4 tests).

- [ ] **Step 6: Write the failing content test** — `src/components/map/reports/w31/content.test.mjs` (structure only, no wording):

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { content, poleCopy } from './content.ts'
import { validateStops } from '../../modules/validate.ts'

test('six stops, numbered 01–06 in tour order, with valid data', () => {
  assert.deepEqual(content.stops.map((s) => s.number), ['01', '02', '03', '04', '05', '06'])
  assert.deepEqual(validateStops(content.stops), [])
})

test('the Q10 slider uses 69 for now', () => {
  const slider = content.stops.find((s) => s.module.type === 'slider')
  assert.equal(slider.module.value, 69)
})

test('Takeaways is the last stop and is a takeaways module', () => {
  assert.equal(content.stops.at(-1).module.type, 'takeaways')
})

test('both poles have copy entries', () => {
  for (const p of ['meaning', 'form']) assert.ok(poleCopy[p] && poleCopy[p].definition.length > 0, p)
})
```

Run `node --test src/components/map/reports/w31/content.test.mjs` → FAIL. (It first fails with `Cannot find module … w31/themes`: `node --test` can't resolve content.ts's extension-less `import { themes } from './themes'`. Step 7 removes that import.)

- [ ] **Step 7: Make content.ts testable, then add the placeholder content**

First, in `src/components/map/reports/w31/content.ts`, delete `import { themes } from './themes'` and the `colorOf` helper, and replace each ticker `color: colorOf('<id>')` with the theme's family color directly (same colors as before, so nothing changes on screen):

| `colorOf(…)` | replace with |
|---|---|
| `'delight'`, `'emotion'` | `'var(--w31-orange)'` |
| `'novelty'` | `'var(--w31-blue)'` |
| `'insight'` | `'var(--w31-yellow)'` |
| `'craft'` | `'var(--w31-forest)'` |
| `'voice'` | `'var(--w31-pink)'` |
| `'narrative'` | `'var(--w31-blue-light)'` |
| `'stickiness'` | `'var(--w31-green)'` |

Now content.ts has only a type import, so `node --test` can load it. Then add inside `content` (after `gate`):

```ts
  // Stops around the map. ALL COPY BELOW IS PLACEHOLDER from the content outline; edit freely.
  stops: [
    {
      id: 'attention',
      number: '01',
      title: 'The Attention Trap',
      position: { x: 165, y: 300 },
      copy: ['About 10 hours of media a day. Roughly 1,500 pieces of content. Most of it ends up as noise. [Copy TK]'],
      voice: {
        kind: 'video',
        video: {
          speaker: 'Lea Karam',
          role: 'Founder & CEO, Mindscope',
          length: '03:37',
          quote: "Because of this cognitive overload that we're all exposed to, humans have built sharper filters.",
        },
      },
      module: {
        type: 'slider',
        source: 'Webby Judge survey · Q10',
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
      copy: ['Metrics were a gift to creative work. But once everyone optimizes for views, the view count says less and less. [Copy TK]'],
      voice: { kind: 'quote', quote: { text: 'Craft and effectiveness are not two sides of the same coin anymore.', name: 'Matheus Faustino', role: 'Creative Director, Monks' } },
      module: {
        type: 'split',
        source: 'Webby Judge survey · Q3',
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
      position: { x: 1275, y: 300 },
      copy: ['When everyone optimizes toward the same numbers, everyone arrives at the same work. [Copy TK]'],
      voice: { kind: 'quote', quote: { text: "We've gotten incredibly good at optimizing for what performs, which can also mean optimizing toward sameness.", name: 'Kaare Wesnaes', role: 'Head of Innovation, Ogilvy' } },
      module: {
        type: 'bars',
        source: "Webby Judge survey · Q8 · tactics judges are tired of",
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
      position: { x: 1275, y: 610 },
      copy: ['Judges agree a high view count proves one thing: the work was put in front of people. [Copy TK]'],
      voice: { kind: 'quote', quote: { text: 'The comment section has become one of the most valuable spaces in social.', name: 'Wangari Nderi', role: 'Group Brand, Digital & Communications Lead, Live54 Plus' } },
      module: {
        type: 'bars',
        source: 'Webby Judge survey · Q4 · a high view count signals…',
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
      id: 'takeaways',
      number: '06',
      title: 'Takeaways',
      tourLabel: '06 Takeaways',
      position: { x: 165, y: 610 },
      copy: [],
      module: {
        type: 'takeaways',
        title: 'How to build memory in an attention economy',
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
    intro: {
      title: 'How to read the field',
      body: [
        'Each shape is one reason people gave for why something stuck. Its size shows how many answers led with that reason.',
        'Warm colors are Meaning, the human insight, feeling or point of view behind the work; cool colors are Form, the shape and execution that carry it. Shapes in the same color belong to the same family of reasons.',
      ],
    },
    start: 'Start the tour',
    next: 'Next',
    end: 'Back to the field',
    prev: 'Previous',
    aria: 'Report tour',
  },
  labels: {
    ringEyebrow: 'Outer ring',
    ringAria: 'Report sections',
    close: 'Close',
    prevStop: 'Previous',
    nextStop: 'Next',
    videoSoon: 'Video coming soon',
  },
```

And after `content`:

```ts
/** MEANING / FORM drawer copy. Definitions from w31-report-data-themes.json; the rest is placeholder. */
export const poleCopy = {
  meaning: {
    name: 'Meaning',
    definition: 'The human insight, emotion or point of view that makes the work matter.',
    copy: '[Copy TK: why Meaning matters for people making work.]',
    listLabel: 'Reasons on this side',
  },
  form: {
    name: 'Form',
    definition: 'A shape that helps people hold on to a meaningful idea, and the execution that carries it.',
    copy: '[Copy TK: why Form matters for people making work.]',
    listLabel: 'Reasons on this side',
  },
}
```

In `src/components/map/reports/w31/index.ts`, add `import { assertValidStops } from '../../modules/validate'` and, before `export const w31`, `assertValidStops(content.stops)`.

- [ ] **Step 8: Run all tests, type-check, lint** — `node --test 'src/components/map/**/*.test.mjs' && npx tsc --noEmit && npx eslint src/components/map` → all pass. (tsc will flag `ThemePanel` not using `onSelect` only if unused-vars errors; it accepts extra props.)
- [ ] **Step 9: Commit** — `git add src/components/map && git commit -m "feat(map): stop types, placeholder stop content, survey-number validation"`

---

### Task 3: Ring geometry and calculated field zoom

**Files:**
- Create: `src/components/map/ringGeometry.ts`, `src/components/map/ringGeometry.test.mjs`
- Modify: `src/components/map/reports/w31/summary.ts`, `src/components/map/reports/w31/content.test.mjs`

**Interfaces:**
- Consumes: `MapStop` (Task 2), `summary` (existing)
- Produces: `PILL_HEIGHT = 44`; `pillLabel(s): string` (= `` `${number} ${title}` ``); `pillWidth(label: string): number`; `interface Rect { x; y; w; h }` (top-left); `pillRect(s: { number; title; position }): Rect`; `circleHitsRect(c: {x;y;r}, rect: Rect, pad: number): boolean`; `fitZoom(circles, rects, origin, max, min = 0.6, pad = 12): number`; from summary.ts: `FIELD_ORIGIN`, `MAX_FIELD_ZOOM = 1.2`, `fieldZoom: number`

- [ ] **Step 1: Failing tests** — `src/components/map/ringGeometry.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PILL_HEIGHT, pillLabel, pillWidth, pillRect, circleHitsRect, fitZoom } from './ringGeometry.ts'

const origin = { x: 720, y: 470 }

test('pillRect is centered on the stop position and sized from its label', () => {
  const s = { number: '01', title: 'Abc', position: { x: 200, y: 300 } }
  const w = pillWidth(pillLabel(s))
  assert.deepEqual(pillRect(s), { x: 200 - w / 2, y: 300 - PILL_HEIGHT / 2, w, h: PILL_HEIGHT })
  assert.ok(pillWidth('a much longer label') > pillWidth('short'))
})

test('circleHitsRect includes padding', () => {
  const r = { x: 0, y: 0, w: 10, h: 10 }
  assert.equal(circleHitsRect({ x: 30, y: 5, r: 5 }, r, 0), false)
  assert.equal(circleHitsRect({ x: 30, y: 5, r: 5 }, r, 16), true)
})

test('fitZoom keeps the max zoom when nothing collides', () => {
  assert.equal(fitZoom([{ x: 720, y: 470, r: 50 }], [{ x: 0, y: 0, w: 40, h: 40 }], origin, 1.2), 1.2)
})

test('fitZoom steps down until no circle touches a pill', () => {
  const circle = { x: 100, y: 470, r: 10 }
  const rect = { x: 0, y: 450, w: 60, h: 40 }
  const z = fitZoom([circle], [rect], origin, 1.2)
  assert.equal(z, 1.02)
  const zc = { x: origin.x + (circle.x - origin.x) * z, y: origin.y + (circle.y - origin.y) * z, r: circle.r * z }
  assert.equal(circleHitsRect(zc, rect, 12), false)
})

test('fitZoom bottoms out at min when the pill covers the center', () => {
  assert.equal(fitZoom([{ x: 720, y: 470, r: 10 }], [{ x: 700, y: 450, w: 40, h: 40 }], origin, 1.2), 0.6)
})
```

- [ ] **Step 2: Run, expect FAIL** (module not found).

- [ ] **Step 3: Implement** — `src/components/map/ringGeometry.ts`:

```ts
// Geometry for the ring of stop pills on the 1440×900 canvas, and the
// field zoom that keeps every blob clear of them.

export const PILL_HEIGHT = 44

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Circle {
  x: number
  y: number
  r: number
}

export function pillLabel(s: { number: string; title: string }): string {
  return `${s.number} ${s.title}`
}

/** Fixed pill width from the label (Aktiv 15px ≈ 9px/char + padding), so layout math matches what renders. */
export function pillWidth(label: string): number {
  return Math.round(48 + label.length * 9)
}

export function pillRect(s: { number: string; title: string; position: { x: number; y: number } }): Rect {
  const w = pillWidth(pillLabel(s))
  return { x: s.position.x - w / 2, y: s.position.y - PILL_HEIGHT / 2, w, h: PILL_HEIGHT }
}

export function circleHitsRect(c: Circle, rect: Rect, pad: number): boolean {
  const nx = Math.max(rect.x - pad, Math.min(c.x, rect.x + rect.w + pad))
  const ny = Math.max(rect.y - pad, Math.min(c.y, rect.y + rect.h + pad))
  return Math.hypot(c.x - nx, c.y - ny) < c.r
}

/**
 * Largest zoom (stepping down by 0.01 from `max`) at which no circle,
 * scaled around `origin`, touches any rect. Returns `min` if none fits.
 */
export function fitZoom(
  circles: Circle[],
  rects: Rect[],
  origin: { x: number; y: number },
  max: number,
  min = 0.6,
  pad = 12,
): number {
  for (let z = max; z >= min; z = Math.round((z - 0.01) * 100) / 100) {
    const hit = circles.some((c) => {
      const zc = { x: origin.x + (c.x - origin.x) * z, y: origin.y + (c.y - origin.y) * z, r: c.r * z }
      return rects.some((r) => circleHitsRect(zc, r, pad))
    })
    if (!hit) return z
  }
  return min
}
```

- [ ] **Step 4: Run, expect PASS** (5 tests).

- [ ] **Step 5: Calculated zoom in summary.ts** — append to `src/components/map/reports/w31/summary.ts`:

```ts
import { content } from './content'
import { fitZoom, pillRect } from '../../ringGeometry'

/** The field zooms around this point (same as before). */
export const FIELD_ORIGIN = { x: 720, y: 470 }
/** Never larger than the 20% bump Jordana chose; smaller if the ring needs room. */
export const MAX_FIELD_ZOOM = 1.2

/** Biggest zoom at which no blob sits under a stop pill. Recomputed if data or stop positions change. */
export const fieldZoom = fitZoom(
  summary.themes.filter((t) => t.size > 0).map((t) => ({ x: t.x, y: t.y, r: t.size / 2 })),
  content.stops.map(pillRect),
  FIELD_ORIGIN,
  MAX_FIELD_ZOOM,
)
```

(Move the two new `import` lines to the top of the file with the others.)

- [ ] **Step 6: Content test — pills don't overlap each other** — append to `src/components/map/reports/w31/content.test.mjs`:

```js
import { pillRect } from '../../ringGeometry.ts'

test('stop pills never overlap each other', () => {
  const rects = content.stops.map(pillRect)
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j]
    const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
    assert.ok(apart, `${content.stops[i].number} overlaps ${content.stops[j].number}`)
  }
})
```

(Put the `import` at the top of the file.) Run all tests → PASS.

- [ ] **Step 7: Note on checking the zoom** — summary.ts uses extension-less imports, so it can't be loaded by `node --test`; `fitZoom` itself is covered by the tests above. The actual value is read in the browser in Task 8 (the `.w31-field` transform) and reported to Jordana.
- [ ] **Step 8: Commit** — `git add src/components/map && git commit -m "feat(map): ring geometry + field zoom calculated to keep blobs clear of stop pills"`

---

### Task 4: Data modules and voice block

**Files:**
- Create: `src/components/map/modules/SliderReveal.tsx`, `SplitStat.tsx`, `RankedBars.tsx`, `CaseStudy.tsx`, `Takeaways.tsx`, `VoiceBlock.tsx`, `StopModule.tsx`
- Modify: `src/components/map/map.css`, `src/components/map/reports/w31/brand.css`

**Interfaces:**
- Consumes: module types (Task 2)
- Produces: `StopModule({ module }: { module: StopModule })` (switch), `VoiceBlock({ voice, labels }: { voice: StopVoice; labels: MapContent['labels'] })`

- [ ] **Step 1: SliderReveal** — `src/components/map/modules/SliderReveal.tsx`:

```tsx
'use client'

import { useState } from 'react'
import type { SliderRevealModule } from '../types'

export function SliderReveal({ m }: { m: SliderRevealModule }) {
  const [guess, setGuess] = useState(50)
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="map-mod map-mod-slider">
      <p className="map-mod-source">{m.source}</p>
      <p className="map-mod-question">{m.question}</p>
      <div className="map-slider">
        <input
          type="range"
          min={0}
          max={100}
          value={guess}
          onChange={(e) => setGuess(Number(e.target.value))}
          disabled={revealed}
          aria-label={m.question}
        />
        {revealed && <span className="map-slider-answer" style={{ left: `${m.value}%` }} aria-hidden="true" />}
        <div className="map-slider-scale">
          <span>{m.minLabel}</span>
          <span>{m.maxLabel}</span>
        </div>
      </div>
      {!revealed ? (
        <button type="button" className="map-btn map-btn-primary" onClick={() => setRevealed(true)}>
          {m.revealButton}
        </button>
      ) : (
        <div className="map-mod-reveal" aria-live="polite">
          <p className="map-mod-big">
            {m.value}
            <span>/100</span>
          </p>
          <p className="map-mod-label">{m.valueLabel}</p>
          <p className="map-mod-guess">
            {m.guessLabel}: {guess}
          </p>
          <ul className="map-mod-lines">
            {m.lines.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: SplitStat** — `src/components/map/modules/SplitStat.tsx`:

```tsx
import type { SplitStatModule } from '../types'

export function SplitStat({ m }: { m: SplitStatModule }) {
  return (
    <div className="map-mod map-mod-split">
      <p className="map-mod-source">{m.source}</p>
      <p className="map-mod-big">{m.headline}%</p>
      <p className="map-mod-label">{m.headlineLabel}</p>
      <div className="map-split" aria-hidden="true">
        {m.parts.map((p) => <span key={p.label} style={{ flexBasis: `${p.value}%` }} />)}
      </div>
      <ul className="map-mod-list">
        {m.parts.map((p) => (
          <li key={p.label}>
            <span className="map-mod-num">{p.value}%</span>
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 3: RankedBars** — `src/components/map/modules/RankedBars.tsx`:

```tsx
import type { RankedBarsModule } from '../types'

export function RankedBars({ m }: { m: RankedBarsModule }) {
  const bars = [...m.bars].sort((a, b) => b.value - a.value)
  return (
    <div className="map-mod map-mod-bars">
      <p className="map-mod-source">{m.source}</p>
      <ol className="map-bars">
        {bars.map((b) => (
          <li key={b.label}>
            <span className="map-bars-label">{b.label}</span>
            <span className="map-bars-track" aria-hidden="true">
              <span className="map-bars-fill" style={{ width: `${b.value}%` }} />
            </span>
            <span className="map-mod-num">{b.value}%</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: CaseStudy + Takeaways** — `src/components/map/modules/CaseStudy.tsx`:

```tsx
import type { CaseStudyModule } from '../types'

export function CaseStudy({ m }: { m: CaseStudyModule }) {
  return (
    <div className="map-mod map-mod-case">
      <h3>{m.title}</h3>
      <p>{m.body}</p>
    </div>
  )
}
```

`src/components/map/modules/Takeaways.tsx`:

```tsx
import type { TakeawaysModule } from '../types'

export function Takeaways({ m }: { m: TakeawaysModule }) {
  return (
    <div className="map-mod map-mod-takeaways">
      <h2>{m.title}</h2>
      <ol>
        {m.items.map((t, i) => (
          <li key={t.headline}>
            <span className="map-mod-num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{t.headline}</h3>
              <p>{t.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 5: VoiceBlock + StopModule switch** — `src/components/map/modules/VoiceBlock.tsx`:

```tsx
import type { MapContent, StopVoice } from '../types'

export function VoiceBlock({ voice, labels }: { voice: StopVoice; labels: MapContent['labels'] }) {
  if (voice.kind === 'quote') {
    const q = voice.quote
    return (
      <figure className="map-voice map-voice-quote">
        <blockquote>“{q.text}”</blockquote>
        <figcaption>
          <strong>{q.name}</strong>
          {q.role ? `, ${q.role}` : ''}
        </figcaption>
      </figure>
    )
  }
  const v = voice.video
  return (
    <figure className="map-voice map-voice-video">
      {v.url ? (
        <div className="map-video">
          <iframe src={v.url} title={v.speaker} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <div className="map-video map-video-placeholder">
          <span>{labels.videoSoon}</span>
        </div>
      )}
      <figcaption>
        <strong>{v.speaker}</strong>
        {v.role ? `, ${v.role}` : ''}
        {v.length ? ` · ${v.length}` : ''}
      </figcaption>
      {v.quote && <blockquote>“{v.quote}”</blockquote>}
    </figure>
  )
}
```

`src/components/map/modules/StopModule.tsx`:

```tsx
import type { StopModule as Module } from '../types'
import { SliderReveal } from './SliderReveal'
import { SplitStat } from './SplitStat'
import { RankedBars } from './RankedBars'
import { CaseStudy } from './CaseStudy'
import { Takeaways } from './Takeaways'

export function StopModule({ module }: { module: Module }) {
  switch (module.type) {
    case 'slider':
      return <SliderReveal m={module} />
    case 'split':
      return <SplitStat m={module} />
    case 'bars':
      return <RankedBars m={module} />
    case 'case':
      return <CaseStudy m={module} />
    case 'takeaways':
      return <Takeaways m={module} />
  }
}
```

- [ ] **Step 6: Module styles** — append to `src/components/map/map.css`:

```css
/* Data modules (inside a stop pop-up) */
.map-root .map-mod { display: flex; flex-direction: column; gap: 16px; }
.map-root .map-mod-source { margin: 0; font-size: var(--map-size-label); letter-spacing: 0.08em; text-transform: uppercase; }
.map-root .map-mod-question, .map-root .map-mod-label { margin: 0; font-size: 18px; line-height: 1.4; }
.map-root .map-mod-big { margin: 0; font-family: var(--map-font-display); font-size: var(--map-size-panel-pct); line-height: 1; }
.map-root .map-mod-big span { font-size: 0.4em; }
.map-root .map-mod-num { font-family: var(--map-font-display); font-size: 22px; min-width: 56px; }
.map-root .map-mod-list, .map-root .map-mod-lines { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.map-root .map-mod-list li { display: flex; align-items: baseline; gap: 12px; }
.map-root .map-mod-guess { margin: 0; font-weight: 500; }
.map-root .map-slider { position: relative; padding-top: 8px; }
.map-root .map-slider input[type='range'] { width: 100%; accent-color: var(--map-ink); }
.map-root .map-slider-answer { position: absolute; top: 0; width: 4px; height: 32px; margin-left: -2px; background: var(--map-data-1); }
.map-root .map-slider-scale { display: flex; justify-content: space-between; font-size: 14px; }
.map-root .map-split { display: flex; height: 28px; border: 1.5px solid var(--map-ink); }
.map-root .map-split span:nth-child(1) { background: var(--map-data-1); }
.map-root .map-split span:nth-child(2) { background: var(--map-data-2); }
.map-root .map-split span:nth-child(3) { background: var(--map-data-3); }
.map-root .map-split span:nth-child(4) { background: var(--map-data-4); }
.map-root .map-bars { margin: 0; padding: 0; list-style: none; display: grid; gap: 14px; }
.map-root .map-bars li { display: grid; grid-template-columns: 1fr auto; grid-template-areas: 'label num' 'track track'; gap: 6px 12px; align-items: baseline; }
.map-root .map-bars-label { grid-area: label; }
.map-root .map-bars li .map-mod-num { grid-area: num; min-width: 0; }
.map-root .map-bars-track { grid-area: track; height: 14px; background: color-mix(in srgb, var(--map-ink) 8%, transparent); }
.map-root .map-bars-fill { display: block; height: 100%; background: var(--map-data-1); }
.map-root .map-mod-case { padding: 24px; background: color-mix(in srgb, var(--map-ink) 6%, transparent); }
.map-root .map-mod-case h3 { margin: 0 0 8px; font-family: var(--map-font-subhead); font-weight: var(--map-subhead-weight); font-size: 20px; }
.map-root .map-mod-takeaways h2 { margin: 0 0 8px; font-family: var(--map-font-display); font-weight: 400; font-size: 44px; line-height: 1; text-transform: uppercase; }
.map-root .map-mod-takeaways ol { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
.map-root .map-mod-takeaways li { display: flex; gap: 16px; }
.map-root .map-mod-takeaways h3 { margin: 0 0 6px; font-family: var(--map-font-subhead); font-weight: var(--map-subhead-weight); font-size: 22px; }
.map-root .map-mod-takeaways p { margin: 0; line-height: 1.5; }

/* Voice block (quote or video) */
.map-root .map-voice { margin: 0; display: grid; gap: 10px; }
.map-root .map-voice blockquote { margin: 0; font-family: var(--map-font-subhead); font-weight: var(--map-subhead-weight); font-size: 22px; line-height: 1.3; }
.map-root .map-voice figcaption { font-size: 14px; }
.map-root .map-video { aspect-ratio: 16 / 9; background: var(--map-ink); }
.map-root .map-video iframe { width: 100%; height: 100%; border: 0; }
.map-root .map-video-placeholder { display: flex; align-items: center; justify-content: center; color: var(--map-ground); font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; }
```

Add tokens to the `.map-root.map-w31 { … }` block in `brand.css`:

```css
  /* Data accents for charts (palette colors are for data only) */
  --map-data-1: var(--w31-orange);
  --map-data-2: var(--w31-pink);
  --map-data-3: var(--w31-yellow);
  --map-data-4: var(--w31-blue);
```

- [ ] **Step 7: Type-check + lint** — `npx tsc --noEmit && npx eslint src/components/map` → clean.
- [ ] **Step 8: Commit** — `git add src/components/map && git commit -m "feat(map): data modules (slider reveal, split stat, ranked bars, case study, takeaways) + voice block"`

---

### Task 5: Ring pills, stop pop-up, wiring into the stage

**Files:**
- Create: `src/components/map/Ring.tsx`, `src/components/map/StopModal.tsx`
- Modify: `src/components/map/MapStage.tsx`, `src/components/map/map.css`

**Interfaces:**
- Consumes: `tour.ts` (Task 1), `ringGeometry` (Task 3), `StopModule`, `VoiceBlock` (Task 4), `MapContent.stops/tour/labels`
- Produces: `Ring({ stops, current, visited, ariaLabel, onOpen })`; `StopModal({ stop, intro, labels, onClose, onPrev, onNext })` (`stop === null` → intro card)

- [ ] **Step 1: Ring** — `src/components/map/Ring.tsx`:

```tsx
'use client'

import type { MapStop } from './types'
import { PILL_HEIGHT, pillLabel, pillWidth } from './ringGeometry'

export function Ring({
  stops,
  current,
  visited,
  ariaLabel,
  onOpen,
}: {
  stops: MapStop[]
  current: string | null
  visited: string[]
  ariaLabel: string
  onOpen: (id: string) => void
}) {
  return (
    <nav className="map-ring" aria-label={ariaLabel}>
      {stops.map((s) => {
        const w = pillWidth(pillLabel(s))
        const cls = `map-ring-stop${current === s.id ? ' is-current' : ''}${visited.includes(s.id) ? ' is-visited' : ''}`
        return (
          <button
            key={s.id}
            type="button"
            className={cls}
            style={{ left: s.position.x - w / 2, top: s.position.y - PILL_HEIGHT / 2, width: w, height: PILL_HEIGHT }}
            onClick={() => onOpen(s.id)}
            aria-current={current === s.id ? 'step' : undefined}
          >
            <span className="map-ring-num">{s.number}</span> {s.title}
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: StopModal** — `src/components/map/StopModal.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import type { MapContent, MapStop, TourIntro } from './types'
import { StopModule } from './modules/StopModule'
import { VoiceBlock } from './modules/VoiceBlock'

/**
 * Large center pop-up for a stop (or the tour's intro card when `stop` is null).
 * Native <dialog>: focus is trapped, Escape closes, and the page behind is inert.
 */
export function StopModal({
  stop,
  intro,
  labels,
  onClose,
  onPrev,
  onNext,
}: {
  stop: MapStop | null
  intro: TourIntro
  labels: MapContent['labels']
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])

  const isTakeaways = stop?.module.type === 'takeaways'

  return (
    <dialog
      ref={ref}
      className={`map-stop${stop ? '' : ' is-intro'}${isTakeaways ? ' is-wide' : ''}`}
      aria-labelledby="map-stop-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close()
      }}
      onKeyDown={(e) => {
        // Arrow keys move between stops, except inside the slider.
        if ((e.target as HTMLElement).tagName === 'INPUT') return
        if (e.key === 'ArrowLeft' && onPrev) onPrev()
        if (e.key === 'ArrowRight' && onNext) onNext()
      }}
    >
      <div className="map-stop-card">
        <div className="map-stop-controls">
          <button type="button" className="map-btn map-btn-secondary" onClick={onPrev} disabled={!onPrev} aria-label={labels.prevStop}>
            ←
          </button>
          <button type="button" className="map-btn map-btn-secondary" onClick={onNext} disabled={!onNext} aria-label={labels.nextStop}>
            →
          </button>
          <button type="button" className="map-btn map-btn-primary" onClick={() => ref.current?.close()}>
            {labels.close} ×
          </button>
        </div>

        {stop === null ? (
          <div className="map-stop-intro">
            <h2 id="map-stop-title">{intro.title}</h2>
            {intro.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        ) : isTakeaways ? (
          <div className="map-stop-full">
            <p className="map-stop-eyebrow">
              {labels.ringEyebrow} · {stop.number}
            </p>
            <h2 id="map-stop-title" className="map-visually-hidden">{stop.title}</h2>
            <StopModule module={stop.module} />
          </div>
        ) : (
          <div className="map-stop-panels">
            <div className="map-stop-left">
              <p className="map-stop-eyebrow">
                {labels.ringEyebrow} · {stop.number}
              </p>
              <h2 id="map-stop-title">{stop.title}</h2>
              {stop.copy.map((p) => <p key={p}>{p}</p>)}
              {stop.voice && <VoiceBlock voice={stop.voice} labels={labels} />}
            </div>
            <div className="map-stop-right">
              <StopModule module={stop.module} />
            </div>
          </div>
        )}
      </div>
    </dialog>
  )
}
```

- [ ] **Step 3: Wire into MapStage** — replace `src/components/map/MapStage.tsx` with:

```tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapReportConfig } from './types'
import { Ring } from './Ring'
import { StopModal } from './StopModal'
import { INTRO, nextStep, prevStep, tourSteps } from './tour'

const W = 1440
const H = 900

export function MapStage({
  config,
  selectedId,
  onSelect,
}: {
  config: MapReportConfig
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const { Center, Panel, content } = config
  const steps = useMemo(() => tourSteps(content.stops.map((s) => s.id)), [content.stops])
  // Which pop-up is open: INTRO, a stop id, or null (none).
  const [step, setStep] = useState<string | null>(null)
  const [visited, setVisited] = useState<string[]>([])

  const go = useCallback(
    (id: string | null) => {
      setStep(id)
      if (id) {
        onSelect(null) // a stop pop-up replaces any open drawer
        setVisited((v) => (v.includes(id) ? v : [...v, id]))
      }
    },
    [onSelect],
  )

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onSelect(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, onSelect])

  const stop = content.stops.find((s) => s.id === step) ?? null
  const prev = prevStep(steps, step)
  const next = nextStep(steps, step)

  return (
    <section id="map" className="map-stage-wrap">
      <div className="map-stage" ref={stageRef}>
        <div className="map-canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Center selectedId={selectedId} onSelect={onSelect} />
          <Ring stops={content.stops} current={step} visited={visited} ariaLabel={content.labels.ringAria} onOpen={go} />
        </div>
        {selectedId && <Panel id={selectedId} onClose={() => onSelect(null)} onSelect={onSelect} />}
      </div>
      {step !== null && (
        <StopModal
          stop={step === INTRO ? null : stop}
          intro={content.tour.intro}
          labels={content.labels}
          onClose={() => setStep(null)}
          onPrev={prev ? () => go(prev) : undefined}
          onNext={next ? () => go(next) : undefined}
        />
      )}
    </section>
  )
}
```

- [ ] **Step 4: Ring + pop-up styles** — append to `src/components/map/map.css`:

```css
/* Ring of stops (on the canvas, above the field) */
.map-root .map-ring { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
.map-root .map-ring-stop {
  position: absolute; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 16px;
  border: 0; border-radius: var(--map-radius-pill); background: var(--map-btn-secondary-bg); color: var(--map-btn-secondary-text);
  box-shadow: inset 0 0 0 1.5px var(--map-ink); font-family: var(--map-font-body); font-weight: 500; font-size: 15px;
  white-space: nowrap; overflow: hidden; cursor: pointer; pointer-events: auto; transition: transform 150ms ease;
}
.map-root .map-ring-stop:hover { transform: translateY(-2px); }
.map-root .map-ring-stop.is-current { background: var(--map-btn-primary-bg); color: var(--map-btn-primary-text); }
.map-root .map-ring-num { font-family: var(--map-font-display); font-size: 17px; }
.map-root .map-ring-stop.is-visited::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Stop pop-up (native dialog, centered) */
.map-root .map-stop {
  position: fixed; inset: 0; margin: auto; width: min(1200px, 92vw); height: min(780px, 88dvh); padding: 0;
  border: 1.5px solid var(--map-ink); background: var(--map-ground); color: var(--map-ink); font-family: var(--map-font-body);
}
.map-root .map-stop.is-intro { height: fit-content; width: min(680px, 92vw); }
.map-root .map-stop::backdrop { background: var(--map-gate-overlay); }
.map-root .map-stop-card { position: relative; height: 100%; overflow-y: auto; padding: 64px 56px 48px; }
.map-root .map-stop-controls { position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; }
.map-root .map-stop-controls .map-btn:disabled { opacity: 0.35; cursor: default; }
.map-root .map-stop-panels { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 56px; }
.map-root .map-stop-left { display: grid; gap: 16px; align-content: start; }
.map-root .map-stop-left p { margin: 0; line-height: 1.6; }
.map-root .map-stop-eyebrow { margin: 0; font-size: var(--map-size-label); letter-spacing: 0.08em; text-transform: uppercase; }
.map-root .map-stop h2 { margin: 0; font-family: var(--map-font-display); font-weight: 400; font-size: 48px; line-height: 0.95; text-transform: uppercase; }
.map-root .map-stop-intro { display: grid; gap: 16px; }
.map-root .map-stop-intro p { margin: 0; line-height: 1.6; }
.map-root .map-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
```

- [ ] **Step 5: Type-check, lint, tests** — `npx tsc --noEmit && npx eslint src/components/map && node --test 'src/components/map/**/*.test.mjs'`.
- [ ] **Step 6: Commit** — `git add src/components/map && git commit -m "feat(map): ring of stop pills + center stop pop-up with prev/next"`

---

### Task 6: Bottom band (tour bar + field ticker) and calculated zoom in the field

**Files:**
- Create: `src/components/map/TourBar.tsx`
- Modify: `src/components/map/MapStage.tsx`, `src/components/map/Ticker.tsx`, `src/components/map/map.css`, `src/components/map/reports/w31/brand.css`, `src/components/map/reports/w31/MemoryField.tsx`

**Interfaces:**
- Consumes: `tour.ts`, `content.tour`, `content.stops`, `Ticker`, `fieldZoom` (Task 3)
- Produces: `TourBar({ stops, labels, current, onGo, onPrev, onNext })`; `Ticker` gains optional `className`

- [ ] **Step 1: TourBar** — `src/components/map/TourBar.tsx`:

```tsx
'use client'

import type { MapContent, MapStop } from './types'

export function TourBar({
  stops,
  labels,
  current,
  isLast,
  onGo,
  onPrev,
  onNext,
}: {
  stops: MapStop[]
  labels: MapContent['tour']
  current: string | null
  isLast: boolean
  onGo: (id: string) => void
  onPrev: () => void
  onNext: () => void
}) {
  const primary = current === null ? labels.start : isLast ? labels.end : labels.next
  return (
    <nav className="map-tour" aria-label={labels.aria}>
      <button type="button" className="map-tour-prev" onClick={onPrev} disabled={current === null} aria-label={labels.prev}>
        ←
      </button>
      <ol className="map-tour-steps">
        {stops.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`map-tour-pill${current === s.id ? ' is-current' : ''}`}
              aria-current={current === s.id ? 'step' : undefined}
              onClick={() => onGo(s.id)}
            >
              {s.tourLabel ?? s.number}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="map-btn map-btn-secondary map-tour-next" onClick={onNext}>
        {primary} <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}
```

- [ ] **Step 2: Ticker className** — in `src/components/map/Ticker.tsx` change the signature to `export function Ticker({ label, items, className }: { label: string; items: TickerItem[]; className?: string })` and the root to `<div className={`map-ticker${className ? ` ${className}` : ''}`}>`.

- [ ] **Step 3: Band in MapStage** — in `src/components/map/MapStage.tsx` add imports `import { TourBar } from './TourBar'` and `import { Ticker } from './Ticker'`, and insert right after the closing `</div>` of `.map-stage`:

```tsx
      <div className="map-band">
        <TourBar
          stops={content.stops}
          labels={content.tour}
          current={step}
          isLast={step === steps[steps.length - 1]}
          onGo={go}
          onPrev={() => go(prev)}
          onNext={() => go(next)}
        />
        <Ticker
          label={content.tickerLabel}
          items={content.ticker}
          className={`map-ticker-field${step !== null ? ' is-muted' : ''}`}
        />
      </div>
```

- [ ] **Step 4: Band styles + stage height** — in `map.css`, change the `.map-root .map-stage` rule's height to `calc(100dvh - var(--map-header-height) - var(--map-tour-height) - var(--map-band-ticker-height))`, and append:

```css
/* Bottom band on the field page: tour bar above a slim ticker */
.map-root .map-band { background: var(--map-topbar-solid-bg); color: var(--map-topbar-solid-text); }
.map-root .map-tour { display: flex; align-items: center; gap: 16px; height: var(--map-tour-height); padding: 0 var(--map-gutter); }
.map-root .map-tour-prev {
  width: 40px; height: 40px; border: 1.5px solid currentColor; border-radius: 50%; background: transparent; color: inherit; font-size: 18px; cursor: pointer;
}
.map-root .map-tour-prev:disabled { opacity: 0.35; cursor: default; }
.map-root .map-tour-steps { flex: 1; display: flex; gap: 8px; margin: 0; padding: 0; list-style: none; }
.map-root .map-tour-pill {
  height: 36px; padding: 0 14px; border: 1.5px solid currentColor; border-radius: var(--map-radius-pill); background: transparent;
  color: inherit; font-family: var(--map-font-display); font-size: 16px; cursor: pointer;
}
.map-root .map-tour-pill.is-current { background: var(--map-btn-secondary-bg); color: var(--map-btn-secondary-text); border-color: var(--map-btn-secondary-bg); }
.map-root .map-ticker.map-ticker-field { position: relative; left: auto; right: auto; bottom: auto; height: var(--map-band-ticker-height); }
.map-root .map-ticker.map-ticker-field.is-muted { visibility: hidden; }
```

In `brand.css` (`.map-root.map-w31` block) add `--map-tour-height: 60px;` and `--map-band-ticker-height: 44px;`, and **remove** the `--map-field-zoom: 1.2;` line.

- [ ] **Step 5: Field uses the calculated zoom** — in `brand.css` change the `.w31-field` rule to drop `transform: scale(var(--map-field-zoom));` (keep `transform-origin: 720px 470px;`). In `MemoryField.tsx` import `fieldZoom` from `./summary` and set `<div className="w31-field" style={{ transform: `scale(${fieldZoom})` }}>`.

- [ ] **Step 6: Check + commit** — `npx tsc --noEmit && npx eslint src/components/map && node --test 'src/components/map/**/*.test.mjs'`; then `git add src/components/map && git commit -m "feat(map): bottom band — tour bar + field ticker; field zoom calculated to clear the ring"`

---

### Task 7: MEANING / FORM drawers

**Files:**
- Modify: `src/components/map/reports/w31/MemoryField.tsx`, `src/components/map/reports/w31/ThemePanel.tsx`, `src/components/map/reports/w31/brand.css`

**Interfaces:**
- Consumes: `poleCopy` (Task 2), `rankPole`, `summary`, `PanelProps.onSelect`
- Produces: selection ids `pole:meaning` / `pole:form`

- [ ] **Step 1: Poles become buttons + side dimming** — in `MemoryField.tsx` replace the two `<div className="w31-pole …">` blocks with buttons:

```tsx
      <button type="button" className="w31-pole w31-pole-meaning" onClick={() => onSelect('pole:meaning')}>
        <span className="w31-pole-name">Meaning</span>
        <span className="w31-pole-pct">{summary.poles.meaning.label}</span>
      </button>
      <button type="button" className="w31-pole w31-pole-form" onClick={() => onSelect('pole:form')}>
        <span className="w31-pole-pct">{summary.poles.form.label}</span>
        <span className="w31-pole-name">Form</span>
      </button>
```

and change the dimming line to:

```tsx
        const selectedPole = selectedId?.startsWith('pole:') ? selectedId.slice(5) : null
        const dimmed = selectedPole ? t.pole !== selectedPole : selectedId !== null && selectedId !== t.id
```

- [ ] **Step 2: Pole drawer** — in `ThemePanel.tsx`, import `poleCopy` from `./content` and `rankPole`, `type Pole` from `./themeMath`, change the signature to `ThemePanel({ id, onClose, onSelect }: PanelProps)`, and add at the top of the function:

```tsx
  if (id.startsWith('pole:')) {
    const pole = id.slice(5) as Pole
    const info = poleCopy[pole]
    if (!info) return null
    return (
      <SidePanel onClose={onClose} closeLabel="Back">
        <p className="w31-panel-eyebrow w31-panel-pole">{info.name}</p>
        <div className="w31-panel-stat">
          <span className="w31-panel-pct">{summary.poles[pole].label}</span>
        </div>
        <h2 className="w31-panel-headline">{info.definition}</h2>
        <p className="w31-panel-copy">{info.copy}</p>
        <p className="w31-panel-eyebrow">{info.listLabel}</p>
        <ol className="w31-pole-list">
          {rankPole(summary, pole).map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => onSelect(t.id)}>
                <span className="w31-pole-swatch" style={{ background: t.color }} />
                <span className="w31-pole-list-name">{t.name}</span>
                <span className="w31-pole-list-pct">{t.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </SidePanel>
    )
  }
```

- [ ] **Step 3: Styles** — append to `brand.css`:

```css
/* MEANING / FORM are buttons that open the pole drawer */
.map-root.map-w31 .w31-pole { border: 0; background: none; padding: 0; color: inherit; cursor: pointer; }
.map-root.map-w31 .w31-pole:hover .w31-pole-name { text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 2px; }
.map-root.map-w31 .w31-pole-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.map-root.map-w31 .w31-pole-list button {
  width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: 0; background: color-mix(in srgb, var(--map-ink) 5%, transparent);
  color: inherit; font-family: var(--map-font-body); font-size: 16px; text-align: left; cursor: pointer;
}
.map-root.map-w31 .w31-pole-list button:hover { background: color-mix(in srgb, var(--map-ink) 10%, transparent); }
.map-root.map-w31 .w31-pole-swatch { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
.map-root.map-w31 .w31-pole-list-name { flex: 1; }
.map-root.map-w31 .w31-pole-list-pct { font-family: var(--map-font-display); font-size: 18px; }
```

- [ ] **Step 4: Check + commit** — `npx tsc --noEmit && npx eslint src/components/map && node --test 'src/components/map/**/*.test.mjs'`; `git add src/components/map && git commit -m "feat(map/w31): MEANING / FORM open a drawer with definition and ranked themes"`

---

### Task 8: Verification

**Files:** none (fix-ups only if a check fails, each with its own commit).

- [ ] **Step 1: Tests + types + lint + build** — `node --test 'src/components/map/**/*.test.mjs' && npx tsc --noEmit && npx eslint src/components/map && npm run build`. **Stop the dev server first** (the build wipes `.next`), restart it after.
- [ ] **Step 2: Scope check** — `git fetch -q origin && git diff --name-only origin/main...HEAD | grep -vE '^(docs/superpowers/|src/components/map/|public/map/w31/|src/components/ReportView.tsx|src/sanity/schemas/report.ts|src/sanity/types.ts)'` → no output.
- [ ] **Step 3: Browser checks** (headless Chrome, `?access=direct`, click See What Stuck):
  - All six pills visible, readable, none overlapping a blob or MEANING / FORM; read the computed zoom from `getComputedStyle(document.querySelector('.w31-field')).transform` and report it.
  - Each pill opens its pop-up; ×, Escape and a click outside close it; focus returns to the page.
  - ← / → buttons and arrow keys move between stops; on 01, arrow keys inside the slider move the slider only.
  - Slider: drag, Reveal → 69/100 and the guess show.
  - Tour: Start the tour → intro → Next ×6 → Takeaways → "Back to the field" closes. Tour pills jump directly; current pill highlighted; visited dot appears on ring pills.
  - Ticker hidden (space kept) while a pop-up is open; visible otherwise.
  - Theme drawer open → click a ring stop → drawer closes, pop-up opens.
  - MEANING / FORM open drawers; clicking a ranked theme opens that theme's drawer; the other side dims.
  - Repeat the layout check at 1440×760: field fits between top bar and band, nothing overlaps.
  - No console errors; other reports unchanged (spot-check one horizontal + one vertical report).
- [ ] **Step 4: Commit any fix-ups**, then push the branch (`git push`) only after Jordana has seen it.
