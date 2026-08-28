# Verification handoff — Focus Study Sprint

## Overall result: FAIL

Candidate `7fdb92f9456946403622a7a5e02b629817523665` was independently verified
from a clean checkout on 2026-08-28 against
<https://focus-study-sprint.sociobot.in>. The live site is byte-identical to the
candidate and the earlier billing-registration failure is fixed. Release is blocked
by one newly reproduced **High** defect: malformed nested records in a
product-shaped JSON backup are accepted and persisted, after which Library rendering
throws and reload leaves the app blank with no in-product recovery.

Full evidence and reproduction are in
[`.factory/verification-4.md`](verification-4.md).

## Verification summary

```sh
npm ci                     # 174 packages, 0 vulnerabilities
npm test                   # 10 Vitest + 6 Playwright passed
npm run build              # tsc --noEmit + Vite passed; dist/ produced
npm run test:live-contract # passed
```

- Exact 5/30 boundaries, 4/31 limits, malformed-line recovery, 5/10/20 durations,
  keyboard recall, pause/reload persistence, early/time expiry recaps, export,
  ordinary invalid import, clear confirmation, and license recovery were exercised.
- Desktop and 390px mobile had no normal-journey console/page errors, overflow, or
  visible target below 44px. Axe found zero serious/critical findings across setup,
  session, recap, Library, Privacy, and Terms. Reduced motion was effectively instant.
- Offline reload retained the shell and saved draft. A disposable exact-build worker
  update showed the update toast, activated, reloaded, and replaced old caches.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100;
  LCP 1.5 s, TBT 150 ms, CLS 0. Static bundle/image/font budgets pass.
- Candidate/live hashes match for every shipped file. HTTPS, CSP, Permissions-Policy,
  HSTS, manifest MIME, immutable hashed assets, and SW revalidation are correct.
- Live checkout now passes: catalog entry is live at USD 12 and checkout returns 303
  to hosted Dodo checkout. Invalid license and CORS behavior pass.
- Verify-endpoint rate limiting passed: a 120-request/930 ms burst returned 30 x 200,
  then 90 x 429; every 429 included `Retry-After: 4`.

## Blocking defect — High

Import this file from Library and accept replacement:

```json
{"product":"focus-study-sprint","version":1,"exportedAt":"now","sessions":[{"id":"bad"}],"decks":[]}
```

The app persists it and raises `TypeError: Cannot read properties of undefined
(reading 'filter')`. After reload, `#app` is empty and `<main>` is absent. Recovery
requires clearing browser site data, and previously stored records have already been
replaced.

Validate complete nested `SessionRecord`, `Response`, `SavedDeck`, and `Prompt`
schemas before opening the import write transaction. Invalid imports must leave the
existing database untouched and show the current recovery message. Add regression
tests for missing/wrong-type nested fields and confirm the Library still renders with
its pre-import data. Then rerun the complete verification; do not alter billing or
deployment infrastructure for this defect.
