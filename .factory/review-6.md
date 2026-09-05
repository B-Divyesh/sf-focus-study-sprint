# Focus Study Sprint review 6 — practice recalling answers in short sessions

## Verdict

**FAIL.** The core product works, but this strict review found four findings and
four untested public claims. A PASS requires zero findings and zero untested
claims.

- Live URL: <https://focus-study-sprint.sociobot.in>
- Candidate implementation/test commit: `23b8cb00f293b647c5e83db538002e2142efcae6`
- Last runtime-changing commit: `94b07802c0611df5ff7c072c4419c1f1ec6d4e1a`
- Documentation commit reviewed: `00493f05e16ef312f6cb10d3d7b926cbdce0f967`
- Fresh checkout: `/tmp/fss-review6-clean`
- Reviewed: 2026-09-05 UTC

Commits after `23b8cb0` change reports only. SHA-256 comparisons found no
difference between the live app and the clean production build for the app
HTML, JavaScript, CSS, service worker, manifest, legal pages, 404 page, or
offline page.

## First screen before scrolling

Fresh 390×844 and 1440×1000 browser contexts opened the live root. The page was
not scrolled before recording these details.

- Job: **Practice recalling answers in a short session.**
- Audience: students and self-learners who want focused practice without
  streaks, feeds, or generated lessons.
- First action: **Try it with sample data**.
- Next result: **Opens a five-prompt practice session.**
- Facts: offline after the first visit; study data stays in the browser; study
  sessions and JSON backup are free.

The action ended at 518 px on the phone and 540 px on desktop. Both first screens
had one `h1`, one `main`, `lang="en"`, no horizontal overflow, and no console or
page errors. The field-notebook visual direction is distinct and matches the
recorded design.

## Findings

### Medium — F-6-1: the offline page drops the standard site navigation

The live `/offline.html` response is a real user-facing fallback and returns 200.
At both phone and desktop widths it has one `h1` and one `main`, but it has no skip
link, primary navigation, or footer. The only destination is **Try the app again**.

This breaks the required shared route skeleton and removes the normal Privacy,
Terms, Demo, and product navigation precisely when the visitor needs recovery
help. The page is otherwise readable, has no Axe violation, and its control meets
the 44 px target.

Required resolution: give the offline fallback the same skip link, header,
four-link navigation, and footer as the other public pages.

Evidence: `/work/.evidence/review-6/live-review.json` and
`/work/.evidence/review-6/live-offline-phone.png`.

### Low — F-6-2: the offline page lacks required route metadata

The live and built `/offline.html` contain a useful title and description, but no
canonical link, Open Graph fields, Twitter card, favicon, or Apple touch icon.
Every other reviewed route supplies these fields. The site-structure contract
requires route metadata, including for designed user-facing pages.

Required resolution: add an offline canonical URL, product social metadata, and
the existing product icons. Add the offline page to the metadata regression test.

Evidence: the `/offline.html` entries in
`/work/.evidence/review-6/live-review.json` and the matching built/live file hash.

### Medium — F-6-3: the history-limit claims are not completely tested

The locked Library publicly says **Latest 3**. After importing 21 sessions it also
says **All sessions remain in your JSON export**. Neither quantitative result is
asserted by a declared claim command:

- `@claim:contour-price` imports 21 records and proves the paid latest-20 view, but
  does not assert that the locked view contains exactly three records.
- The same test only asserts the sentence about the JSON export. It does not export
  the 21-record state and inspect the file.
- `@claim:json-backup` proves a one-session, one-prompt-set round trip, not the
  history-overflow case described by this copy.

An independent live check confirmed the current behavior is true: the locked view
showed three records and the downloaded JSON contained all 21. The issue is missing
repeatable claim coverage, not a false runtime result.

Required resolution: register the free three-record view and overflow-export
promise, then add tagged assertions for both observable outcomes.

Evidence: `/work/.evidence/review-6/manual-untagged-claims.json` and
`tests/app.spec.ts:689` in the reviewed checkout.

### Medium — F-6-4: two license promises in Terms are absent from the claim registry

The Terms page says:

- **Accessibility, the complete study flow, and export remain free.**
- **A refunded, expired, revoked, or wrong-product license no longer enables paid
  features.**

`free-core` proves the unlicensed study flow and export, but its registered claim
does not include accessibility or list Terms as a location. The accessibility
tests also do not assert the entitlement boundary. No declared claim simulates
the four named invalid-license reasons and verifies that paid controls lock.

Independent live checks found the current behavior correct: the unlicensed app
passed keyboard and Axe checks, and fixtures for `invalid`, `expired`, `revoked`,
and `wrong_product` all removed paid controls and showed the inactive-license
notice. These remain unlisted, untested public promises under the claims contract.

Required resolution: add claim entries and tagged tests for the accessibility
entitlement and invalid-license lifecycle, or narrow the public wording to an
already registered claim.

Evidence: `/work/.evidence/review-6/manual-untagged-claims.json`, the live browser
suite log, `.factory/claims.json`, and `terms/index.html`.

## Declared claims

`npm ci` completed with zero reported vulnerabilities in the fresh checkout. All
15 commands from `.factory/claims.json` were then run separately. Each selected
exactly one tagged browser test and passed.

| Claim | Result | Observed proof |
| --- | --- | --- |
| `demo-isolation` | PASS | Real-data sentinel survived entry, reset, and exit; demo keys and database cleared. |
| `input-limits` | PASS | Four and 31 pairs failed; five and 30 passed; only 5/10/20 minutes were offered. |
| `study-flow` | PASS | Enter and 1/2 completed five prompts; recap persisted after reload. |
| `offline-reload` | PASS | A dedicated context reloaded the demo offline and revealed the answer. |
| `local-privacy` | PASS | The answer flow sent no request to another origin. |
| `no-advertising-scripts` | PASS | Requests and built assets contained no analytics, ads, remote fonts, or remote scripts. |
| `json-backup` | PASS | One session and one prompt set exported, cleared, restored, and loaded. |
| `free-core` | PASS | An unlicensed workspace completed, exported, cleared, and restored a session. |
| `scope-limits` | PASS | Supplied content used self-rating with no grading, generation, or retention mechanics. |
| `accessible-layout` | PASS | Phone and desktop had no overflow; checked controls met 44 px. |
| `display-preferences` | PASS | Light/dark Axe checks passed; reduced-motion durations were zero. |
| `contour-price` | PASS | A valid fixture enabled prompt sets and exactly the latest 20 of 21 records. |
| `billing-destination` | PASS | Checkout used Sociobot; verification sent only the license query value. |
| `session-timing` | PASS | Pause held time; resume and expiry produced the timed recap. |
| `installable-shell` | PASS | The standalone manifest and controlling service worker were present. |

The 15 registered claims pass. F-6-3 and F-6-4 identify four additional or
incompletely tested public claims. Untested claim count: **4**.

## Clean checkout and live product checks

`npm run test:release` passed from the fresh checkout:

- 26/26 Vitest unit and deployment tests
- 29/29 local Playwright tests
- TypeScript check
- production build with `dist/index.html`
- live Sociobot catalog and hosted-checkout redirect check

The same 29/29 Playwright tests passed against the deployed site. They covered the
normal study path, 4/5/30/31 prompt boundaries, malformed prompt input, malformed
nested backup recovery, poisoned storage, interrupted-session recovery, timer
expiry, keyboard use, route history and focus, 200% text, themes, offline reload,
legal pages, and the designed 404.

Fresh phone and desktop demo sessions opened directly at prompt 1 of 5 with the
biology sample. The banner **Demo — sample data, nothing is saved** remained in
the demo after reveal and rating. Reset returned to prompt 1. Start for real
deleted the demo namespace and retained the separate real-data sentinel. Neither
demo flow made a cross-origin request.

Empty and invalid license restores gave direct recovery text. Manual invalid,
expired, revoked, and wrong-product fixtures all relocked paid controls. Browser
Back returned from a started session to setup in one action.

## Accessibility, routes, privacy, and offline behavior

- `/opt/fleet/lib/verify-url.sh` passed the live root in 988 ms with no console
  errors, one `h1`, one `main`, `lang="en"`, and complete image alternatives.
- Independent Axe scans found zero violations at any impact on eight routes at
  both 390×844 and 1440×1000.
- Those 16 route states had no target below 44 px, no horizontal overflow, and no
  visible motion with reduced motion requested.
- All eight routes also fit at 200% text without horizontal overflow.
- Skip-link focus, dialog focus/Escape, keyboard completion, light/dark contrast,
  route-heading focus, and browser history passed in the live suite.
- `/`, `/demo`, `/library`, `/about`, `/privacy/`, `/terms/`, and `/offline.html`
  returned 200. `/does-not-exist` deliberately returned 404 and rendered the
  designed **This page does not exist** page. That status is expected.
- Twenty-one discovered links were checked. Internal links returned 200, contact
  links were explicit `mailto:` links, and the external checkout link used the
  product-scoped Sociobot endpoint.
- Live study traffic stayed same-origin. Response headers include the restrictive
  CSP, header-only `frame-ancestors`, HSTS, `nosniff`, referrer policy, and
  permissions policy. The manifest MIME type is correct and `sw.js` is not cached.
- A dedicated live context loaded the sample and Privacy offline, then revealed
  the cached expected answer. A disposable two-version test of the exact build
  showed **An app update is ready**; choosing **Update app** activated the new
  worker, reloaded once, preserved one `h1` and `main`, and logged no errors.
- Privacy controls require no account: export, import, and clear passed. The policy
  provides `privacy@sociobot.in`.

This is a static PWA with no product backend. Tenant isolation, server restart
persistence, product health, and product-server 429 checks do not apply. The live
product-specific billing registration and checkout redirect passed; no purchase was
made.

The brief explicitly excludes generated lessons. Adding a model-assisted content
step would conflict with the product scope. JSON import/export already provides the
useful portability path, so there is no missed AI or sync feature finding.

## Performance

The first Lighthouse process suffered a headless browser-tab crash and produced no
report. A retry with safer Chromium flags completed successfully:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 0.9 s |
| Total blocking time | 0 ms |
| CLS | 0 |

The built application JavaScript is 35.34 kB raw / 11.56 kB gzip. CSS is
24.82 kB raw / 5.88 kB gzip. The 47.96 kB phone artwork and all bundles remain
within the supplied budgets.

## Earlier finding disposition

Every earlier defect, including low-severity items, was checked against its current
regression path.

| Earlier finding | Current proof | Disposition |
| --- | --- | --- |
| Initial/V2 paid checkout unavailable | The release check passed and checkout returned a hosted redirect. | Closed |
| Initial 44 px target failures | The 16-state live audit and responsive claim found no undersized target. | Closed |
| Initial immutable-cache gap | Live hashed assets carry one-year immutable caching. | Closed |
| Initial missing CSP/permissions headers | Current live response headers contain both policies. | Closed |
| Initial wrong manifest MIME | The live manifest is `application/manifest+json`. | Closed |
| V4 malformed nested import crash | The live recovery test rejected the file without replacing saved data. | Closed |
| V5 missing claims registry | All 15 registered commands ran separately; F-6-3/F-6-4 concern new omissions. | Closed as originally scoped |
| V5 missing isolated one-click demo | Fresh phone and desktop sentinel flows passed. | Closed |
| V5 first-worker reload race | The live regression observed one load and no aborted request. | Closed |
| V5 broken history and route titles | Live history/title/focus tests passed; session Back also returned in one action. | Closed |
| V5 offline CSP violation | The external offline stylesheet renders under the live CSP without errors. | Closed |
| V5 transient theme contrast | Explicit light/dark Axe scans passed. | Closed |
| V5 metadata, 404, footer, and landing gaps | App/legal/404 routes pass; F-6-1/F-6-2 newly isolate the omitted offline route. | Closed as originally scoped |
| V6 incomplete paid/backup/timing/install tests | The registered outcome tests now pass; F-6-3 identifies a separate overflow boundary. | Closed as originally scoped |
| V8-1 paid history called complete | Public paid copy says latest 20 and the 21-record paid test shows 20. | Closed |
| V9-1 malformed active-session snapshot | The exact live regression removes it and returns to usable setup. | Closed |
| F-1-1 inconsistent app/legal/404 navigation and footer | Shared navigation/footer tests pass on those routes; offline is the new F-6-1 scope. | Closed as originally scoped |
| F-1-2 incomplete sitemap | The sitemap lists all six public product routes. | Closed |
| F-1-3 jargon in the headline | The current seven-word heading names the job plainly. | Closed |
| F-1-4 sprint/session naming | Public flow copy consistently uses study session. | Closed |
| F-1-5 unclear limits heading | The live heading says **This app does not check answers**. | Closed |
| F-1-6 untested artwork promise | Visitor copy remains removed; provenance stays in the design record. | Closed |
| F-1-7 long README sentences | Current README and recorded copy audit meet the 22-word cap. | Closed |
| F-2-1 malformed active-session crash | Live malformed-state recovery passed without a page error. | Closed |
| F-2-2 unlisted free-core claim | `free-core` passed in a fresh unlicensed workspace. | Closed |
| F-2-3 unlisted scope claim | `scope-limits` passed across demo states. | Closed |
| F-2-4 missing 404 social metadata | The designed live 404 has complete metadata. | Closed |
| F-2-5 through F-2-7 README jargon | Current purchase and deployment wording is concrete. | Closed |
| F-3-1 demo data retained through legal exit | The live demo-isolation test clears both demo stores. | Closed |
| F-3-2 billing destination unregistered | `billing-destination` passed locally and live. | Closed |
| F-3-3 untested private-key promise | The sentence remains absent. | Closed |
| F-3-4 through F-3-7 vague terms | Current copy uses study session, usage reports, direct timing, and install wording. | Closed |
| F-4-1 incomplete input boundaries | The claim now proves 4/5/30/31 and all three durations. | Closed |
| F-4-2 missing light-theme contrast | Both explicit themes are scanned. | Closed |
| F-4-3 unclear token privacy | Privacy and README separate local storage from token-only verification. | Closed |
| F-4-4 missing retention-mechanics scope | The claim covers streaks, feeds, rewards, and return nudges. | Closed |
| F-4-5 unproved payment side effect | The sentence remains absent. | Closed |
| F-4-6 subjective README adjective | The wording remains removed. | Closed |
| F-4-7 unnamed saved-set action | The action includes the saved set name. | Closed |
| F-4-8 incomplete history empty state | It names the next step and links to Start. | Closed |
| F-5-1 unlisted tracker/script promise | `no-advertising-scripts` passed against requests and built assets. | Closed |

Verifications 7, 10, 11, 12, and 13 reported no defects. Their functional paths
were rerun. Their earlier PASS does not cover the new offline-route structure and
claim-inventory findings above.

## Counts

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 1 |
| **Total findings** | **4** |
| **Untested public claims** | **4** |

**Final verdict: FAIL.**
