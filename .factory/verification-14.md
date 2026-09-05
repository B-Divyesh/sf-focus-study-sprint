# Focus Study Sprint verification 14 — practice recalling answers in short sessions

## Verdict

**PASS.** There are zero findings at every severity and zero untested public
claims.

- Candidate implementation reviewed: `30a7f5548b2d7f6a1879191efcc20be96eea7876`
- Documentation handoff commit: `a47d6a67e05dcbadd6516dacdb3393fd45ca7811`
- Live URL: <https://focus-study-sprint.sociobot.in>
- Fresh clean checkout: `/tmp/focus-study-sprint-verify14-clean`
- Reviewed: 2026-09-05 UTC

The clean checkout was pinned to the implementation commit. The later documentation
commit changes only `.factory/handoff.md`. A fresh production build matched the live
response SHA-256 for all 23 fetchable deployable files. The deployment-only
`staticwebapp.config.json` was excluded from that byte comparison.

## First screen before scrolling

Fresh browser contexts opened the live root at 390×844 and 1440×1000 without
scrolling. Both showed:

- Job: **Practice recalling answers in a short session.**
- Audience: students and self-learners who want focused practice without streaks,
  feeds, or generated lessons.
- First action: **Try it with sample data**. Its adjacent text says that it opens a
  five-prompt practice session.

The action was fully visible at 518 px on the phone and 540 px on desktop. Each
screen had `lang="en"`, one `h1`, one `main`, no horizontal overflow, and no console
or page errors. The title was “Focus Study Sprint — practice answers in short
sessions”.

## Sample sandbox

The one-click sample opened a populated five-question, five-minute biology session:
“What process do plants use to convert light into energy?” The persistent label
**Demo — sample data, nothing is saved** was visible. Reset returned the sample to
prompt 1 of 5. In separate fresh phone and desktop contexts, a real-storage
`fss:draft` sentinel stayed unchanged through sample entry, reset, and exit, and no
`demo:fss:*` key remained after exit. The dedicated live claim also verified the
demo IndexedDB database is removed on exit through Privacy and that re-entry starts
fresh.

## Claims

`npm ci` completed in the clean checkout with zero reported vulnerabilities. I ran
each of the 19 exact commands declared in `.factory/claims.json` separately; all
passed. The registry has 19 declared IDs, 19 unique `@claim:` tags, no missing tags,
no orphan tags, and no duplicated tagged test.

| Claim | Result | Observable outcome checked |
| --- | --- | --- |
| `demo-isolation` | PASS | Separate demo namespaces, reset/exit cleanup, real-data sentinel retained. |
| `input-limits` | PASS | Rejects 4 and 31; accepts 5–30; offers 5/10/20 minutes. |
| `study-flow` | PASS | Keyboard five-prompt completion and persisted recap. |
| `offline-reload` | PASS | Cached sample reloads and reveals an answer offline. |
| `local-privacy` | PASS | Study interaction sends no other-origin request. |
| `no-advertising-scripts` | PASS | Request/resource and built-artifact scan finds no trackers, remote fonts, or remote runtime scripts. |
| `json-backup` | PASS | Complete local record exports, clears, restores, and reuses. |
| `free-core` | PASS | Unlicensed real workspace completes, exports, clears, and restores. |
| `scope-limits` | PASS | Supplied prompts and self-rating only; no teaching, grading, generation, or retention mechanics. |
| `accessible-layout` | PASS | Phone/desktop action and controls fit with 44 px targets. |
| `display-preferences` | PASS | Explicit light/dark Axe checks pass and reduced motion removes movement. |
| `contour-price` | PASS | $12 one-time offer unlocks reusable sets and exactly the latest 20 records. |
| `billing-destination` | PASS | Product-scoped Sociobot checkout and token-only verification request. |
| `session-timing` | PASS | Pause retains time; expiry produces the recap. |
| `installable-shell` | PASS | Standalone manifest, icons, and controlling service worker. |
| `free-history-limit` | PASS | Unlicensed Library shows exactly the latest 3 of 21 records. |
| `history-overflow-export` | PASS | Export retains all 21 records while unlicensed view shows 3. |
| `free-accessibility` | PASS | Keyboard study flow, Axe check, and export remain free. |
| `invalid-license-lock` | PASS | Invalid, expired, revoked, and wrong-product fixtures relock paid features. |

The live landing page, demo, Library, About, Privacy, Terms, README, and conditional
license status were cross-checked against the registry. No public claim was missing,
false, incomplete, or untested.

## Clean and live checks

`npm run test:release` passed from the clean candidate checkout:

- 26/26 Vitest unit and deployment checks
- 33/33 local Playwright checks
- TypeScript check and production build with `dist/index.html`
- live catalog and hosted-checkout redirect contract

The same 33/33 Playwright checks passed against the live HTTPS URL. They exercise
normal study, malformed input and backup, poisoned older storage, in-progress and
malformed-session recovery, 4/5/30/31 boundaries, keyboard and focus behavior,
browser history, 200% text, theme/reduced-motion behavior, service-worker first
claim and update behavior, offline reload, legal routes, metadata, and the designed
404.

`/opt/fleet/lib/verify-url.sh` passed on the live root: HTTP 200, 645 ms, no console
errors, title, `lang`, one `h1`, `main`, complete image alternatives, and labelled
buttons. Axe is run through the Playwright integration on app states and legal pages;
the live suite reported no serious or critical findings. Fresh Lighthouse measured:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1.3 s |
| Total blocking time | 30 ms |
| CLS | 0 |

The built application JavaScript is 35.34 kB raw / 11.56 kB gzip and CSS is 24.82 kB
raw / 5.88 kB gzip, within the static-PWA budgets.

All public routes and assets required by the suite returned successfully, including
`/`, `/demo`, `/library`, `/about`, `/privacy/`, `/terms/`, `/offline.html`,
manifest, robots, and sitemap. `/does-not-exist` deliberately returned HTTP 404 and
the designed recovery page; this is expected behavior, not a defect. The live
headers include restrictive CSP with header-only `frame-ancestors 'none'`, HSTS,
`nosniff`, referrer policy, and permissions policy. The app is a static local-first
PWA, so backend tenant isolation, restart persistence, health, and product-server
429 checks do not apply. No purchase was attempted.

## Earlier findings

All previous review, verification, and polish findings were inspected. Their current
disposition is closed, with current regression evidence as follows:

| Earlier group | Current evidence | Disposition |
| --- | --- | --- |
| Initial/V2 checkout, 44 px targets, caching, CSP/permissions, manifest MIME | Release contract, responsive claim, live headers, and route suite pass. | Closed |
| V4 malformed nested import and V9 malformed active session | Live malformed backup and active-session recovery tests preserve a usable app. | Closed |
| V5 claims/demo/SW/history/offline-CSP/theme/metadata/404 gaps | Exact claim commands and live service-worker, route, theme, offline, and metadata tests pass. | Closed |
| V6 incomplete paid, backup, timing, and install proofs | Dedicated outcome claim tests pass locally and live. | Closed |
| V8 paid-history wording | Public copy and the 21-record test prove “latest 20,” not “full.” | Closed |
| F-1 navigation, sitemap, plain wording, terminology, provenance, README | Shared shell/sitemap tests and the current plain first screen/copy audit pass. | Closed |
| F-2 recovery, free core, scope, 404 metadata, README wording | Recovery, unlicensed flow, scope, and designed-404 regressions pass. | Closed |
| F-3 demo exit, billing/privacy claims, jargon | Demo-isolation and billing-destination claims pass; removed untestable wording remains absent. | Closed |
| F-4 bounds, themes, billing data distinction, retention mechanics, controls/empty state | Boundary, display, billing, scope, backup, and free-core claims pass. | Closed |
| F-5 unlisted tracker/script promise | Built-artifact plus request/resource claim passes locally and live. | Closed |
| Review 6 F-6-1/F-6-2 offline skeleton and metadata | Live offline shared-shell, metadata, keyboard, Axe, and 404 regression passes. | Closed |
| Review 6 F-6-3 history limit/export | New 3-of-21 and 21-record export claims pass. | Closed |
| Review 6 F-6-4 free accessibility and invalid license lifecycle | New keyboard/Axe/export and four-reason locking claims pass. | Closed |

## Findings

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Untested claims | 0 |

**Final verdict: PASS.**
