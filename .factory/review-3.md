# Adversarial first-read review 3 — Focus Study Sprint

**Reviewed:** 2026-09-02 UTC

**Live URL:** <https://focus-study-sprint.sociobot.in>

**Repository revision:** `8649678c6157418c6090e39709a5c4ffced42b22`
**Verdict: FAIL.** The main demo path, registered claims, study flow, routes, and
accessibility checks pass. One demo-exit path retains the sandbox after the visitor
has left it, and six copy or claim-registration findings remain. The required
standard is zero findings.

## First 30 seconds

I opened `/` in separate fresh 390×844 and 1440×1000 browser contexts and did not
scroll before recording the result.

- **What it does:** it lets me practice recalling answers in a short session.
- **For whom:** students and self-learners who want focused practice without
  streaks, feeds, or generated lessons.
- **What to click first:** **Try it with sample data**. The adjacent sentence says
  **“Opens a five-prompt practice session.”**

All three answers are present on the first mobile and desktop screens. At 390 px,
the primary action spans 350×50.8 px and its lower edge is at 518.4 px. The first
screen has no horizontal overflow and raises no console or page error. This gate
passes.

## Findings

### Blocking

#### F-3-1 — Leaving through a legal page retains the demo despite “nothing is saved”

**Location / exact evidence:** The persistent banner says **“Demo — sample data,
nothing is saved.”** In a fresh live context, I completed prompt 1, then followed
the demo header’s **Privacy** link and the Privacy header’s **Start** link. On the
real `/` page, these four sandbox keys still existed:
`demo:fss:active-session`, `demo:fss:duration`, `demo:fss:theme`, and
`demo:fss:draft`. Reopening `/demo` resumed at **PROMPT 2 OF 5**. `src/app.ts`
clears demo storage only in `resetDemo()` and `leaveDemo()`; the direct Privacy and
Terms links do not use either function.

**Why this matters:** The main Reset demo and Start for real controls work, and no
real data is changed. However, the demo contract also requires demo data to be
discarded when the visitor leaves demo mode. The banner is inaccurate on a normal,
visible exit path, so the demo is not yet an honest disposable sandbox.

**Concrete fix:** Route every demo-origin exit, including Privacy and Terms,
through one cleanup function that clears both `demo:fss:*` and the
`demo:focus-study-sprint` IndexedDB database before navigation. Add a browser test
that advances the demo, follows Demo → Privacy → Start, verifies both demo storage
namespaces are gone, and verifies a later `/demo` visit starts at prompt 1.

### Medium

#### F-3-2 — The billing-destination promise is not registered as a claim

**Location / exact quotes:** README: **“Checkout and verification use only the
Sociobot billing API.”** and **“License verification contacts only the Sociobot
billing API.”**

**Why this matters:** These are security and privacy promises. The
`contour-price` claim checks the checkout URL and one mocked verification request,
but its registered claim is only about the $12 features. It does not assert that no
second origin is contacted. No `claims.json` entry names the exclusive billing
destination.

**Concrete fix:** Add a `billing-destination` claim for both README locations. Its
test should record all requests while restoring a license, assert that the only
cross-origin request is the expected `api.sociobot.in` verification URL, and check
that the checkout action uses the registered Sociobot URL. Alternatively, remove
both sentences.

#### F-3-3 — The no-private-key promise is not registered or tested

**Location / exact quote:** README: **“The payment link is public and contains no
private key.”**

**Why this matters:** A reader can rely on this security statement, but no
`claims.json` entry or tagged test covers it. `test:live-contract` proves that the
checkout endpoint redirects; it does not assert the absence of a key or token in
the shipped link.

**Concrete fix:** Remove this implementation-detail sentence, or add a registered
claim whose test inspects the built checkout link and rejects query credentials,
embedded tokens, and private-key material.

### Low

#### F-3-4 — “Core study” is vague and breaks the product’s own terminology

**Location / exact quote:** Landing fact: **“Core study and JSON backup are free.”**

**Why this matters:** “Core study” does not name a feature. The same page later
uses the concrete term “study sessions,” and the repository terminology table also
chooses “study session.”

**Concrete fix:** Rewrite it as **“Study sessions and JSON backup are free.”**

#### F-3-5 — “Behavioral analytics” is implementation jargon

**Location / exact quote:** Landing privacy section: **“The app sends no
behavioral analytics.”**

**Why this matters:** A student should not need to interpret an analytics category
to understand the privacy boundary.

**Concrete fix:** Rewrite it as **“The app does not send usage reports.”**

#### F-3-6 — “Time/completion endings” is compressed README jargon

**Location / exact quote:** README: **“Five to 30 prompt pairs, 5/10/20-minute
sessions, pause, and time/completion endings.”**

**Why this matters:** “Time/completion endings” is not a natural description of
what the session does and makes the reader decode a slash construction.

**Concrete fix:** Replace the ending with two plain sentences: **“Sessions can
pause. They end when time runs out or after the last prompt.”**

#### F-3-7 — “App shell” is unexplained PWA jargon

**Location / exact quote:** README: **“An installable app shell that works offline
after the first online visit.”**

**Why this matters:** “App shell” describes an implementation pattern, not the
result a reader receives.

**Concrete fix:** Rewrite it as **“Install the app and use it offline after your
first online visit.”**

## Copy audit

Word counts treat hyphenated terms, paths, and numbers as one word. Standalone
punctuation is not a word. Headings, controls, links, and code blocks are audited
after the sentence tables.

### Landing-page sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 7 | Practice recalling answers in a short session. | Pass |
| 14 | For students and self-learners who want focused practice without streaks, feeds, or generated lessons. | Pass |
| 5 | Opens a five-prompt practice session. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 6 | Study data stays in this browser. | Pass |
| 7 | Core study and JSON backup are free. | F-3-4 |
| 11 | One prompt and answer per line, separated by `::` or a tab. | Pass |
| 3 | Use 5–30 pairs. | Pass |
| 3 | Nothing is uploaded. | Pass |
| 10 | Keyboard ready: press Tab to move, then Enter to begin. | Pass |
| 3 | Paste 5–30 pairs. | Pass |
| 8 | Put one prompt and answer on each line. | Pass |
| 3 | Recall each answer. | Pass |
| 8 | Reveal it, then choose Recalled or Keep practicing. | Pass |
| 3 | Review your recap. | Pass |
| 8 | Export a JSON backup whenever you want one. | Pass |
| 9 | Prompts, responses, ratings, and recaps remain in this browser. | Pass |
| 6 | The app sends no behavioral analytics. | F-3-5 |
| 12 | The app does not teach content, check correctness, or promise learning results. | Pass |
| 11 | Contour adds saved prompt sets and your latest 20 session records. | Pass |
| 7 | Study sessions and JSON backup remain free. | Pass |
| 7 | Short answer-practice sessions for students and self-learners. | Pass |

### README sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 16 | A calm practice tool for students who want short sessions without streaks, feeds, or generated lessons. | Pass |
| 5 | Paste 5–30 `prompt :: answer` pairs. | Pass |
| 6 | Choose 5, 10, or 20 minutes. | Pass |
| 4 | Finish one study session. | Pass |
| 8 | Recaps and reusable sets stay in the browser. | Pass |
| 11 | Five to 30 prompt pairs, 5/10/20-minute sessions, pause, and time/completion endings. | F-3-6 |
| 15 | Keyboard answer practice (`Enter` to reveal and `1` / `2` to self-rate) with a private recap. | Pass |
| 8 | Local session history plus JSON backup and restore. | Pass |
| 12 | An installable app shell that works offline after the first online visit. | F-3-7 |
| 13 | System, light, and dark themes with reduced motion and a tested 390px layout. | Pass |
| 16 | Optional $12 one-time Contour license: reusable saved prompt sets and the latest 20 on-device session records. | Pass |
| 9 | Checkout and verification use only the Sociobot billing API. | F-3-2 |
| 5 | Plain-language `/privacy/` and `/terms/` pages. | Pass |
| 9 | The **Try it with sample data** action opens `/demo`. | Pass |
| 6 | Demo data uses `demo:` storage only. | Pass |
| 14 | Resetting or leaving the demo clears that sample workspace without changing real study data. | F-3-1 |
| 16 | The app supports practice organization; it does not teach content, verify correctness, or claim learning outcomes. | Pass |
| 5 | Requires Node.js 20+ and npm. | Pass |
| 5 | Open the printed local URL. | Pass |
| 11 | No environment variables or backend are required for the free experience. | Pass |
| 10 | The payment link is public and contains no private key. | F-3-3 |
| 6 | The exact production build command is: | Pass |
| 14 | It type-checks and writes the static deployment to `dist/`, with `dist/index.html` at the root. | Pass |
| 10 | Run all unit, mobile browser, accessibility, persistence, and offline tests: | Pass |
| 8 | Preview the built result with `npm run preview`. | Pass |
| 14 | The Playwright suite starts its own preview server when one is not already running. | Pass |
| 14 | Before release, run this check to confirm that the $12 Contour purchase is registered: | Pass |
| 11 | The catalog must list this $12 product and its return URL. | Pass |
| 5 | Checkout must redirect to Sociobot/Dodo. | Pass |
| 8 | This check fails when purchase setup is missing. | Pass |
| 5 | It never starts a payment. | Pass |
| 16 | Prompts, responses, recaps, saved sets, display preference, and any license token are local to the browser. | Pass |
| 6 | No analytics or advertising scripts ship. | Pass (`local-privacy`) |
| 8 | License verification contacts only the Sociobot billing API. | F-3-2 |
| 14 | Clearing site data can remove records; use Library → Export JSON for a portable backup. | Pass |
| 16 | Deploy the files in `dist/` to hosting that opens direct links such as `/demo` and `/privacy/`. | Pass |
| 10 | Do not configure infrastructure, DNS, or billing from this repository. | Pass |
| 11 | The Param Factory registers the product and checkout return URL separately. | Pass |
| 7 | The purchase check must pass before deployment. | Pass |

No landing or README sentence exceeds 22 words, and none uses a banned marketing
word. F-3-4 through F-3-7 record the terminology and jargon flags. F-3-1 through
F-3-3 record the inaccurate or unregistered claims.

### Headings, actions, and terminology

The landing headings **Add your prompts**, **Complete a study session in three
steps**, **Your study material stays local**, **This app does not check answers**,
and **Keep reusable prompt sets for $12** name their sections. The README headings
name their developer-documentation sections. Landing actions **Try it with sample
data**, **Load sample into my draft**, **Start study session**, **Read the privacy
policy**, and **Buy Contour once for $12** use verbs and name their results. No
metaphor, mood heading, or non-result button was found.

The established terms are study session, prompt pair, recap, demo, JSON backup,
prompt set, and Contour license. F-3-4 is the only terminology-table mismatch.

## Demo and sandbox behaviour

The primary action opens `/demo` in one click. Its first screen already shows the
product in use: **PROMPT 1 OF 5**, a 05:00 timer, a response field, and the realistic
sample question **“What process do plants use to convert light into energy?”** The
banner, Reset demo, and Start for real controls are visible.

With confirmation dialogs accepted, Reset demo returned to prompt 1. Start for real
returned to `/`, removed all `demo:` keys, and preserved a real-data sentinel. A
request log covering landing, demo entry, response entry, reveal, rating, reset, and
exit contained only `https://focus-study-sprint.sociobot.in`. The dedicated offline
claim test also passed. F-3-1 records the separate legal-page exit path that retains
the sandbox.

## Claims and clean-clone verification

I cloned the repository with `--no-local` to
`/tmp/focus-study-sprint-review-3-clean.RdF5JG`, ran `npm ci`, and executed every
command exactly as listed in `.factory/claims.json`.

| Claim | Result | Observed proof |
| --- | --- | --- |
| `demo-isolation` | PASS | Direct Reset/Start for real kept the sentinel and separated namespaces. |
| `input-limits` | PASS | Four and 31 pairs failed; five passed; 5/10/20 were present. |
| `study-flow` | PASS | Keyboard completion produced a recap that survived Library reload. |
| `offline-reload` | PASS | A dedicated context reloaded `/demo` offline and revealed the answer. |
| `local-privacy` | PASS | The typed-response flow made only same-origin requests. |
| `json-backup` | PASS | A session and saved set exported, cleared, restored, and were reusable. |
| `free-core` | PASS | An unlicensed real workspace completed, exported, cleared, and restored. |
| `scope-limits` | PASS | The flow presented supplied content, self-rating, and no generation request. |
| `accessible-layout` | PASS | 390×844 and 1440×1000 fit with tested controls at least 44 px. |
| `display-preferences` | PASS | Repeated dark scans passed and reduced-motion durations were zero. |
| `contour-price` | PASS | A recorded license unlocked saved sets and exactly 20 of 21 records. |
| `session-timing` | PASS | Pause held time; expiry produced the timed recap. |
| `installable-shell` | PASS | The manifest and active product service worker were present. |

No listed claim test failed. F-3-2 and F-3-3 are unlisted claims, so the claim
inventory is not complete.

The same fresh clone also passed `npm test` (25 unit and 27 Playwright tests),
`npm run lint`, `npm run build`, and `npm run test:live-contract`. The build produced
`dist/`; application JavaScript is 35.57 kB raw and 11.73 kB gzip.

## Structure, routing, accessibility, and visual identity

- `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/` returned 200.
  Each has `lang="en"`, one `main`, one `h1`, a route-specific title, description,
  canonical URL, Open Graph/Twitter metadata, favicon, and apple-touch icon.
- The root title is **“Focus Study Sprint — practice answers in short sessions”**
  at 55 characters. The other titles follow **Route — Focus Study Sprint**.
- An unknown path returned the designed HTTP 404 with **“This page does not
  exist”**, a way back, one `h1`, one `main`, and complete social metadata.
- All discovered non-404 internal destinations returned 200. The purchase endpoint returned
  303 to hosted Dodo checkout. The two email links are explicit `mailto:` links.
  `robots.txt`, the six-route sitemap, the social card, and demo query routes
  returned 200.
- App navigation uses history state. Library navigation focused **Your library**;
  Back restored `/` and focused the landing `h1`. The live response carries CSP,
  header-only `frame-ancestors`, `nosniff`, referrer, permissions, and HSTS headers.
- Live axe scans found zero violations on all six public routes. The mobile and
  desktop cold loads raised no console or page errors. Reduced motion, 200% text,
  keyboard controls, skip-link focus, dialog focus, and 44 px targets passed the
  clean browser suite.
- The warm-paper topographic illustration, forest ink, survey orange, editorial
  headings, and restrained contour treatment match `.factory/design.md`. This is a
  recognizable study-specific identity rather than a generic SaaS template.

## Earlier-review verification

I read both earlier reviews, both polish reports, and the current handoff. Each
earlier finding was checked against live production and current code.

| Earlier item | Result in review 3 |
| --- | --- |
| F-1-1 inconsistent navigation/footer | Fixed: the same Start / Library / Demo / Privacy header and footer appear on app, demo, legal, and 404 pages. |
| F-1-2 incomplete sitemap | Fixed: all six public routes are present live and in source. |
| F-1-3 active-recall jargon headline | Fixed: the live headline is “Practice recalling answers in a short session.” |
| F-1-4 sprint/session naming | Fixed: the reviewed setup, process, and completion controls use “study session”; “sprint” is absent from public copy. |
| F-1-5 unclear limits heading | Fixed: the heading is “This app does not check answers.” |
| F-1-6 untested artwork claim | Fixed: the public provenance promise is absent; provenance remains in the design record. |
| F-1-7 overlong README sentences | Fixed: no current README sentence exceeds 22 words. |
| V9-1 / F-2-1 malformed active-session crash | Fixed: the exact out-of-range snapshot is removed live, setup remains usable, and the recovery message appears without an error. |
| F-2-2 unlisted free-core claim | Fixed: `free-core` is registered and its clean non-demo claim test passed. |
| F-2-3 unlisted scope claim | Fixed: `scope-limits` is registered and its claim test passed. |
| F-2-4 missing 404 social metadata | Fixed: live 404 Open Graph and Twitter fields are complete. |
| F-2-5 release-process jargon | Fixed: the README now names the purchase-registration check. |
| F-2-6 endpoint/private-secret jargon | Fixed as a wording issue; F-3-3 separately records that the replacement sentence is an unregistered security claim. |
| F-2-7 deployment jargon | Fixed: the README now names direct links such as `/demo` and `/privacy/`. |

No earlier finding is reopened under its prior ID.

## Missed leverage

No missing AI feature was found. The brief expressly excludes generated lessons and
an AI content firehose, and the current non-AI recall loop is the core job. JSON
import/export already provides the obvious portability feature. Automatic sync
would conflict with the stated local-first privacy model unless introduced as a
separate, explicit product decision.

## What would make this perfect

Close F-3-1 through F-3-7. Then rerun the legal-page demo-exit regression, every
registered claim command, the full test/build gate, the cold 390 px and desktop
read, the request log, route crawl, and copy audit. A later review should return
PASS only when the demo cleanup works on every exit and no copy or claim finding
remains.
