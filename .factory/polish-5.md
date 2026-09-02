# Polish 5 — complete cumulative closure

**Repair commits:** `94b07802c0611df5ff7c072c4419c1f1ec6d4e1a`,
`23b8cb00f293b647c5e83db538002e2142efcae6`  
**Deployment:** `8aa68553-b47b-477e-8a81-605bb7aab98b`  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Clean clone:** `/tmp/focus-study-sprint-polish-5-final-clean.lcUjZR`  
**Live evidence:** `/tmp/focus-study-sprint-polish-5-live.Mi4Rjn`

Every one of the 15 commands in `.factory/claims.json` passed separately from the
clean clone. `npm run test:release` then passed 26 unit/deployment checks, 29
Playwright tests, TypeScript, the production build, and the live billing check.
The complete 29-test browser suite also passed against the deployed origin.

| Finding ID | Change made | Evidence: test, screenshot, live URL check |
| --- | --- | --- |
| F-1-1 | Retained the shared `Start / Library / Demo / Privacy` header and identical footer on app, demo, legal, and 404 pages. | `uses one navigation and footer set`; live 29-test suite; `live-root-mobile.png`. |
| F-1-2 | Retained all six public routes in `sitemap.xml`. | Shared-navigation/sitemap test; live `/sitemap.xml` check in the browser suite. |
| F-1-3 | Retained the plain first-screen heading, “Practice recalling answers in a short session.” | `@claim:accessible-layout`; `live-recheck.json`; `live-root-mobile.png`. |
| F-1-4 | Retained `study session` as the single name for the timed activity. | `@claim:input-limits`, `@claim:study-flow`; live root/demo suite. |
| F-1-5 | Retained the direct scope heading, “This app does not check answers.” | `@claim:scope-limits`; live root check. |
| F-1-6 | Kept generated-art provenance in `.factory/design.md`, not as an unproved footer promise. | Shared-footer test asserts the sentence is absent; live route suite. |
| F-1-7 | Kept README sentences within 22 words and removed learning-method jargon. | `.factory/copy-audit.md`; clean-clone documentation checks. |
| V9-1 / F-2-1 | Retained complete validation and removal of malformed active-session snapshots. | `removes a malformed active-session snapshot and returns to usable setup`; passed locally and live. |
| F-2-2 | Retained the registered free study-session and JSON-backup entitlement. | `@claim:free-core`; clean unlicensed workspace and live suite. |
| F-2-3 | Retained the registered teaching, grading, and generation limits. | `@claim:scope-limits`; live demo flow. |
| F-2-4 | Retained complete Open Graph and Twitter metadata on the designed 404. | `offline fallback and designed 404`; live `/not-a-route` returned 404 with complete metadata; `live-404-mobile.png`. |
| F-2-5 | Kept README purchase-registration wording concrete. | Copy audit; clean-clone `npm run test:release`. |
| F-2-6 | Kept endpoint/private-key jargon out of public copy. | Copy audit and repository search. |
| F-2-7 | Retained direct-link deployment instructions with `/demo` and `/privacy/` examples. | README audit; direct live route checks. |
| F-3-1 | Retained cleanup of `demo:fss:*` and `demo:focus-study-sprint` on every demo exit. | `@claim:demo-isolation`; `live-recheck.json` records no demo keys/database after exit while real sentinel remains. |
| F-3-2 | Retained the registered Sociobot billing destination and token-only verification. | `@claim:billing-destination`; clean and live browser suites; live billing check. |
| F-3-3 | Kept the untestable no-private-key sentence removed. | README/source audit. |
| F-3-4 | Retained “Study sessions” instead of “Core study.” | `@claim:free-core`; live first screen. |
| F-3-5 | Retained the plain “does not send usage reports” wording. | `@claim:local-privacy`; new `@claim:no-advertising-scripts`; live request log. |
| F-3-6 | Retained separate plain sentences for pausing and session endings. | `@claim:session-timing`; README audit. |
| F-3-7 | Retained plain install/offline wording instead of “app shell.” | `@claim:offline-reload`, `@claim:installable-shell`; live offline test. |
| F-4-1 | Retained tests for four/31 rejection, exact 5/10/20 durations, and a 30-prompt session. | `@claim:input-limits`; clean and live browser suites. |
| F-4-2 | Retained explicit light and dark Axe scans plus reduced-motion assertions. | `@claim:display-preferences`; live Axe suite found no serious/critical issues. |
| F-4-3 | Kept browser storage and token-only license verification as separate statements. | `@claim:billing-destination`; README and live Privacy page. |
| F-4-4 | Retained scope coverage for no streak, feed, reward, or return-nudge mechanics. | `@claim:scope-limits` across setup, session, recap, Library, and About. |
| F-4-5 | Kept the unprovable payment-side-effect sentence removed. | README audit; clean-clone release check. |
| F-4-6 | Kept the subjective “calm” adjective out of README and manifest copy. | `.factory/copy-audit.md`; source audit. |
| F-4-7 | Retained `Load this prompt set` with each set name in the accessible label. | `@claim:json-backup`, `@claim:contour-price`; live browser suite. |
| F-4-8 | Retained the history instruction and `Start a study session` action. | `@claim:free-core`; live Library state. |
| F-5-1 | Registered `no-advertising-scripts`; expanded the README wording; added a tagged test covering full request/resource logs and production HTML/CSS/JS/service-worker scans for advertising, analytics, third-party scripts, and remote fonts. | Exact `@claim:no-advertising-scripts` command passed from the clean clone and live origin; `live-browser-suite-final.log`; live cross-origin request list is empty in `live-recheck.json`. |

## Final evidence

- `/opt/fleet/lib/verify-url.sh` passed on the cold live root with no console errors,
  one `h1`, one `main`, `lang="en"`, complete alt text, and a 765 ms load.
- Live `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/` returned 200.
  `/not-a-route` returned the designed 404. Every route had one `h1`, one `main`,
  description, canonical, Open Graph, and Twitter metadata.
- Live first-screen mobile evidence is `live-root-mobile.png`: the primary action is
  350×50.8 px, ends at 518 px, and the 390 px page has no horizontal overflow.
- Live demo evidence is `live-demo-mobile.png`: `?demo=1` canonicalizes to `/demo`,
  starts at prompt 1 of 5, shows the persistent banner, and preserves real data.
- Playwright Axe integration found zero serious or critical findings across app,
  demo, legal, 404, light, and dark states. The live 200% text test passed under the
  deployed CSP.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.30 s, CLS 0, and total blocking time 18 ms. Report:
  `lighthouse-mobile.json`.
- The production bundle is 35.34 kB JavaScript raw / 11.56 kB gzip and 24.82 kB CSS
  raw / 5.88 kB gzip. The mobile hero is 47.96 kB.
- Live headers retain the restrictive CSP, header-only `frame-ancestors 'none'`,
  HSTS, `nosniff`, referrer policy, permissions policy, correct manifest MIME type,
  and `no-cache` for `sw.js`. The active shell is `fss-v12`.

No finding from reviews 1–5 remains open.
