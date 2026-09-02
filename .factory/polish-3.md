# Polish 3 — zero-finding closure

**Reviewed candidate:** `8649678c6157418c6090e39709a5c4ffced42b22`  
**Repaired and deployed code:** `4d5bcdfb472957f4507f4db44ede99a305947f24`  
**Live URL:** <https://focus-study-sprint.sociobot.in>

Evidence shared by the rows below:

- Clean clone `/tmp/focus-study-sprint-polish-3-clean.fkV5HY`: all 14 exact claim
  commands and `npm run test:release` passed (25 unit, 28 browser, build, and live
  billing contract).
- Live cold recheck: `/tmp/focus-study-sprint-polish-3-live.kRNGvh/live-recheck.json`.
- Screenshots: `/tmp/focus-study-sprint-polish-3-live.kRNGvh/live-root-mobile.png`,
  `/tmp/focus-study-sprint-polish-3-live.kRNGvh/live-demo-mobile.png`, and
  `/tmp/focus-study-sprint-polish-3-live.kRNGvh/screenshot-mobile.png`.

| Finding ID | Change made | Evidence: test, screenshot, live URL check |
| --- | --- | --- |
| F-1-1 | Retained the shared `Start / Library / Demo / Privacy` header and identical footer across app, demo, legal, and 404 screens. | Browser test `uses one navigation and footer set on app, demo, legal, and 404 routes`; root and demo screenshots; live `/`, `/demo`, `/privacy/`, `/terms/`, `/not-a-route`. |
| F-1-2 | Retained all six public routes in `sitemap.xml`. | Same navigation/sitemap test; live `https://focus-study-sprint.sociobot.in/sitemap.xml`. |
| F-1-3 | Retained the plain h1 `Practice recalling answers in a short session.` | `@claim:accessible-layout`; root mobile screenshot; live `/` recheck. |
| F-1-4 | Retained `study session` as the one timed-activity name. | `@claim:input-limits`; root screenshot; live `/` recheck. |
| F-1-5 | Retained the direct limit heading `This app does not check answers`. | `@claim:scope-limits`; root screenshot; live `/` recheck. |
| F-1-6 | Kept generated-art provenance in `.factory/design.md`, not in visitor copy. | Shared-footer test asserts the promise is absent; root screenshot; live `/` recheck. |
| F-1-7 | Kept README sentences below 22 words and removed learning-method jargon. | `.factory/copy-audit.md` and source audit; documentation check at repaired commit. |
| V9-1 / F-2-1 | Retained full validation and removal of malformed active-session snapshots. | Browser test `removes a malformed active-session snapshot and returns to usable setup`; live `/` recovery route check. |
| F-2-2 | Retained the registered free-core claim and a real unlicensed session/export/clear/restore proof. | `@claim:free-core`; live `/` and `/library` recheck. |
| F-2-3 | Retained the registered scope-limits claim for supplied content, self-rating, and no generation. | `@claim:scope-limits`; live demo screenshot and `/demo` recheck. |
| F-2-4 | Retained complete 404 social metadata and designed response. | Browser test `offline fallback and designed 404 render without console errors`; live `/not-a-route` is HTTP 404 with title, h1, and main. |
| F-2-5 | Retained the concrete README purchase-registration wording. | README audit; `npm run test:release` in clean clone. |
| F-2-6 | Retained plain checkout wording, then registered the remaining billing-destination promise in F-3-2. | README audit; `@claim:billing-destination`. |
| F-2-7 | Retained direct-link deployment wording. | README audit; live `/demo` and `/privacy/` both open directly. |
| F-3-1 | Added one cleanup routine that deletes `demo:fss:*` and the entire demo IndexedDB database before every in-app exit; legal pages also run the cleanup fallback for `?demo=exit`. | Expanded `@claim:demo-isolation` creates the DB, advances the demo, follows Demo → Privacy → Start, verifies both namespaces gone, then re-enters at prompt 1; demo screenshot; live `/demo` → `/privacy/` → `/` recheck. |
| F-3-2 | Added `billing-destination` to `claims.json`; verified the registered checkout destination and the sole cross-origin license-check request. | `@claim:billing-destination`; live checkout href at `/`; `npm run test:live-contract`. |
| F-3-3 | Removed the untestable README sentence about a public payment link and private keys. | Source copy audit (`rg`), README at repaired commit; no visitor-facing claim remains. |
| F-3-4 | Replaced vague `Core study` with `Study sessions` in copy and claim inventory. | `.factory/copy-audit.md`; root screenshot; live `/` recheck. |
| F-3-5 | Replaced `behavioral analytics` with `The app does not send usage reports`, including the privacy policy. | `.factory/copy-audit.md`; root screenshot; live `/` recheck. |
| F-3-6 | Split the README’s compressed timing phrase into two plain sentences. | README audit; `@claim:session-timing`. |
| F-3-7 | Replaced README `app shell` jargon with the user result: install and use offline after the first online visit. | README audit; `@claim:installable-shell` and `@claim:offline-reload`. |

The live route/Axe sweep covered `/`, `/demo`, `/library`, `/about`, `/privacy/`,
`/terms/`, and `/not-a-route`. All normal routes returned 200, each had exactly one
`h1` and one `main`, and all had zero serious or critical Axe findings. The designed
404 returned 404; its lone console line was the browser’s expected failed navigation
resource for that deliberate status.
