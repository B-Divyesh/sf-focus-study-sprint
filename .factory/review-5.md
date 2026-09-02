# Adversarial first-read review 5 — Focus Study Sprint

**Reviewed:** 2026-09-02 UTC  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Repository revision:** `117ece4aabc12f07a6160830807450e089c994c8`

## Verdict: FAIL

One medium finding remains. All listed claims were tested successfully, but one
visitor-facing privacy promise in the README is broader than its registered claim
and sandbox proof. The required outcome is zero findings.

## First 30 seconds

Fresh 390×844 and 1440×1000 contexts opened `/` without scrolling.

- **What it does:** “Practice recalling answers in a short session.”
- **For whom:** “For students and self-learners who want focused practice without
  streaks, feeds, or generated lessons.”
- **What to click first:** **Try it with sample data**. Its adjacent result says
  “Opens a five-prompt practice session.”

At 390 px the primary action was fully visible at `x=20`, `y=467.6`,
`350×50.8 px`; the document width was exactly 390 px. The desktop view gave the
same three answers. Both cold loads had one `h1`, no console or page error, and no
horizontal overflow. The topographic notebook treatment is distinct and matches
the visual thesis rather than a generic SaaS template.

## Findings

### Medium

#### F-5-1 — README makes an unlisted advertising-script privacy promise

**Location / exact quote:** README, **Data and privacy**: “No analytics or
advertising scripts ship.”

**Why this matters:** This is a privacy promise a visitor can rely on. The closest
registered item, `local-privacy`, promises that study data stays in the browser and
that the study flow sends no analytics or study content to another origin. Its
request-log test passed, but it does not claim or test that no advertising script is
shipped. No `claims.json` entry contains the advertising-script promise. The claims
contract requires each public claim to have its own matching sandbox proof.

**Concrete fix:** Delete this sentence; the separately tested landing sentence
“The app does not send usage reports” already gives the useful, plainer privacy
boundary. If retaining the broader assertion is important, add a distinct
`no-advertising-scripts` claim and tagged test that inspects all loaded resources and
the built HTML/JS for advertising integrations, alongside an outgoing-request log.

## Copy audit

Hyphenated words, paths, and numerals count as one word. Headings, labels, links,
and button names are reviewed separately. No listed sentence exceeds 22 words. No
landing or README sentence uses a banned marketing adjective. F-5-1 is the only
claim-registration flag.

### Landing page

| Words | Sentence / fact line | Result |
| ---: | --- | --- |
| 7 | Practice recalling answers in a short session. | Pass |
| 14 | For students and self-learners who want focused practice without streaks, feeds, or generated lessons. | Pass |
| 5 | Opens a five-prompt practice session. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 6 | Study data stays in this browser. | Pass |
| 7 | Study sessions and JSON backup are free. | Pass |
| 11 | One prompt and answer per line, separated by `::` or a tab. | Pass |
| 3 | Use 5–30 pairs. | Pass |
| 3 | Nothing is uploaded. | Pass |
| 10 | Keyboard ready: press Tab to move, then Enter to begin. | Pass |
| 3 | Paste 5–30 pairs. | Pass |
| 9 | Put one prompt and answer on each line. | Pass |
| 3 | Recall each answer. | Pass |
| 8 | Reveal it, then choose Recalled or Keep practicing. | Pass |
| 3 | Review your recap. | Pass |
| 9 | Export a JSON backup whenever you want one. | Pass |
| 9 | Prompts, responses, ratings, and recaps remain in this browser. | Pass |
| 7 | The app does not send usage reports. | Pass |
| 12 | The app does not teach content, check correctness, or promise learning results. | Pass |
| 11 | Contour adds saved prompt sets and your latest 20 session records. | Pass |
| 7 | Study sessions and JSON backup remain free. | Pass |
| 7 | Short answer-practice sessions for students and self-learners. | Pass |

### README

| Words | Sentence / fact line | Result |
| ---: | --- | --- |
| 15 | A practice tool for students who want short sessions without streaks, feeds, or generated lessons. | Pass |
| 5 | Paste 5–30 `prompt :: answer` pairs. | Pass |
| 6 | Choose 5, 10, or 20 minutes. | Pass |
| 4 | Finish one study session. | Pass |
| 8 | Recaps and reusable sets stay in the browser. | Pass |
| 8 | Five to 30 prompt pairs and 5/10/20-minute sessions. | Pass |
| 3 | Sessions can pause. | Pass |
| 11 | They end when time runs out or after the last prompt. | Pass |
| 15 | Keyboard answer practice (`Enter` to reveal and `1` / `2` to self-rate) with a private recap. | Pass |
| 8 | Local session history plus JSON backup and restore. | Pass |
| 12 | Install the app and use it offline after your first online visit. | Pass |
| 13 | System, light, and dark themes with reduced motion and a tested 390px layout. | Pass |
| 16 | Optional $12 one-time Contour license: reusable saved prompt sets and the latest 20 on-device session records. | Pass |
| 9 | Checkout and license checks use the Sociobot billing API. | Pass |
| 5 | Plain-language `/privacy/` and `/terms/` pages. | Pass |
| 9 | The **Try it with sample data** action opens `/demo`. | Pass |
| 6 | Demo data uses `demo:` storage only. | Pass |
| 14 | Resetting or leaving the demo clears that sample workspace without changing real study data. | Pass |
| 16 | The app supports practice organization; it does not teach content, verify correctness, or claim learning outcomes. | Pass |
| 5 | Requires Node.js 20+ and npm. | Pass |
| 5 | Open the printed local URL. | Pass |
| 11 | No environment variables or backend are required for the free experience. | Pass; verified by the clean install/run path |
| 6 | The exact production build command is: | Pass |
| 14 | It type-checks and writes the static deployment to `dist/`, with `dist/index.html` at the root. | Pass |
| 10 | Run all unit, mobile browser, accessibility, persistence, and offline tests: | Pass |
| 8 | Preview the built result with `npm run preview`. | Pass |
| 14 | The Playwright suite starts its own preview server when one is not already running. | Pass |
| 14 | Before release, run this check to confirm that the $12 Contour purchase is registered: | Pass |
| 11 | The catalog must list this $12 product and its return URL. | Pass |
| 5 | Checkout must redirect to Sociobot/Dodo. | Pass |
| 8 | This check fails when purchase setup is missing. | Pass |
| 14 | The browser stores prompts, responses, recaps, saved sets, display preference, and your license token. | Pass |
| 13 | A license check sends only the token to the Sociobot billing API. | Pass |
| 6 | No analytics or advertising scripts ship. | **F-5-1** |
| 14 | Clearing site data can remove records; use Library → Export JSON for a portable backup. | Pass |
| 16 | Deploy the files in `dist/` to hosting that opens direct links such as `/demo` and `/privacy/`. | Pass |
| 10 | Do not configure infrastructure, DNS, or billing from this repository. | Pass |
| 11 | The Param Factory registers the product and checkout return URL separately. | Pass |
| 7 | The purchase check must pass before deployment. | Pass |

The landing headings name their sections: **Add your prompts**, **Complete a study
session in three steps**, **Your study material stays local**, **This app does not
check answers**, and **Keep reusable prompt sets for $12**. Its actions name results:
**Try it with sample data**, **Load sample into my draft**, **Start study session**,
**Read the privacy policy**, and **Buy Contour once for $12**. The Library action is
**Load this prompt set**, with a prompt-set-specific accessible name. Terminology is
consistent: study session, prompt pair, recap, demo, JSON backup, prompt set, and
Contour license.

## Demo and sandbox behaviour

The first-screen action opened `/demo` in one click. The first demo screen already
showed **PROMPT 1 OF 5**, a 05:00 timer, an answer field, the realistic
photosynthesis prompt, and the reveal action. The persistent **“Demo — sample data,
nothing is saved”** banner supplied **Reset demo** and **Start for real**.

In a fresh 390 px context, advancing one prompt and pressing Reset returned to
prompt 1. Start for real removed every `demo:fss:*` key and the
`demo:focus-study-sprint` IndexedDB database. The complete landing-to-demo flow
made requests only to `https://focus-study-sprint.sociobot.in`; it raised no console
or page error. A dedicated live context visited `/demo` online, went offline,
reloaded, and revealed **Photosynthesis** successfully.

## Claims and quality gates

`npm ci` completed from this clean workspace with zero reported vulnerabilities.
Every exact command listed in `.factory/claims.json` completed successfully, as did
the aggregate suite. No listed claim test is untested or failing.

| Claim | Result |
| --- | --- |
| `demo-isolation` | Pass |
| `input-limits` | Pass |
| `study-flow` | Pass |
| `offline-reload` | Pass |
| `local-privacy` | Pass |
| `json-backup` | Pass |
| `free-core` | Pass |
| `scope-limits` | Pass |
| `accessible-layout` | Pass |
| `display-preferences` | Pass |
| `contour-price` | Pass |
| `billing-destination` | Pass |
| `session-timing` | Pass |
| `installable-shell` | Pass |

`npm test` passed 25 Vitest and 28 Playwright tests. `npm run build` passed and
created `dist/index.html`; the application bundle is 35.34 kB raw / 11.56 kB gzip.
`npm run test:live-contract` passed the live catalog and checkout redirect check.

## Structure, accessibility, and links

- `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/` returned 200. Each
  had a route-specific title, one `h1`, one `main`, description, canonical URL,
  Open Graph and Twitter metadata, and no serious/critical Axe finding.
- `/not-a-route` returned the designed 404 with status 404, one `h1`, one `main`,
  and complete metadata. Chromium reported only its expected failed-navigation
  resource message for that deliberate HTTP 404.
- All discovered internal routes, demo query routes, manifest, service worker,
  sitemap, robots file, social card, and favicon returned 200. The checkout endpoint
  returned 303 to the hosted Dodo checkout; email links are explicit `mailto:` links.
- Navigation to Library focused **Your library**. Browser Back returned to `/`,
  focused the landing `h1`, and announced the route title. The shared header and
  footer are consistent across app, demo, legal, and 404 pages.
- The live root sends a restrictive CSP with header-only `frame-ancestors 'none'`,
  HSTS, `nosniff`, referrer policy, and permissions policy. The 390 px and desktop
  cold loads had no normal-route console errors.

## Earlier findings rechecked

Every earlier review and polish report was read. Each prior finding was verified on
the current live site and against the current source:

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Fixed: identical Start / Library / Demo / Privacy navigation and footer. |
| F-1-2 | Fixed: sitemap lists all public app routes. |
| F-1-3 | Fixed: plain, jargon-free landing headline. |
| F-1-4 | Fixed: the timed activity is consistently a study session. |
| F-1-5 | Fixed: the scope heading names what the app does not do. |
| F-1-6 | Fixed: artwork provenance is not presented as an untested public claim. |
| F-1-7 | Fixed: current README sentences stay within 22 words. |
| V9-1 / F-2-1 | Fixed: malformed active-session data is rejected and recovery remains usable. |
| F-2-2 | Fixed: `free-core` is registered and passes in an unlicensed workspace. |
| F-2-3 | Fixed: `scope-limits` is registered and passes. |
| F-2-4 | Fixed: the 404 has Open Graph and Twitter metadata. |
| F-2-5 | Fixed: purchase-registration wording is concrete. |
| F-2-6 | Fixed: endpoint/private-key jargon is absent. |
| F-2-7 | Fixed: deployment text names direct-link behavior. |
| F-3-1 | Fixed: demo cleanup occurs on legal-page exits as well as the banner exit. |
| F-3-2 | Fixed: `billing-destination` is registered and passes. |
| F-3-3 | Fixed: the untested payment-link/private-key statement is absent. |
| F-3-4 | Fixed: public copy says study sessions, not “Core study.” |
| F-3-5 | Fixed: public copy says usage reports, not behavioral analytics. |
| F-3-6 | Fixed: README describes pause and ending in separate plain sentences. |
| F-3-7 | Fixed: README describes installing and using offline, not an app shell. |
| F-4-1 | Fixed: the limits test covers both bounds, all durations, and a 30-prompt session. |
| F-4-2 | Fixed: explicit light and dark Axe scans run in the claim test. |
| F-4-3 | Fixed: README and Privacy distinguish local storage from token-only verification. |
| F-4-4 | Fixed: scope coverage includes streaks, feeds, rewards, and return nudges. |
| F-4-5 | Fixed: the unprovable payment-side-effect sentence is absent. |
| F-4-6 | Fixed: the subjective “calm” adjective is absent. |
| F-4-7 | Fixed: saved-set action names the result and the set. |
| F-4-8 | Fixed: the empty state names how to create a recap and links to start. |

## Missed leverage

No missing AI feature was found. The brief explicitly excludes generated content and
an AI content firehose; adding one would weaken the local, user-supplied-practice
job. JSON export/import supplies the implied portability feature. Automatic sync
would conflict with the stated local-first privacy boundary unless separately scoped.

## What would make this perfect

Remove or register and test the advertising-script promise in F-5-1. Then rerun the
exact 14 claim commands, the full test/build gate, and this copy audit. A PASS review
requires that no public privacy promise outstrip its registered proof.
