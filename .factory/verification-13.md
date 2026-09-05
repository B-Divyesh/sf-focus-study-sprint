# Focus Study Sprint verification 13 — practice recalling answers in short sessions

## Verdict

**PASS.** There are zero findings at every severity and zero untested public
claims.

- Candidate implementation/test commit: `23b8cb00f293b647c5e83db538002e2142efcae6`
- Last runtime-changing commit: `94b07802c0611df5ff7c072c4419c1f1ec6d4e1a`
- Documentation commit reviewed: `599ee91d679c5786adfcc6bca0d09ccd8d7826d9`
- Live deployment: `8aa68553-b47b-477e-8a81-605bb7aab98b`
- Live URL: <https://focus-study-sprint.sociobot.in>
- Fresh clone: `/tmp/fss-verify13-clean`

The live `index.html`, application JavaScript, CSS, service worker, and manifest
have the same SHA-256 hashes as the production build from the reviewed checkout.
The two commits after the last runtime change contain a browser-test correction and
reports only.

## First screen before scrolling

The live root was opened in new browser contexts at 390×844 and 1440×1000. No
scrolling occurred before these details were recorded.

- Job: **Practice recalling answers in a short session.**
- Audience: students and self-learners who want focused practice without streaks,
  feeds, or generated lessons.
- First action: **Try it with sample data**. The adjacent sentence says it opens a
  five-prompt practice session.
- Facts: works offline after the first visit; study data stays in the browser;
  study sessions and JSON backup are free.

The action ended at 518 px on the 844 px phone screen and at 540 px on desktop.
Both pages had zero horizontal overflow, one `h1`, one `main`, `lang="en"`, and the
plain title “Focus Study Sprint — practice answers in short sessions”.

## Declared claims

`npm ci` completed with zero reported vulnerabilities in the fresh clone. Every
command in `.factory/claims.json` was then run separately. Each command selected
exactly one tagged browser test.

| Claim | Result | Observed proof |
| --- | --- | --- |
| `demo-isolation` | PASS | Real-data sentinel survived entry, reset, legal-page exit, and Start for real; demo keys and database were cleared. |
| `input-limits` | PASS | Four and 31 pairs failed; five and 30 passed; 30 opened prompt 1 of 30; choices were 5/10/20 minutes. |
| `study-flow` | PASS | Enter and 1/2 completed five prompts; the recap persisted after a Library reload. |
| `offline-reload` | PASS | A dedicated context reloaded the sample offline and revealed the answer. |
| `local-privacy` | PASS | The typed-answer, reveal, and rating flow sent no request to another origin. |
| `no-advertising-scripts` | PASS | Request/resource logs and built HTML, CSS, JavaScript, and service worker contained no analytics, ad trackers, remote fonts, or remote runtime scripts. |
| `json-backup` | PASS | Session and prompt set exported, cleared, restored, and loaded again. |
| `free-core` | PASS | A fresh unlicensed real workspace completed a session, exported, cleared, and restored without a license request. |
| `scope-limits` | PASS | Supplied content and self-rating worked with no grading, generation, streak, feed, reward, or return nudge. |
| `accessible-layout` | PASS | Phone and desktop had no overflow; first action and controls met the 44 px target. |
| `display-preferences` | PASS | Explicit light and dark scans passed; reduced-motion durations were zero. |
| `contour-price` | PASS | The $12 copy matched; a valid fixture enabled prompt sets and exactly the latest 20 of 21 records. |
| `billing-destination` | PASS | Checkout used the Sociobot URL; verification made one cross-origin request containing only the license query parameter. |
| `session-timing` | PASS | Pause held the time; resume and expiry produced a time-ended recap. |
| `installable-shell` | PASS | Standalone manifest, required icons, and a controlling service worker were present. |

The live landing page, README, Privacy, Terms, About, Library, and conditional
status text were cross-checked against the registry. The 15 entries cover the
offline, privacy, no-tracker, local storage, price, license destination, demo,
limits, keyboard, timing, backup, layout, theme, scope, and install claims. The
live release check also proved the catalog and hosted checkout redirect. No
claim-like sentence was missing, false, partially tested, or left untested.

## Clean checkout and live runtime

`npm run test:release` passed from the fresh clone:

- 26/26 Vitest unit and deployment checks
- 29/29 Playwright browser tests
- TypeScript check
- production build with `dist/index.html`
- live Sociobot catalog and checkout redirect check

The same 29/29 Playwright tests passed against the deployed origin. The live run
covered the normal study flow, malformed prompt input, malformed nested backup,
poisoned older storage, refresh recovery, malformed active-session recovery,
timer expiry, keyboard operation, focus handling, browser history, route titles,
200% text, service-worker control, offline reload, legal pages, and the 404.

Additional live fixture checks proved that a returned license is stored and removed
from the URL before unlocking. Empty and invalid license restores showed clear
errors and did not expose paid controls.

## Demo and real-data isolation

The one-click action opened a populated session at prompt 1 of 5 with a realistic
biology question. The banner “Demo — sample data, nothing is saved” stayed visible
after reveal and rating. Reset returned to prompt 1. In both phone and desktop
contexts, a real `fss:draft` sentinel remained unchanged throughout.

Start for real returned to `/`, removed all `demo:fss:*` keys, and deleted the
`demo:focus-study-sprint` IndexedDB database. Exiting through Privacy had the same
result in the passing live suite. No sample action changed real study data.

## Accessibility, routes, privacy, and offline behavior

- `/opt/fleet/lib/verify-url.sh` passed in 584 ms with no console errors, complete
  alt text, useful title, `lang`, one `h1`, and one `main`.
- Independent Axe scans reported no violations at any impact level on `/`, `/demo`,
  `/library`, `/about`, `/privacy/`, `/terms/`, `/offline.html`, or the designed
  404, at phone and desktop widths.
- The same 16 route/viewport states had no visible interactive target below 44 px.
  Reduced-motion computed animation and transition duration was zero throughout.
- Skip-link focus, route-heading focus, dialog focus/Escape, keyboard completion,
  light/dark contrast, and 200% text layout passed in the live browser suite.
- `/`, `/demo`, `/library`, `/about`, `/privacy/`, `/terms/`, the offline page,
  manifest, robots file, and sitemap returned 200. `/does-not-exist` deliberately
  returned 404 and rendered “This page does not exist”; that expected status is not
  a defect.
- Every route had its own title, description, canonical URL, Open Graph data,
  Twitter card, one `h1`, and one `main`. All internal links returned 200; the two
  contact links were explicit `mailto:` links. Checkout returned 303 to hosted Dodo
  checkout.
- The root, demo, and sample interaction made no cross-origin request. Live response
  headers included the restrictive CSP, header-only `frame-ancestors`, HSTS,
  `nosniff`, referrer policy, and permissions policy. The manifest had the correct
  MIME type and `sw.js` used `no-cache`.
- In a dedicated offline context, cache `fss-v12-shell` loaded the landing page and
  768 px artwork, Privacy, and the sample session. The answer remained revealable.
  The service worker also passed the no-first-claim-reload test. Its update path
  provides an in-app update notice and reloads only after the user chooses Update.
- Privacy choices are usable without an account: export, import, and clear passed;
  the policy provides `privacy@sociobot.in`. This is a static PWA, so tenant,
  restart-persistence, health, and product-backend 429 checks do not apply.

The brief explicitly excludes generated lessons. A model-assisted feature would
work against that product boundary; no missed AI step was found. JSON import/export
already supplies the useful portability step.

## Performance and build size

Fresh live mobile Lighthouse results:

| Category or metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1.29 s |
| Total blocking time | 101 ms |
| CLS | 0 |

The production application JavaScript is 35.34 kB raw / 11.56 kB gzip. CSS is
24.82 kB raw / 5.88 kB gzip. The phone hero is 47.96 kB. All are below the supplied
static-PWA budgets.

## Earlier finding disposition

Every earlier verification and adversarial-review finding was reproduced or checked
through its current regression path.

| Earlier finding | Current proof | Disposition |
| --- | --- | --- |
| Initial/V2 checkout unavailable | Live release check passed; checkout returned 303 to hosted Dodo. | Closed |
| Initial undersized controls | Independent audit found no target below 44 px on eight routes at phone and desktop widths. | Closed |
| Initial missing headers and wrong manifest MIME | Live header and content-type checks passed. | Closed |
| V4 malformed nested import blanked the app | Live test rejected it without replacing saved data or losing recovery controls. | Closed |
| V5 missing registry and isolated demo | All 15 claim commands and both fresh demo contexts passed. | Closed |
| V5 service-worker reload race | Live no-first-claim-reload regression passed without `ERR_ABORTED`. | Closed |
| V5 history/titles, offline CSP, theme contrast, metadata, and 404 gaps | Live tests 19–28 plus independent route/Axe checks passed. | Closed |
| V6 incomplete paid, backup, timing, and install claim tests | Dedicated tagged tests exercised each observable outcome. | Closed |
| V8-1 “full” paid history copy | Live copy says latest 20; 21-record fixture displayed exactly 20. | Closed |
| V9-1 malformed active-session snapshot | Live recovery removed the snapshot, kept one `main`/`h1`, and showed setup guidance. | Closed |
| F-1-1 through F-1-2 navigation/footer and sitemap | Shared navigation/footer test and all six sitemap routes passed live. | Closed |
| F-1-3 through F-1-7 jargon, naming, heading, provenance, and long README sentences | Plain first screen, one “study session” term, direct scope heading, removed footer promise, and copy audit are current. | Closed |
| F-2-1 through F-2-3 recovery, free-core, and scope coverage | Malformed-state, unlicensed real flow, and no-grading/generation tests passed live. | Closed |
| F-2-4 through F-2-7 404 metadata and README wording | Designed 404 metadata passed; current README uses direct purchase and deploy wording. | Closed |
| F-3-1 demo legal-page exit | Live demo-isolation test cleared keys/database while preserving real data. | Closed |
| F-3-2 through F-3-7 billing/privacy claim coverage and jargon | Billing claim passed; untestable private-key copy remains removed; current product terms are concrete. | Closed |
| F-4-1 through F-4-4 boundary/theme/billing/scope coverage | Exact 4/5/30/31, both-theme Axe, token-only, and retention-mechanics tests passed. | Closed |
| F-4-5 through F-4-8 payment wording, subjective copy, saved-set action, and empty state | Removed claims stay absent; named action and “Start a study session” recovery are live. | Closed |
| F-5-1 unlisted no-advertising promise | Registered claim and production-artifact/request scan passed locally and live. | Closed |

Verifications 7, 10, 11, and 12 recorded no findings; their covered paths were
re-run in this pass and remain clean.

## Findings

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Untested claims | 0 |

**Final verdict: PASS.**
