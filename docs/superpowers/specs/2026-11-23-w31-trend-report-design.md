# W31 Trend Report ("By Popular Demand") — new Interactive Map (`map`) template

**Date:** 2026-11-23
**Status:** Draft, awaiting review
**Branch:** `jordana/w31-trend-report`

## Context

The 2026 Webby Trend Report (working title **By Popular Demand**) asks what still gets remembered online and what makes work last. It draws on 278 Internet Memory Project answers, the Webby Judge survey, and expert interviews.

Unlike earlier reports, it is not a horizontal snap-scroll (Webby) or a vertical scroll (Anthem/Lovie). It is built around an interactive map: a central visual (for W31, the **Memory Field**, where theme blobs are split into **Meaning** and **Form**), with the report sections sitting around it as numbered stops in an outer ring.

Source material lives outside this repo in `~/webby-trend-report-31/` (design exports, data, interviews, drafts). The design is still a **prototype**: brand colors, assets, fonts, type sizes, images and videos will all keep changing, and most copy is still TK.

## Decisions

- **Build inside `rm-online-reports` (formerly `webby-annual-report`; renamed by Steve 2026-11-23), not a new repo.** The report reuses the existing sign-up gate (Lambda → DynamoDB + Customer.io), Sanity Studio, analytics, and the native `reports.webbyawards.com/<slug>/` URL. This is a normal feature branch that merges to `main` through Steve's PR review, like the Lovie and Nordics work.
- **Add a third, reusable layout template: "Interactive Map" (`map`)**, next to `horizontal` and `vertical`. Like those two, the name describes the layout pattern, not this year's content, so future reports can use it with a different central visual. The `property` stays `webby`. `ReportView.tsx` routes `template === 'map'` to `src/components/map/ReportView.tsx`. The existing templates are not touched.
- **Reusable template vs. this year's report are kept separate.** `src/components/map/` holds the reusable structure; everything specific to W31 (the Memory Field visual, the themes data, copy, brand styling) lives in `src/components/map/reports/w31/`. See Architecture.
- **Reuse the existing sign-up gate by copying it, not editing it.** No new gate design. Copy `vertical/SignupGate.tsx` into `src/components/map/SignupGate.tsx` and restyle only the copy. The original file is not modified. Sign-ups go to the same Lambda → Customer.io endpoint, and the Lambda itself is unchanged.
- **Production stays on AWS Amplify** (Steve admins it). Nothing about production hosting changes.
- **Design previews on Vercel, limited to this branch.** A Vercel project in the Recognition Media team (`recog-media`) is connected to this repo and builds **only** `jordana/w31-trend-report`. It never gets a real domain and is for team review links only.
- **Content and data in local files first, Sanity later.** While the design is moving, copy and data live in typed files inside `reports/w31/`, kept separate from layout code. Once the design is stable, they move into the `report` schema so the team can edit them in the Studio without a developer.

## Scope guardrail: W31 Trend Report only (hard rule)

This work must not change how any other template or report looks or behaves: Webby (horizontal), Anthem/Lovie/Nordics/Shared Influence (vertical), Telly, or any future report.

**New files (free to change):** anything under `src/components/map/`, `public/map/`, and this branch's docs.

**Existing shared files: only these, and only additive, inert edits:**

| File | Allowed change | Why it can't affect other reports |
|---|---|---|
| `src/components/ReportView.tsx` | One added `if (template === 'map')` branch | Only runs for a report whose template is `map`; the existing fallback logic is untouched |
| `src/sanity/schemas/report.ts` | Add `{ title: 'Interactive Map', value: 'map' }` to the template list; in Phase 3, add an "Interactive Map" field group **hidden unless `template === 'map'`** | Existing documents keep their saved template; new fields are optional, empty, and invisible on other reports |
| `src/sanity/types.ts` / `src/sanity/queries.ts` | Phase 3 only: add the new optional fields to the type and the report query | Optional fields resolve to `null` for every other report |

**Not allowed:** editing any existing component (including both `SignupGate.tsx` files, `horizontal/`, `vertical/`, shared modules), global CSS, `next.config.ts`, `amplify.yml`, the sign-up Lambda, `infra/`, or existing Sanity documents. If something shared seems to need a change, copy it into `src/components/map/` instead. If that isn't possible, stop and ask first.

**Check before every PR:** `git diff --stat origin/main...HEAD` must list only the files above plus `map/` paths. Any other file in that list is a scope bug.

## Experience (from the 11.23 design exports)

1. **Landing:** colorwash background, "The 2026 Webby Trend Report" pill, "By Popular Demand" headline in the pixel display face with a hand-drawn ellipse, subtitle "On an Internet built to capture attention, what makes work actually last?", top-right buttons (About the report · Methodology · Enter the 31st Webbys).
2. **"What stuck?" bar:** a fixed bottom bar with the prompt "What stuck with you on the Internet this year?", a text field, a "Drop it in" button, and a scrolling ticker of remembered things (color dot = theme).
3. **Sign-up gate:** the existing gate, opened from the landing page, unlocks the report.
4. **Memory Field (the center visual):** cream ground, grey dots ("the feed"), colored theme blobs sized by share, Meaning | Form split by a dashed center line, each side labelled with its total share. Header shows "By Popular Demand · The 2026 Webby Trend Report" and an Index button. **No "Kept n/25" counter.**
5. **Outer ring stops 01–05** (The Attention Trap, When Metrics Stop Meaning, Optimization-Maxxing, What's the Signal?, Listening vs. Optimizing): each opens a two-panel modal with copy, a quote, a video module, and a data module (e.g. the Q10 "drag to guess" slider, 69/100).
6. **Theme open:** clicking a blob opens a right-hand panel with the percentage, headline (e.g. "Delight: Small joys stick."), copy, "In their words" quotes, and a case-study slot.
7. **06 Meaning / 07 Form:** half-field tour stops with a ranked theme list and a pull quote.
8. **Takeaways.**
9. **Bottom nav:** back arrow, numbered pills (01–05, 06 Meaning, 07 Form, Takeaways), and "Start the tour →" / "Next →".

## Architecture

```
src/app/[slug]/page.tsx              (unchanged)
  └─ components/ReportView.tsx       (+1 branch: template === 'map')
       └─ components/map/            REUSABLE "Interactive Map" template
            ReportView.tsx           page shell: landing → gate → map
            Landing.tsx
            PromptBar.tsx            bottom prompt + input + ticker
            SignupGate.tsx           copy of vertical/SignupGate.tsx, restyled
            MapStage.tsx             holds the report's center visual + ring of stops
            StopModal.tsx            outer-ring stop (two-panel)
            SidePanel.tsx            right-hand detail panel
            TourNav.tsx              bottom pills + Start the tour / Next
            Takeaways.tsx
            modules/                 Quote, Video, SliderReveal (Q10), ...
            reports/
              index.ts               which report-specific pieces each map report uses
              w31/                   EVERYTHING SPECIFIC TO THE W31 REPORT
                MemoryField.tsx      the blobs / dots / Meaning-Form visual
                themes.ts            the themes data (see below)
                content.ts           all copy: landing, stops, takeaways, quotes
                brand.css            colors, fonts, type sizes, spacing (see below)
public/map/w31/                      fonts, images, colorwash backgrounds
```

Components hold no copy and no hard-coded colors or sizes: copy comes from `content.ts`, data from `themes.ts`, and styling from `brand.css`. Styles are scoped to the `map` template so nothing leaks into other reports.

### Themes data: easy to update

The Meaning/Form theme data is the center of the report and must be updateable without touching layout code. All of it lives in **one file, `reports/w31/themes.ts`**:

- **Total answers** (currently 278).
- **One entry per theme:** name, side (`meaning` or `form`), **count** (how many answers were coded to it), color, headline, copy, and its "In their words" quotes.
- **Optional position** on the field, so the designer can place a blob by hand. Without one, the blob is placed automatically.

Everything else is **calculated, never typed in**: each theme's percentage, blob size, the Meaning and Form totals (today 63% / 37%), the ranked lists on 06/07, and "<1%" labels. When the data changes, you update the counts in that one file and every number on the site updates with it. In Phase 3 this file becomes Studio fields, so the team can change the numbers there.

### Brand styling: easy to change

Because colors, fonts, type sizes, images and videos will all change during the prototype:

- **`reports/w31/brand.css`** holds every design value as a named setting (CSS variables): the brand palette, font families, the type scale (headline/body/label sizes), spacing, and corner radii. Changing a color or a font size is a one-line edit there that applies everywhere.
- **Fonts and images** live in `public/map/w31/` and are swapped by replacing the file or changing its path in one place.
- **Videos** are hosted on Vimeo/YouTube (as the other reports do) and referenced by link in `content.ts`, not stored in the repo.

## Preview hosting (Vercel, this branch only)

- A new Vercel project in the `recog-media` team, connected to `Recognition-Media/rm-online-reports`.
- **Ignored Build Step** set so only `jordana/w31-trend-report` builds and every other branch (including `main` and `preview`) is skipped.
- **Build machine: standard.** Push in batches rather than after every small edit.
- Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` (same values as Amplify). `NEXT_PUBLIC_SIGNUP_API_URL` is **left unset**, so the gate opens and closes normally but no test sign-up reaches DynamoDB or Customer.io. (The Lambda's CORS allow-list would also block `*.vercel.app`.)
- No custom domain on this project.
- **Dependency:** the Vercel GitHub app must have access to this repo. If it is not already installed for it, a Recognition-Media GitHub org owner has to grant access.

## Phases

1. **Prototype locally:** add the `map` template option, the router branch, the template shell, and the `reports/w31/` files; build the Landing, prompt bar, and Memory Field first. Preview with `npm run dev` against a draft `report` document (drafts render in dev). Design changes (colors, fonts, sizes, assets) are made in `brand.css`, `public/map/w31/`, and the content/data files.
2. **Review links:** set up the Vercel branch-only project and share links with the team.
3. **CMS:** once the design is stable, move `content.ts` and `themes.ts` into the `report` schema (an "Interactive Map" group, hidden unless `template === 'map'`) and enter the copy and data in the Studio.
4. **Launch:** open a PR to `main` → Steve reviews → merge → Amplify deploys → set the report `status` to `live` at `reports.webbyawards.com/<slug>/`.

## Studio publishing rules

As of 2026-11-23, publishing any document in the Studio ("RM Online Reports") automatically rebuilds the live sites (about 5 minutes).

- Keep the W31 `report` document's **status on `draft`** until launch. Production builds skip non-live reports, so a draft never appears publicly.
- **Do not set it to `live` until this branch is merged to `main`.** Before the merge, the live build doesn't know the `map` template.
- **Batch Studio edits and publish once** per round of changes; every publish triggers a rebuild of all brands' sites.

## Out of scope for this spec

- **Storing "Drop it in" submissions.** In the prototype the input shows its UI only, with nothing saved. Where submissions are stored gets its own spec once the design settles. Because the sign-up Lambda is shared by every report, that spec must either use a separate endpoint or get Steve's sign-off before touching the Lambda.
- Redesigning the sign-up gate.
- Moving production off Amplify.
- A second map report. The template is structured to allow one, but only W31 is built now.

## Conventions

- Section subheaders and subtitles are **never italic**.
- Mobile layout is required before launch. The map needs a phone pattern (likely a list/stack fallback); that is decided during Phase 1 design work.

## Verification

- `git diff --stat origin/main...HEAD` shows only allowlisted files (see Scope guardrail).
- `npm run lint` and `npm run build` (static export) pass.
- Existing reports (Webby, Anthem, Lovie, Telly) still build and render unchanged; spot-check one horizontal and one vertical report locally.
- Changing one theme's count in `themes.ts` updates its percentage, blob size, the Meaning/Form totals and the 06/07 lists.
- The W31 report renders from a draft document in dev, and from a `live` document on the Vercel preview.
