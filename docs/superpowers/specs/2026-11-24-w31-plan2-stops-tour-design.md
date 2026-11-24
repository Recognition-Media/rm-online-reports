# W31 Plan 2: ring stops, tour bar, field ticker, Takeaways, Meaning/Form drawers

**Date:** 2026-11-24
**Status:** Draft, awaiting review
**Branch:** `jordana/w31-trend-report`
**Builds on:** `2026-11-23-w31-trend-report-design.md` (scope guardrail, design system, file layout all still apply)

## Goal

Turn the Memory Field into the full report: six stops around the field carry the report's main content, a tour bar walks readers through them in order, the "What stuck" ticker runs along the bottom of the field page, and MEANING / FORM explain themselves. Most copy is still TK and will change, so every word lives in the content file.

## Decisions (agreed with Jordana)

- **Six stops on the ring**, in clockwise order matching their numbers:
  - **01** The Attention Trap: left, upper
  - **02** When Metrics Lose Meaning: top, center
  - **03** Optimization-Maxxing: right, upper
  - **04** What Are the Signals?: right, lower
  - **05** Listening vs. Experimenting: bottom, center
  - **06** Takeaways: left, lower
- **Stops open a large center pop-up** (like the 11.23 mockup), not the side drawer: the stops are the main content and get the most space. Theme blobs and MEANING / FORM keep the right-hand drawer.
- **Tour bar at the bottom**, stacked directly above the ticker, forming one black band (bookends the black top bar).
- **Tour order:** intro card ("How to read the field") → 01 → 02 → 03 → 04 → 05 → 06 Takeaways.
- **Meaning / Form explanations live on the MEANING and FORM labels** (clickable → drawer), not in the tour.
- **Takeaways has no "What stuck with you / Add your memory / Share my field"** section.
- **No "Kept n/25" counter** anywhere (carried over).
- **Q10 value: 69/100** for now (outline); the mockup's "Median 71.5" is unconfirmed. One value in the content file.

## 1 · Ring stops

- Each stop is a **solid pill**: number + title, Aktiv Grotesk, beige pill / black text, readable over the background art and color washes.
- **Current** stop (the one open, or the tour's position): filled black pill, beige text.
- **Visited** stops: a small check or dot beside the number (session only; nothing saved).
- Positions are on the same 1440×900 canvas as the field, so they scale with it. They sit outside the blob area and never cover a blob or the MEANING / FORM labels.
- Keyboard: each pill is a button; Tab reaches them in number order.

## 2 · Stop pop-up (center)

- A beige card, about 85% of the viewport, over a dimmed field. Square corners and a black 1.5px border, matching the system.
- **Left panel:** eyebrow "Outer ring · 0N" → title (Terminal Grotesque) → copy (Aktiv) → one **voice block**: either a **quote** (text + name + title) or a **video** (thumbnail, speaker, length, plays the hosted video when a URL is set; shows a "Video coming soon" placeholder otherwise).
- **Right panel:** the stop's **data module** (section 3).
- Controls: × button, Escape, and a click on the dimmed background close it; **← / →** buttons on the card (and arrow keys) move to the previous / next stop.
- Focus moves into the card on open and back to the stop pill on close; the field behind is inert while open.
- Stop 06 (Takeaways) uses the same card with the Takeaways layout across both panels.

## 3 · Data modules (reusable components)

| Module | Used by | Behavior |
|---|---|---|
| **SliderReveal** | 01 (Q10) | Reader drags a 0–100 slider ("Easier" ↔ "Much harder") and presses Reveal; the real value (69/100) and supporting lines (79% at 50+, 54% at 70+) appear, with the reader's guess marked. Keyboard-operable. |
| **SplitStat** | 02 (Q3) | Big headline % (57%) + label, then a stacked bar / list of the parts: 34% stopped but still report it · 23% stopped and changed how I work · 29% still read it as evidence · 14% I never did. |
| **RankedBars** | 03 (Q8), 04 (Q4) | Horizontal bars sorted by value with labels and %. 03: AI for AI's sake 27 · Formulaic voice, look or format 23 · Influencer + celebrity formulas 17 · Trend-chasing 16. 04: It was put in front of people 69 · People chose to watch it 36 · People stayed with it 26 · People got something out of it 12 · People will remember it 9. |
| **VoiceAndCase** | 05 | Video (James Gerde) + quote + a case-study slot ("Vaseline Verified … [TK]"). |
| **Takeaways** | 06 | Title "How to build memory in an attention economy" + four numbered takeaways (headline + one line), from the mockup: Stop treating reach as memory · Listen for meaning, not formats · Lead with a feeling · Give it a shape people can hold. |

- All numbers are **typed values in the content file** (these are survey results, not computed from `themes.ts`). Each module validates its inputs: percentages 0–100; the module shows nothing rather than a broken chart if a value is missing.
- Bars and stats use the design system: Terminal Grotesque for numbers, Aktiv for labels, palette colors only as data accents.

## 4 · Tour bar and field ticker (bottom band)

- One fixed black band at the bottom of the field page: **tour bar** (about 60px) above a **slim ticker** (about 44px).
- **Tour bar:** ← (previous) · pills **01 02 03 04 05 06 Takeaways** (current one highlighted) · primary button **Start the tour →**, which becomes **Next →** once the tour has started, and **Back to the field** at the end.
- **Start the tour** opens the **intro card** first: "How to read the field" (the reader note from `project_w31_field_legend`): warm = Meaning, cool = Form, color = family, size = share. Then Next → 01.
- Clicking any pill opens that stop directly (no need to start the tour).
- **Ticker:** same content and style as the landing ticker (black label "What Stuck on the Internet This Year?", beige scrolling strip). **Hidden while a stop pop-up is open**, to give the card room.
- The field area shrinks to fit between the top bar and the bottom band; the canvas already rescales.

## 5 · MEANING / FORM drawers

- MEANING and FORM become buttons (cursor + subtle underline on hover).
- They open the existing right-hand drawer with: eyebrow (MEANING / FORM) → big % (calculated, 64% / 36%) → definition (from the data file's `poles`) → [Copy TK] → **themes on that side ranked by share**, each a button that opens that theme's drawer → optional pull quote.

## 6 · Content and rules

- New content in `reports/w31/content.ts`: `stops[]` (id, number, title, position, copy, voice, module + its data), `intro`, `takeaways`, `poles` (definition, copy, quote). Types in `map/types.ts` so a future map report can reuse the structure.
- `[Copy TK]` placeholders stay visible on the page.
- Design system unchanged: Terminal Grotesque + Aktiv only; black / beige buttons; palette colors for data only (plus the sign-up accent).
- **Scope guardrail unchanged:** all new code under `src/components/map/`; no edits to shared files beyond what's already allowed.

## Out of scope

- Phone layout (needs its own design for ring + pop-up).
- Saving "What stuck?" answers; Methodology section; blob positions (Jordana will address).
- Real video hosting (the module accepts a URL when ready).

## Verification

- Tests: module input validation (percent ranges, missing data), stop order / next-previous wrap behavior, Meaning/Form ranked lists match `themes.ts`.
- Browser checks: every stop opens and closes (×, Escape, outside click); ← / → and arrow keys move between stops; tour runs intro → 01 … 06; ticker hides with a pop-up open; focus returns to the pill on close; stop pills never overlap blobs or MEANING / FORM at the current layout; no console errors.
- `tsc`, `eslint` on map files, `npm run build`, and the scope check (`git diff --name-only origin/main...HEAD` lists only allowed paths).
