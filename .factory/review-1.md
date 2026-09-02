# Adversarial first-read review 1 — Focus Study Sprint

**Reviewed:** 2026-09-02 UTC  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Revision reviewed:** `9f455dcffb5c66f15f13ebfc8e07f11d184a788d`  
**Verdict: FAIL** — no blocking defect was found in the core study or demo flow, but seven medium/low findings remain. The requested standard is zero findings.

## First 30 seconds

Fresh 390×844 and 1440×1000 browser contexts opened `/` before interaction. The first screen says, in plain terms, that this runs a short recall-practice session for students and self-learners, and the first action is **Try it with sample data**. Its adjacent result text is **“Opens a five-prompt practice session.”** The primary action is visible at 421px on mobile, within the first viewport. This is sufficient to identify the job, audience, and first click.

The first screen has one `h1`, a `main`, `lang="en"`, an adequate title, description, canonical, social image, favicon, and no horizontal overflow at either tested width. The topographic field-notebook treatment is distinct and follows `.factory/design.md`; it is not a generic SaaS layout.

## Findings

### Medium

#### F-1-1 — Navigation and footer are not consistent across routes

**Location / exact evidence:** The app header on `/` is **“Start / Library / About / Demo”**. `/privacy/`, `/terms/`, and the 404 header are **“Start / Demo / Privacy”**. The app header has no Privacy link, while the legal routes omit Library and About. The app footer alone adds **“Original artwork generated for this product.”**

**Why this matters:** A visitor changes navigational context when opening policy pages, contrary to the required consistent header/footer. Privacy is less discoverable from the main product than the site structure requires.

**Concrete fix:** Use the same, maximum-four-link header on app, demo, legal, and 404 pages, for example **Start / Library / Demo / Privacy**. Move About to a clearly labelled landing section or footer if it must remain a route. Use one footer string set on every route.

#### F-1-2 — The sitemap omits public product routes

**Location / exact evidence:** Live `sitemap.xml` lists `/`, `/demo`, `/privacy/`, and `/terms/`; it omits working, linked public routes `/library` and `/about`.

**Why this matters:** The site declares real URLs for Library and About, yet search/crawl metadata does not list every public route as required.

**Concrete fix:** Add `<loc>https://focus-study-sprint.sociobot.in/library</loc>` and `<loc>https://focus-study-sprint.sociobot.in/about</loc>` to `public/sitemap.xml` (or remove either route if it should not be public).

### Low

#### F-1-3 — The headline contains unexplained learning jargon

**Location / exact quote:** Landing `h1`: **“Run a short active-recall study session.”**

**Why this matters:** “Active-recall” is a learning-method term rather than the action a distracted first-time visitor does. The visible prompt/answer loop explains it only after the visitor keeps reading.

**Concrete fix:** Rewrite the headline as **“Practice recalling answers in a short session.”** This keeps the job under nine words and removes the jargon.

#### F-1-4 — The timed activity has two competing names

**Location / exact quotes:** The product describes a **“study session”** in the headline, facts, and brief, but the setup action is **“Begin this sprint”** and the process heading is **“Finish one study sprint in three steps.”**

**Why this matters:** A visitor has to infer whether a “sprint” is a separate product mode or the same timed study session. The existing terminology table also names this concept “study session.”

**Concrete fix:** Use **“Start study session”** for the action and **“Complete a study session in three steps”** for the heading.

#### F-1-5 — The limits section heading does not name its section

**Location / exact quote:** Landing section heading **“Bring material you trust”** under the label **“CLEAR LIMITS.”**

**Why this matters:** Neither phrase says what the section is about when read out of context. The useful information is only in the following sentence: the app does not teach, check correctness, or promise learning results.

**Concrete fix:** Rename the label/heading to **“WHAT THIS APP DOES NOT DO”** and **“This app does not check answers”** (or equivalent scope wording).

#### F-1-6 — A public provenance promise has no claim entry or sandbox test

**Location / exact quote:** App footer: **“Original artwork generated for this product.”**

**Why this matters:** This is a visitor-facing factual claim but does not appear in `.factory/claims.json`, so the sandbox cannot establish it. The available provenance evidence belongs in `.factory/design.md`, not an untested product promise.

**Concrete fix:** Remove the footer sentence, or add a claim entry with an automated source/provenance test that asserts the declared generated asset and prompt-sidecar records.

#### F-1-7 — README exceeds the 22-word sentence cap in three places

**Location / exact quotes:**

- README opening sentence (23 words): **“A calm, installable active-recall utility for students and self-learners who want a short practice session without streaks, rewards, feeds, reminders, or generated content.”**
- Release-gate explanation (29 words): **“It includes the live Sociobot billing contract: the production catalog must contain this exact $12 product, its return URL, and a checkout that redirects to the hosted Sociobot/Dodo flow.”**
- Deployment explanation (24 words): **“The Param Factory registers the Sociobot product and checkout return URL separately, and the release gate above must pass before deployment is considered releasable.”**

**Why this matters:** These are hard-cap copy violations and the middle sentence uses implementation jargon before explaining the result.

**Concrete fix:** Use, respectively:

- **“A calm active-recall tool for students who want short practice without streaks, feeds, or generated lessons.”**
- **“The release gate checks the live billing contract. The catalog must list this $12 product and return URL. Checkout must redirect to Sociobot/Dodo.”**
- **“The Param Factory registers the product and checkout return URL separately. The release gate must pass before deployment.”**

## Copy audit

Hyphenated terms, paths, numbers, and button labels count as one word. Headings, control labels, URLs, code blocks, and sentence fragments are excluded from the sentence tables.

### Landing page sentences

| Words | Sentence |
| ---: | --- |
| 6 | Run a short active-recall study session. |
| 14 | For students and self-learners who want focused practice without streaks, feeds, or generated lessons. |
| 5 | Opens a five-prompt practice session. |
| 6 | Works offline after your first visit. |
| 6 | Study data stays in this browser. |
| 7 | Core study and JSON backup are free. |
| 12 | One prompt and answer per line, separated by `::` or a tab. |
| 3 | Use 5–30 pairs. |
| 3 | Nothing is uploaded. |
| 10 | Keyboard ready: press Tab to move, then Enter to begin. |
| 3 | Paste 5–30 pairs. |
| 8 | Put one prompt and answer on each line. |
| 3 | Recall each answer. |
| 8 | Reveal it, then choose Recalled or Keep practicing. |
| 3 | Review your recap. |
| 8 | Export a JSON backup whenever you want one. |
| 9 | Prompts, responses, ratings, and recaps remain in this browser. |
| 6 | The app sends no behavioral analytics. |
| 12 | The app does not teach content, check correctness, or promise learning results. |
| 11 | Contour adds saved prompt sets and your latest 20 session records. |
| 7 | Study sessions and JSON backup remain free. |
| 7 | Short active-recall sessions for students and self-learners. |
| 6 | Original artwork generated for this product. |

No landing sentence exceeds 22 words. F-1-3 through F-1-6 record the jargon, terminology, heading, and claim flags. Result-naming button check passes except for the terminology problem in **Begin this sprint**.

### README sentences

| Words | Sentence |
| ---: | --- |
| 23 | A calm, installable active-recall utility for students and self-learners who want a short practice session without streaks, rewards, feeds, reminders, or generated content. |
| 14 | Paste 5–30 `prompt :: answer` pairs, choose 5/10/20 minutes, and finish one focused session. |
| 8 | Recaps and reusable sets stay in the browser. |
| 11 | Five to 30 prompt pairs, 5/10/20-minute sessions, pause, and time/completion endings. |
| 15 | Keyboard recall (`Enter` to reveal and `1` / `2` to self-rate) with a private recap. |
| 8 | Local session history plus JSON backup and restore. |
| 12 | An installable app shell that works offline after the first online visit. |
| 13 | System, light, and dark themes with reduced motion and a tested 390px layout. |
| 13 | Optional $12 one-time Contour license: reusable saved prompt sets and extended on-device history. |
| 9 | Checkout and verification use only the Sociobot billing API. |
| 5 | Plain-language `/privacy/` and `/terms/` pages. |
| 9 | The **Try it with sample data** action opens `/demo`. |
| 6 | Demo data uses `demo:` storage only. |
| 14 | Resetting or leaving the demo clears that sample workspace without changing real study data. |
| 16 | The app supports practice organization; it does not teach content, verify correctness, or claim learning outcomes. |
| 5 | Requires Node.js 20+ and npm. |
| 5 | Open the printed local URL. |
| 11 | No environment variables or backend are required for the free experience. |
| 12 | The production billing endpoint is intentionally public and contains no product secret. |
| 6 | The exact production build command is: |
| 14 | It type-checks and writes the static deployment to `dist/`, with `dist/index.html` at the root. |
| 10 | Run all unit, mobile browser, accessibility, persistence, and offline tests: |
| 8 | Preview the built result with `npm run preview`. |
| 14 | The Playwright suite starts its own preview server when one is not already running. |
| 9 | Before a production release, run the complete release gate: |
| 29 | It includes the live Sociobot billing contract: the production catalog must contain this exact $12 product, its return URL, and a checkout that redirects to the hosted Sociobot/Dodo flow. |
| 15 | This check intentionally fails when factory billing registration is missing; it never starts a payment. |
| 16 | Prompts, responses, recaps, saved sets, display preference, and any license token are local to the browser. |
| 6 | No analytics or advertising scripts ship. |
| 8 | License verification contacts only the Sociobot billing API. |
| 15 | Clearing site data can remove records; use Library → Export JSON for a portable backup. |
| 13 | Deploy the contents of `dist/` as a static site with clean-directory URLs enabled. |
| 10 | Do not configure infrastructure, DNS, or billing from this repository. |
| 24 | The Param Factory registers the Sociobot product and checkout return URL separately, and the release gate above must pass before deployment is considered releasable. |

F-1-7 records the three cap violations. The README also repeats the undefined term “active-recall”; use the F-1-3 rewrite there for consistent plain wording.

## Demo, claims, and sandbox behaviour

One click on **Try it with sample data** opened `/demo` directly into a realistic, five-prompt biology/geography/web/cell-biology/history recall session. The first demo screen showed prompt 1 of 5, a 05:00 timer, response field, and reveal action. The persistent banner was present: **“Demo — sample data, nothing is saved”**, with **Reset demo** and **Start for real**.

I set a normal-storage sentinel, entered demo, revealed/rated one sample prompt, reset, and left demo. The sentinel remained unchanged throughout; reset returned to prompt 1; Start for real returned to `/` and removed demo keys. Demo keys used `demo:fss:*`; normal data used non-demo keys. The live request log for landing and the full demo flow contained only `https://focus-study-sprint.sociobot.in`; no analytics, content, or third-party origin was contacted.

All 11 `.factory/claims.json` commands were run using their listed `npm run test:e2e -- --grep "@claim:<id>"` command in this clean workspace. All passed. The tags cover demo isolation, input limits, keyboard study flow, offline reload, local privacy, JSON backup, responsive controls, display preferences, Contour price/unlock behaviour, timing, and installable shell. `npm test` then passed 18 Vitest tests and 23 Playwright tests; `npm run build` passed and produced `dist/`; `npm run test:live-contract` passed the catalog and hosted checkout redirect check.

## Routes, structure, and accessibility checks

- `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/` returned 200 with route-specific titles, one `h1`, and `main`. `/not-a-route` returned a designed 404 with a return path.
- Every discovered normal internal landing/legal link returned 2xx. The 404 page’s own `#main` skip link naturally resolves to its intentional 404 URL when fetched as a separate request; it works as an in-page anchor and is not treated as a dead destination.
- Browser history, route-title updates, focus transfer to the new `h1`, visible focus, keyboard completion, reduced motion, 390px layout, and the offline reload are covered by the passing browser suite.
- The live root uses same-origin assets only and sends a restrictive CSP, `frame-ancestors 'none'` as a response directive, `nosniff`, referrer policy, and permissions policy. A fresh cold load recorded no console or page errors.

## Earlier review/history check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The existing handoff and verification records were read. Their earlier defects were confirmed fixed in current code and live checks: unavailable checkout (live contract now passes), undersized controls (the responsive claim passes), cache/header/MIME omissions (current live responses carry CSP and manifest support), malformed nested import persistence (regression test passes), and missing public-claim coverage (all 11 registered claim tests pass). No earlier finding is re-opened by this review.

## What would make this perfect

Apply F-1-1 through F-1-7, then rerun the cold mobile/desktop check, all eleven claim commands, the sitemap crawl, and the full test/build gate. The core flow, isolated demo, offline behaviour, local-first privacy, original visual direction, and billing handoff otherwise provide a strong base.
