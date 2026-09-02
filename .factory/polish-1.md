# Polish 1 — review finding closure

**Candidate repaired:** `526c2ccabb54ddba94a624eb65ff6c1e066e7516`  
**Review closed:** `3d41066f67fd382d13bd9f7fdd8bb75868c0f6c4`  
**Deployed app revision:** `4f43c97839f1e7e6cf7065399c238e6464dffd50`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Made the app, demo, legal pages, and 404 use `Start / Library / Demo / Privacy`; made the footer text and links identical; moved About to that footer. | Browser test `uses one navigation and footer set on app, demo, legal, and 404 routes`; live cold checks of `/`, `/demo`, `/privacy/`, `/terms/`, and `/not-a-route`; `/tmp/focus-study-sprint-live-mobile.png`. |
| F-1-2 | Added `/library` and `/about` to `public/sitemap.xml`. | Browser navigation/sitemap regression test; live `https://focus-study-sprint.sociobot.in/sitemap.xml` lists all six public routes. |
| F-1-3 | Rewrote the landing h1 to “Practice recalling answers in a short session.” and removed public `active-recall` wording. | `@claim:accessible-layout`; live cold root title and h1 check; `/tmp/focus-study-sprint-live-mobile.png`. |
| F-1-4 | Standardized the timed activity on “study session”: `Start study session`, `Complete a study session in three steps`, and `Start another study session`. | `@claim:input-limits`; browser landing metadata test; live root check. |
| F-1-5 | Replaced the vague limits label and heading with `WHAT THIS APP DOES NOT DO` and `This app does not check answers`. | Browser landing metadata test; live root check. |
| F-1-6 | Removed the untestable public artwork-provenance sentence from the footer. Provenance remains documented in `.factory/design.md`. | Shared-footer browser test asserts that the sentence is absent; live route checks. |
| F-1-7 | Rewrote the three overlong README passages into short plain-language sentences and removed the unexplained term. Updated `.factory/copy-audit.md`. | Manual 22-word audit in `.factory/copy-audit.md`; repository copy search; clean-clone test/build run. |

## Verification evidence

- Clean clone `/tmp/focus-study-sprint-final.Ux0GJ9` at `4f43c97`: `npm ci`, `npm test` (18 unit + 24 browser tests), and `npm run build` all passed; `dist/index.html` exists.
- Every listed claim command was separately run from clean clone `/tmp/focus-study-sprint-clean-current.WG5BHE` before the final PWA cache-version-only bump; all eleven passed. The final clean clone additionally runs every tagged claim inside `npm test`, including `@claim:installable-shell` after that bump.
- Local final checks: `npm test`, `npm run build`, and `npm run test:live-contract` passed.
- Live cold browser check: `/`, `/demo`, `/library`, `/about`, `/privacy/`, `/terms/` returned 200 with their expected titles, one h1, one main, and no console/page errors. `/not-a-route` returns the designed 404 with status 404 (the browser reports the expected failed navigation resource for that deliberate 404).
- Live axe serious/critical findings: none on `/`, `/demo`, `/privacy/`, or `/terms/`.
- Live Lighthouse (mobile): performance 100, accessibility 100, best practices 100, SEO 100. Report: `/tmp/focus-study-sprint-lighthouse.json`.
- Screenshots: `/tmp/focus-study-sprint-live-mobile.png`, `/tmp/focus-study-sprint-live-demo-mobile.png`.
