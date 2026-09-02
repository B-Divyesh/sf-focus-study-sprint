# Adversarial first-read review 4 — Focus Study Sprint

**Reviewed:** 2026-09-02 UTC

**Live URL:** <https://focus-study-sprint.sociobot.in>

**Repository revision:** `e2c397097f9f5396ae987b418c51a92a1aa999dd`
**Verdict: FAIL.** No blocking defect was reproduced, and all listed claim commands
exit successfully. Eight medium/low findings remain. In particular, two published
claims are broader than their tagged tests. The required verdict is therefore FAIL.

## First 30 seconds

I opened `/` cold in separate fresh 390×844 and 1440×900 browser contexts. I did
not scroll before recording these answers.

- **What it does:** it lets me practice recalling answers in a short session.
- **For whom:** students and self-learners who want focused practice without
  streaks, feeds, or generated lessons.
- **What to click first:** **Try it with sample data**. The adjacent sentence says
  **“Opens a five-prompt practice session.”**

All three answers are visible in both first screens. On mobile, the action ends at
518 px and all three short product facts end at 685 px. The page has no horizontal
overflow, console error, or page error. This gate passes.

## Findings

### Medium

#### F-4-1 — The input-limits claim test does not prove its stated boundaries

**Location / exact quote:** `.factory/claims.json`, `input-limits`: **“A study
session accepts 5–30 prompt pairs and offers 5, 10, or 20 minutes.”** The tagged
test in `tests/app.spec.ts` verifies that five pairs enable the start button, 31
pairs disable it, and three radio inputs exist. It never verifies that exactly 30
pairs start a 30-prompt session, and it never asserts that the radio values are
exactly 5, 10, and 20.

**Why this matters:** The command passes even if the advertised upper boundary is
rejected or the three duration choices contain the wrong values. This leaves part
of a listed claim untested, contrary to the claims contract.

**Concrete fix:** In `@claim:input-limits`, fill exactly 30 valid pairs, select each
duration and assert values `[5, 10, 20]`, start the session, and verify **PROMPT 1 OF
30**. Keep the existing four-pair and 31-pair rejection checks.

#### F-4-2 — The display-preferences claim test checks dark contrast but not light contrast

**Location / exact quote:** `.factory/claims.json`, `display-preferences`:
**“Light and dark themes keep serious contrast checks clear and reduced-motion
removes visible movement.”** In its only tagged test, the page starts in system
mode, is clicked to explicit dark mode, and is then scanned ten times. No Axe scan
runs before that first switch or after selecting explicit light mode.

**Why this matters:** The exact claim command can pass if a later change breaks the
light theme while leaving dark mode intact. This leaves half of the stated contrast
claim untested.

**Concrete fix:** In `@claim:display-preferences`, select explicit light mode and
run the serious/critical Axe assertion, then select dark mode and repeat it. Keep
the current reduced-motion duration assertion.

#### F-4-3 — README says a license token is local even though verification sends it

**Location / exact quote:** README, Data and privacy: **“Prompts, responses,
recaps, saved sets, display preference, and any license token are local to the
browser.”** `src/license.ts` sends the token to
`https://api.sociobot.in/.../verify?license=...` when verification runs; the
`billing-destination` test confirms that request.

**Why this matters:** Elsewhere, “local” means data does not leave the browser. A
reader can therefore understand this sentence to mean the license token is never
sent. The following API sentence names the destination but does not say what is
sent.

**Concrete fix:** Replace it with **“The browser stores prompts, responses, recaps,
saved sets, display preference, and your license token. A license check sends only
the token to the Sociobot billing API.”** Keep study data and license data separate
in the claim wording and test.

#### F-4-4 — “Without streaks or feeds” is an unlisted product claim

**Location / exact quotes:** Landing audience line: **“For students and
self-learners who want focused practice without streaks, feeds, or generated
lessons.”** README opening: **“A calm practice tool for students who want short
sessions without streaks, feeds, or generated lessons.”** The About heading also
says **“Practice without streaks or feeds.”**

**Why this matters:** `scope-limits` proves that the app does not teach, grade, or
generate content. No claim entry or tagged test covers the separate promise that
the product has no streak or feed mechanics.

**Concrete fix:** Extend `scope-limits` to state this promise and test all app
states for the absence of streak/feed counters, rewards, return nudges, and related
stored fields. Otherwise remove “without streaks or feeds” from public copy.

### Low

#### F-4-5 — The release-check sentence makes an unlisted financial side-effect claim

**Location / exact quote:** README, Test and build: **“It never starts a payment.”**

**Why this matters:** This is an absolute claim about a command that calls the live
checkout endpoint. It is not present in `claims.json`, and a redirect-status check
does not prove all server-side side effects are absent.

**Concrete fix:** Replace it with the observable statement **“The check stops
before following the hosted checkout redirect.”** Add that behavior to a tagged
claim if it remains a product guarantee.

#### F-4-6 — README opens with a subjective marketing adjective

**Location / exact quote:** README opening: **“A calm practice tool for students
who want short sessions without streaks, feeds, or generated lessons.”**

**Why this matters:** “Calm” is subjective and adds no usable capability beyond the
specific exclusions already in the sentence.

**Concrete fix:** Use **“A practice tool for students who want short sessions
without streaks, feeds, or generated lessons.”**

#### F-4-7 — A saved-set button does not name its result

**Location / exact quote:** Library saved-set action in `src/app.ts`: **“Use”.**

**Why this matters:** A visitor has to infer whether the button opens, edits,
starts, or imports the saved set. It fails the result-naming verb rule.

**Concrete fix:** Rename it **“Load this prompt set”** and give each instance an
accessible name that includes the set name, for example **“Load Biology review”.**

#### F-4-8 — The session-history empty state omits how to create the first item

**Location / exact quote:** Library: **“No sessions recorded”** followed by
**“Your first private recap will appear here.”**

**Why this matters:** The empty state says what will appear but not how to make it
appear. The saved-set empty state already provides that missing instruction.

**Concrete fix:** Replace the sentence with **“Complete a study session to add its
private recap here.”** Optionally add a **Start a study session** link.

## Copy audit

Hyphenated terms, paths, and numbers count as one word. The `::` separator does not
count as a word. Interface labels and headings follow the sentence tables.

### Landing-page sentences and fact lines

| Words | Copy | Result |
| ---: | --- | --- |
| 7 | Practice recalling answers in a short session. | Pass |
| 14 | For students and self-learners who want focused practice without streaks, feeds, or generated lessons. | F-4-4 |
| 5 | Opens a five-prompt practice session. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 6 | Study data stays in this browser. | Pass |
| 7 | Study sessions and JSON backup are free. | Pass |
| 11 | One prompt and answer per line, separated by `::` or a tab. | Pass |
| 3 | Use 5–30 pairs. | F-4-1 |
| 3 | Nothing is uploaded. | Pass |
| 10 | Keyboard ready: press Tab to move, then Enter to begin. | Pass |
| 3 | Paste 5–30 pairs. | F-4-1 |
| 8 | Put one prompt and answer on each line. | Pass |
| 3 | Recall each answer. | Pass |
| 8 | Reveal it, then choose Recalled or Keep practicing. | Pass |
| 3 | Review your recap. | Pass |
| 8 | Export a JSON backup whenever you want one. | Pass |
| 9 | Prompts, responses, ratings, and recaps remain in this browser. | Pass |
| 7 | The app does not send usage reports. | Pass |
| 12 | The app does not teach content, check correctness, or promise learning results. | Pass |
| 11 | Contour adds saved prompt sets and your latest 20 session records. | Pass |
| 7 | Study sessions and JSON backup remain free. | Pass |
| 7 | Short answer-practice sessions for students and self-learners. | Pass |

No landing sentence exceeds 22 words or uses a banned word.

### README sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 16 | A calm practice tool for students who want short sessions without streaks, feeds, or generated lessons. | F-4-4, F-4-6 |
| 5 | Paste 5–30 `prompt :: answer` pairs. | F-4-1 |
| 6 | Choose 5, 10, or 20 minutes. | F-4-1 |
| 4 | Finish one study session. | Pass |
| 8 | Recaps and reusable sets stay in the browser. | Pass |
| 8 | Five to 30 prompt pairs and 5/10/20-minute sessions. | F-4-1 |
| 3 | Sessions can pause. | Pass |
| 11 | They end when time runs out or after the last prompt. | Pass |
| 15 | Keyboard answer practice (`Enter` to reveal and `1` / `2` to self-rate) with a private recap. | Pass |
| 8 | Local session history plus JSON backup and restore. | Pass |
| 12 | Install the app and use it offline after your first online visit. | Pass |
| 13 | System, light, and dark themes with reduced motion and a tested 390px layout. | F-4-2 |
| 16 | Optional $12 one-time Contour license: reusable saved prompt sets and the latest 20 on-device session records. | Pass |
| 9 | Checkout and license checks use the Sociobot billing API. | Pass |
| 5 | Plain-language `/privacy/` and `/terms/` pages. | Pass |
| 9 | The **Try it with sample data** action opens `/demo`. | Pass |
| 6 | Demo data uses `demo:` storage only. | Pass |
| 14 | Resetting or leaving the demo clears that sample workspace without changing real study data. | Pass |
| 16 | The app supports practice organization; it does not teach content, verify correctness, or claim learning outcomes. | Pass |
| 5 | Requires Node.js 20+ and npm. | Pass |
| 5 | Open the printed local URL. | Pass |
| 11 | No environment variables or backend are required for the free experience. | Pass; verified by clean-clone run |
| 6 | The exact production build command is: | Pass |
| 14 | It type-checks and writes the static deployment to `dist/`, with `dist/index.html` at the root. | Pass |
| 10 | Run all unit, mobile browser, accessibility, persistence, and offline tests: | Pass |
| 8 | Preview the built result with `npm run preview`. | Pass |
| 14 | The Playwright suite starts its own preview server when one is not already running. | Pass |
| 14 | Before release, run this check to confirm that the $12 Contour purchase is registered: | Pass |
| 11 | The catalog must list this $12 product and its return URL. | Pass |
| 5 | Checkout must redirect to Sociobot/Dodo. | Pass |
| 8 | This check fails when purchase setup is missing. | Pass |
| 5 | It never starts a payment. | F-4-5 |
| 16 | Prompts, responses, recaps, saved sets, display preference, and any license token are local to the browser. | F-4-3 |
| 6 | No analytics or advertising scripts ship. | Pass |
| 8 | License checks contact only the Sociobot billing API. | Pass |
| 14 | Clearing site data can remove records; use Library → Export JSON for a portable backup. | Pass |
| 16 | Deploy the files in `dist/` to hosting that opens direct links such as `/demo` and `/privacy/`. | Pass |
| 10 | Do not configure infrastructure, DNS, or billing from this repository. | Pass |
| 11 | The Param Factory registers the product and checkout return URL separately. | Pass |
| 7 | The purchase check must pass before deployment. | Pass |

No README sentence exceeds 22 words or uses a banned word. F-4-6 records the one
subjective marketing adjective. The headings **What v1 includes**, **Run locally**,
**Test and build**, **Data and privacy**, **Deployment**, and **Project notes** make
sense out of context. The two URL lead-ins are labels rather than sentences:
**Live product** and **Try the isolated sample session**.

### Landing headings, actions, and terminology

The landing headings **Add your prompts**, **Complete a study session in three
steps**, **Your study material stays local**, **This app does not check answers**,
and **Keep reusable prompt sets for $12** identify their sections. Landing actions
**Try it with sample data**, **Load sample into my draft**, **Start study session**,
**Read the privacy policy**, and **Buy Contour once for $12** use verbs and name
their results. No landing button finding remains. F-4-7 records the separate saved-set
action found while checking the full product.

The established terms remain **study session**, **prompt pair**, **recap**, **demo**,
**JSON backup**, **prompt set**, and **Contour license**. No conflicting product term
was found.

## Demo and sandbox behaviour

The first-screen action opened `/demo` in one click. The next screen already showed
**PROMPT 1 OF 5**, a 05:00 timer, an answer field, and **“What process do plants use
to convert light into energy?”** The persistent banner read **“Demo — sample data,
nothing is saved”** and included **Reset demo** and **Start for real**.

In a fresh live context, I seeded `fss:draft` with a real-data sentinel. Demo entry,
answer/reveal/rating, Reset demo, and Demo → Privacy → Start preserved that sentinel.
Reset returned to prompt 1. The legal-page exit removed every `demo:fss:*` key and
the `demo:focus-study-sprint` IndexedDB database; re-entry started at prompt 1.
The request log for the full flow contained only
`https://focus-study-sprint.sociobot.in`. A live offline reload retained the banner,
prompt 1, and answer reveal. This gate passes.

## Claims and clean-clone verification

I cloned the repository with `--no-local` to
`/tmp/focus-study-sprint-review-4-clean.HoqK2w`, ran `npm ci`, and executed all 14
commands exactly as listed in `.factory/claims.json`.

| Claim | Command result | Review result |
| --- | --- | --- |
| `demo-isolation` | PASS | Real sentinel survived; demo namespaces cleared on both exit paths. |
| `input-limits` | PASS | Incomplete coverage; see F-4-1. |
| `study-flow` | PASS | Five keyboard-driven prompts produced a persisted recap. |
| `offline-reload` | PASS | Dedicated context reloaded and remained usable offline. |
| `local-privacy` | PASS | Live and clean-clone request logs contained only the product origin. |
| `json-backup` | PASS | Session and prompt set exported, cleared, restored, and reused. |
| `free-core` | PASS | Unlicensed real workspace completed, exported, cleared, and restored. |
| `scope-limits` | PASS | Supplied content, self-rating, and no generation request were verified; see F-4-4 for the separate promise. |
| `accessible-layout` | PASS | First action and controls fit at 390 px and desktop. |
| `display-preferences` | PASS | Light contrast is not asserted by this tagged test; see F-4-2. |
| `contour-price` | PASS | Recorded license enabled prompt sets and exactly 20 of 21 records. |
| `billing-destination` | PASS | Restore contacted only the expected Sociobot verification URL. |
| `session-timing` | PASS | Pause held time and expiry produced a timed recap. |
| `installable-shell` | PASS | Manifest and active service worker were present. |

No listed command failed, so there is no failing-test blocker. F-4-1 and F-4-2 mean
the inventory still contains untested claim scope; F-4-4 and F-4-5 identify unlisted
public claims.

The same clean clone passed `npm test` (25 unit and 28 Playwright tests), `npm run
lint`, `npm run build`, `npm run test:live-contract`, and `git diff --check`.
`dist/` was produced. Application JavaScript totals 36.66 kB raw and 12.36 kB gzip.

## Structure, routing, accessibility, and visual identity

- `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/` returned 200.
  Each has `lang="en"`, one `main`, one `h1`, a route-pattern title, description,
  canonical URL, Open Graph/Twitter metadata, SVG favicon, and apple-touch icon.
- The root title is **“Focus Study Sprint — practice answers in short sessions”**
  at 55 characters. App navigation updates the Library and About titles. The demo,
  legal, and 404 titles follow **Route — Focus Study Sprint**.
- An unknown path returned the designed HTTP 404 with **“This page does not
  exist”**, one `main`, one `h1`, complete metadata, and links back to setup/demo.
- Every discovered internal route, query-state route, public asset, manifest,
  service worker, `robots.txt`, and `sitemap.xml` returned 200. The checkout URL
  returned the expected 303 with a redirect location. Email links use `mailto:`.
- The same **Start / Library / Demo / Privacy** header and footer contents appear on
  all reviewed routes. The sitemap lists all six public routes.
- Library navigation focused **Your library**. Back returned to `/` and focused the
  landing `h1`. The live response sends CSP with header-only `frame-ancestors`,
  `nosniff`, referrer, permissions, and HSTS headers.
- Live Axe scans found zero violations on all six public routes and the 404. A live
  dark/reduced-motion scan also found zero violations and zero computed motion.
  `verify-url.sh` passed. Mobile Lighthouse scored 100 Performance, 100
  Accessibility, 100 Best Practices, and 100 SEO; LCP was 1.2 s, CLS 0, and total
  blocking time 0 ms.
- The warm-paper topographic artwork, forest ink, survey orange, serif display type,
  clipped paper forms, and finite-route motif match `.factory/design.md`. The visual
  identity is product-specific and not a generic SaaS template.

## Earlier-finding verification

I read all three earlier reviews, all three polish reports, and the current handoff.
Each earlier finding was rechecked in current code and live production.

| Earlier item | Review 4 verification |
| --- | --- |
| F-1-1 inconsistent navigation/footer | Fixed live and in source: all reviewed routes use Start / Library / Demo / Privacy and the same footer content. |
| F-1-2 incomplete sitemap | Fixed live and in source: all six public routes are listed. |
| F-1-3 active-recall jargon headline | Fixed: the live h1 is “Practice recalling answers in a short session.” |
| F-1-4 sprint/session naming | Fixed in public copy: the timed activity is called a study session. |
| F-1-5 unclear limits heading | Fixed: “This app does not check answers.” |
| F-1-6 untested artwork claim | Fixed: the public claim is absent; provenance remains in `.factory/design.md`. |
| F-1-7 overlong README sentences | Fixed: every current README sentence is at most 22 words. |
| V9-1 / F-2-1 malformed active-session crash | Fixed: the exact malformed snapshot is removed live, setup remains usable, and the recovery message appears without errors. |
| F-2-2 unlisted free-core claim | Fixed: `free-core` is registered and its exact command passed. |
| F-2-3 unlisted scope claim | Fixed for teaching/grading/generation; its exact command passed. F-4-4 concerns the distinct streak/feed promise. |
| F-2-4 missing 404 social metadata | Fixed live and in `404.html`: Open Graph and Twitter metadata are complete. |
| F-2-5 release-process jargon | Fixed: README names the purchase-registration check. |
| F-2-6 endpoint/private-secret jargon | Fixed: that sentence is absent. F-4-3 concerns different current privacy wording. |
| F-2-7 deployment jargon | Fixed: README names direct-link behavior and examples. |
| F-3-1 legal-page demo exit retained data | Fixed live and in code: both storage namespaces clear before exit and re-entry starts at prompt 1. |
| F-3-2 billing destination unregistered | Fixed: `billing-destination` is registered and its exact command passed. |
| F-3-3 no-private-key promise unregistered | Fixed: that sentence is absent. F-4-5 concerns a different side-effect claim. |
| F-3-4 vague “Core study” term | Fixed: public copy says “Study sessions.” |
| F-3-5 “behavioral analytics” jargon | Fixed as wording: public copy now says “usage reports.” F-4-2 concerns test scope, not jargon. |
| F-3-6 “time/completion endings” jargon | Fixed: README uses two plain sentences. |
| F-3-7 “app shell” jargon | Fixed: README says to install and use the app offline. |

No earlier finding is reopened under its prior ID.

## Missed leverage

No missing AI feature was found. The brief expressly excludes generated lessons and
an AI content firehose, so adding generation would work against the job. JSON import
and export already provide the obvious portability feature. Automatic sync would
conflict with the stated local-first model unless introduced as a separate,
explicitly consented feature. No decorative AI or embedded provider key is present.

## What would make this perfect

Close F-4-1 through F-4-8. Then rerun all 14 exact claim commands, the full clean-clone
test/build gate, the live mobile/desktop first read, demo namespace and request-log
checks, the route crawl, Axe, Lighthouse, and the complete copy audit. A later review
should return PASS only when every public promise matches a complete tagged test and
all actions and empty states say exactly what happens next.
