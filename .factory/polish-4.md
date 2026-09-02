# Polish 4 — complete cumulative closure

**Repair commit:** `865d097fd552a4ceb525d1667839633a2c0195a9`  
**Deployment:** `2da979f3-f1b7-43ff-bc20-293b176e9c4b`  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Evidence directory:** `/tmp/focus-study-sprint-polish-4-live.jfgN7K`

All 14 exact claim commands and `npm run test:release` passed from clean clone
`/tmp/focus-study-sprint-polish-4-clean.xOCULJ`. The release gate ran 25 unit
tests, 28 browser tests, lint, build, and the production billing-contract check.

| Finding ID | Change made | Evidence: test, screenshot, live URL check |
| --- | --- | --- |
| F-1-1 | Retained the shared `Start / Library / Demo / Privacy` header and identical footer on app, demo, legal, and 404 pages. | Browser test `uses one navigation and footer set`; live route sweep of `/`, `/demo`, `/privacy/`, `/terms/`, `/not-a-route`; `screenshot-mobile.png`. |
| F-1-2 | Retained every public route in `sitemap.xml`. | Browser navigation/sitemap test; live `https://focus-study-sprint.sociobot.in/sitemap.xml`. |
| F-1-3 | Retained the plain landing h1 `Practice recalling answers in a short session.` | `@claim:accessible-layout`; cold live root check; `screenshot-mobile.png`. |
| F-1-4 | Retained `study session` as the single timed-activity term. | `@claim:input-limits`; live root and demo check. |
| F-1-5 | Retained `This app does not check answers` as the named scope heading. | `@claim:scope-limits`; cold live root check. |
| F-1-6 | Kept artwork provenance in `.factory/design.md`, not visitor copy. | Shared-footer browser test; cold live root check. |
| F-1-7 | Kept README sentences within 22 words and removed learning-method jargon. | `.factory/copy-audit.md`; clean-clone documentation audit. |
| V9-1 / F-2-1 | Retained full malformed-active-snapshot validation and recovery. | Browser test `removes a malformed active-session snapshot`; live app route smoke check. |
| F-2-2 | Retained `free-core` and its real unlicensed session/export/clear/restore proof. | `@claim:free-core`; live `/library` check. |
| F-2-3 | Retained `scope-limits` for supplied content, self-rating, no grading, and no generation. | `@claim:scope-limits`; live `/demo` check. |
| F-2-4 | Retained route-specific 404 social metadata and designed response. | Browser 404 metadata test; live `/not-a-route` HTTP 404 metadata sweep. |
| F-2-5 | Retained the plain purchase-registration wording. | README audit; clean-clone `npm run test:release`. |
| F-2-6 | Kept endpoint/private-secret jargon out of visitor copy. | README audit; live purchase-control check. |
| F-2-7 | Retained direct-link deployment wording. | README audit; live `/demo` and `/privacy/` direct loads. |
| F-3-1 | Retained demo cleanup before every exit, including legal-page exits. | `@claim:demo-isolation`; live `/demo` reset/exit flow. |
| F-3-2 | Retained the registered billing-destination claim. | `@claim:billing-destination`; live recorded-license request check. |
| F-3-3 | Kept the untestable no-private-key sentence removed. | README audit; source search. |
| F-3-4 | Retained `Study sessions` instead of vague `Core study`. | `@claim:free-core`; live root fact. |
| F-3-5 | Retained `The app does not send usage reports` instead of analytics jargon. | `@claim:local-privacy`; live root check. |
| F-3-6 | Retained the split, plain timing description. | README audit; `@claim:session-timing`. |
| F-3-7 | Retained plain install/offline wording. | README audit; `@claim:installable-shell` and `@claim:offline-reload`. |
| F-4-1 | Expanded `@claim:input-limits` to reject four/31 pairs, assert `[5, 10, 20]`, select each duration, and start with exactly 30 pairs. | Exact clean-clone claim command; live `live-demo-30-prompts.png`; live `/demo?screen=setup` showed `PROMPT 1 OF 30`. |
| F-4-2 | Expanded `@claim:display-preferences` to select explicit light and dark themes and Axe-scan each before checking reduced motion. | Exact clean-clone claim command; live light/dark Axe serious/critical count 0; live root check. |
| F-4-3 | Rewrote README and Privacy copy to separate stored study data from the sole license token sent for verification; strengthened the request assertion. | `@claim:billing-destination`; live `/privacy/`; live recorded-token request contained only `license`. |
| F-4-4 | Extended `scope-limits` and its test to cover no streak/feed/reward/return-nudge mechanics and storage across every app state. | Exact clean-clone claim command; live setup/session/recap/Library/About scope sweep; `live-demo-mobile.png`. |
| F-4-5 | Removed the unprovable `It never starts a payment` sentence. | README audit and source search; clean-clone `npm run test:release`. |
| F-4-6 | Removed subjective `calm` from the README opening and PWA description. | `.factory/copy-audit.md`; README source audit. |
| F-4-7 | Replaced `Use` with `Load this prompt set` and an accessible set-specific name. | JSON backup and Contour browser regressions; `live-demo-library.png`; live demo saved-set check. |
| F-4-8 | Replaced the history empty-state sentence and added `Start a study session`. | `@claim:free-core`; `live-library-empty.png`; live `/library` check. |

The live cold route sweep found no console or page errors on normal routes. The
404's deliberate HTTP status was verified separately. Lighthouse mobile passed all
four categories at 100; its retry report is `lighthouse-mobile-retry.json`.
