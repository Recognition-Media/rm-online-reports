# W31 Trend Report ("By Popular Demand") — new `field` template

**Date:** 2026-11-23
**Status:** Draft, awaiting review
**Branch:** `jordana/w31-trend-report`

## Context

The 2026 Webby Trend Report (working title **By Popular Demand**) asks what still gets remembered online and what makes work last. It draws on 278 Internet Memory Project answers, the Webby Judge survey, and expert interviews.

Unlike earlier reports, it is not a horizontal snap-scroll (Webby) or a vertical scroll (Anthem/Lovie). It is built around the **Memory Field**: an interactive hub where theme blobs are split into **Meaning (63%)** and **Form (37%)**, and the report sections sit around it as numbered stops in an outer ring.

Source material lives outside this repo in `~/webby-trend-report-31/` (design exports, data, interviews, drafts). The design is still a **prototype** and will keep changing; most copy is still TK.

## Decisions

- **Build inside `rm-online-reports` (formerly `webby-annual-report`; renamed by Steve 2026-11-23), not a new repo.** The report reuses the existing sign-up gate (Lambda → DynamoDB + Customer.io), Sanity Studio, analytics, and the native `reports.webbyawards.com/<slug>/` URL. This is a normal feature branch that merges to `main` through Steve's PR review, like the Lovie and Nordics work.
- **Add a third layout template, `field`**, next to `horizontal` and `vertical`. The `property` stays `webby`. `ReportView.tsx` routes `template === 'field'` to a new `src/components/field/ReportView.tsx`. The existing templates are not touched.
- **Reuse the existing sign-up gate by copying it, not editing it.** No new gate design. Copy `vertical/SignupGate.tsx` into `src/components/field/SignupGate.tsx` and restyle only the copy. The original file is not modified. Sign-ups go to the same Lambda → Customer.io endpoint, and the Lambda itself is unchanged.
- **Production stays on AWS Amplify** (Steve admins it). Nothing about production hosting changes.
- **Design previews on Vercel, limited to this branch.** A Vercel project in the Recognition Media team (`recog-media`) is connected to this repo and builds **only** `jordana/w31-trend-report`. It never gets a real domain and is for team review links only.
- **Content in a local file first, Sanity later.** While the design is moving, copy and data live in one typed content file (`src/components/field/content.ts`), kept separate from layout code. Once the design is stable, those fields move into the `report` schema so the team can edit TK copy in the Studio without a developer.

## Scope guardrail: W31 Trend Report only (hard rule)

This work must not change how any other template or report looks or behaves: Webby (horizontal), Anthem/Lovie/Nordics/Shared Influence (vertical), Telly, or any future report.

**New files (free to change):** anything under `src/components/field/`, `public/field/`, and this branch's docs.

**Existing shared files: only these, and only additive, inert edits:**

| File | Allowed change | Why it can't affect other reports |
|---|---|---|
| `src/components/ReportView.tsx` | One added `if (template === 'field')` branch | Only runs for a report whose template is `field`; the existing fallback logic is untouched |
| `src/sanity/schemas/report.ts` | Add `{ title: 'Field (W31 Trend Report)', value: 'field' }` to the template list; in Phase 3, add a "Memory Field" field group **hidden unless `template === 'field'`** | Existing documents keep their saved template; new fields are optional, empty, and invisible on other reports |
| `src/sanity/types.ts` / `src/sanity/queries.ts` | Phase 3 only: add the new optional fields to the type and the report query | Optional fields resolve to `null` for every other report |

**Not allowed:** editing any existing component (including both `SignupGate.tsx` files, `horizontal/`, `vertical/`, shared modules), global CSS, `next.config.ts`, `amplify.yml`, the sign-up Lambda, `infra/`, or existing Sanity documents. If something shared seems to need a change, copy it into `src/components/field/` instead. If that isn't possible, stop and ask first.

**Check before every PR:** `git diff --stat origin/main...HEAD` must list only the files above plus `field/` paths. Any other file in that list is a scope bug.

## Experience (from the 11.23 design exports)

1. **Landing:** colorwash background, "The 2026 Webby Trend Report" pill, "By Popular Demand" headline in the pixel display face with a hand-drawn ellipse, subtitle "On an Internet built to capture attention, what makes work actually last?", top-right buttons (About the report · Methodology · Enter the 31st Webbys).
2. **"What stuck?" bar:** a fixed bottom bar with the prompt "What stuck with you on the Internet this year?", a text field, a "Drop it in" button, and a scrolling ticker of remembered things (color dot = theme).
3. **Sign-up gate:** the existing gate, opened from the landing page, unlocks the report.
4. **Memory Field hub:** cream ground, grey dots ("the feed"), colored theme blobs sized by share, Meaning | Form split by a dashed center line. Header shows "By Popular Demand · The 2026 Webby Trend Report", a "Kept n/25" progress counter, and an Index button.
5. **Outer ring stops 01–05** (The Attention Trap, When Metrics Stop Meaning, Optimization-Maxxing, What's the Signal?, Listening vs. Optimizing): each opens a two-panel modal with copy, a quote, a video module, and a data module (e.g. the Q10 "drag to guess" slider, 69/100).
6. **Theme open:** clicking a blob opens a right-hand panel with the percentage, headline (e.g. "Delight: Small joys stick."), copy, "In their words" quotes, and a case-study slot.
7. **06 Meaning / 07 Form:** half-field tour stops with a ranked theme list and a pull quote.
8. **Takeaways.**
9. **Bottom nav:** back arrow, numbered pills (01–05, 06 Meaning, 07 Form, Takeaways), and "Start the tour →" / "Next →".

## Architecture

```
src/app/[slug]/page.tsx            (unchanged)
  └─ components/ReportView.tsx     (+1 branch: template === 'field')
       └─ components/field/
            ReportView.tsx         page shell: landing → gate → field
            Landing.tsx
            WhatStuckBar.tsx       prompt + input + ticker
            MemoryField.tsx        blobs, dots, Meaning/Form split
            RingStopModal.tsx      outer-ring stops 01–05
            ThemePanel.tsx         right-hand theme detail
            HalfFieldPanel.tsx     06 Meaning / 07 Form
            Takeaways.tsx
            TourNav.tsx            bottom pills + Next
            modules/               SliderReveal (Q10), etc.
            content.ts             all copy + data (later → Sanity)
            field.css              template-scoped styles
```

Each component gets its props from `content.ts` (later from the Sanity `report` document) and holds no copy itself. Styles are scoped to the `field` template so nothing leaks into other reports. Fonts and brand images go in `public/field/`.

## Preview hosting (Vercel, this branch only)

- A new Vercel project in the `recog-media` team, connected to `Recognition-Media/rm-online-reports`.
- **Ignored Build Step** set so only `jordana/w31-trend-report` builds and every other branch (including `main` and `preview`) is skipped.
- **Build machine: standard.** Push in batches rather than after every small edit.
- Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` (same values as Amplify). `NEXT_PUBLIC_SIGNUP_API_URL` is **left unset**, so the gate opens and closes normally but no test sign-up reaches DynamoDB or Customer.io. (The Lambda's CORS allow-list would also block `*.vercel.app`.)
- No custom domain on this project.
- **Dependency:** the Vercel GitHub app must have access to this repo. If it is not already installed for it, a Recognition-Media GitHub org owner has to grant access.

## Phases

1. **Prototype locally:** add the `field` template option, the router branch, the component shell, and `content.ts`; build the Landing, What-stuck bar, and Memory Field first. Preview with `npm run dev` against a draft `report` document (drafts render in dev).
2. **Review links:** set up the Vercel branch-only project and share links with the team.
3. **CMS:** once the design is stable, move `content.ts` fields into the `report` schema (a "Memory Field" group, hidden unless `template === 'field'`) and enter the copy in the Studio.
4. **Launch:** open a PR to `main` → Steve reviews → merge → Amplify deploys → set the report `status` to `live` at `reports.webbyawards.com/<slug>/`.

## Studio publishing rules

As of 2026-11-23, publishing any document in the Studio ("RM Online Reports") automatically rebuilds the live sites (about 5 minutes).

- Keep the W31 `report` document's **status on `draft`** until launch. Production builds skip non-live reports, so a draft never appears publicly.
- **Do not set it to `live` until this branch is merged to `main`.** Before the merge, the live build doesn't know the `field` template.
- **Batch Studio edits and publish once** per round of changes; every publish triggers a rebuild of all brands' sites.

## Out of scope for this spec

- **Storing "Drop it in" submissions.** In the prototype the input shows its UI only, with nothing saved. Where submissions are stored gets its own spec once the design settles. Because the sign-up Lambda is shared by every report, that spec must either use a separate endpoint or get Steve's sign-off before touching the Lambda.
- Redesigning the sign-up gate.
- Moving production off Amplify.

## Conventions

- Section subheaders and subtitles are **never italic**.
- Mobile layout is required before launch. The field needs a phone pattern (likely a list/stack fallback); that is decided during Phase 1 design work.

## Verification

- `git diff --stat origin/main...HEAD` shows only allowlisted files (see Scope guardrail).
- `npm run lint` and `npm run build` (static export) pass.
- Existing reports (Webby, Anthem, Lovie, Telly) still build and render unchanged; spot-check one horizontal and one vertical report locally.
- The field report renders from a draft document in dev, and from a `live` document on the Vercel preview.
