# Focus Study Sprint — repair 8 handoff

## Result

**PASS.** Repair 8 closes all four review 6 findings and registers every resulting
visitor promise as an independently runnable browser claim.

- Implementation commit: `30a7f5548b2d7f6a1879191efcc20be96eea7876`
- Previous reviewed documentation commit: `018d2b8e2660e76969e680992c98b1da741943f1`
- Deployed implementation: `30a7f55`
- Azure deployment: `09e32c4c-a86e-4c9e-9942-ef1aeae4a82b`
- Live product: <https://focus-study-sprint.sociobot.in>
- Version/build label: `v1.1.6 · repair-8`

## What changed

1. `/offline.html` now has the same skip link, product header, four-link primary
   navigation, and footer as the app, demo, legal, and 404 pages. Its external
   stylesheet keeps the field-notebook palette, visible focus, 44 px targets,
   dark treatment, and reduced-motion behavior without violating the CSP.
2. The offline page now has its own canonical URL, product Open Graph and Twitter
   metadata, SVG favicon, Apple touch icon, and social image.
3. The claim registry now records two observable history outcomes:
   unlicensed Library shows exactly the latest three of 21 dated records, and JSON
   export contains all 21 even when only three are visible.
4. The Terms promises now have outcome tests. An unlicensed workspace completes a
   five-prompt keyboard flow, passes serious/critical Axe checks, and exports data
   without a license request. Each recorded invalid, expired, revoked, and
   wrong-product verification result begins optimistically unlocked, then removes
   saved sets and extended history and shows the inactive-license notice.
5. The service-worker cache version and manifest start URL moved from v12 to v13,
   so installed clients receive the repaired offline fallback. Product build labels
   and package metadata moved to 1.1.6.

## Verification

From the documented clean checkout at
`/tmp/focus-study-sprint-repair8-clean`:

```sh
npm ci
npm run test:release
```

The clean clone resolved to the implementation commit above. `npm ci` reported no
vulnerabilities. Every one of the 19 exact commands in `.factory/claims.json` ran
separately and passed. The release gate passed 26 Vitest/deployment checks, 33
local Playwright checks, TypeScript, the production build, and the live Sociobot
catalog/checkout redirect check.

The same 33 Playwright checks passed against the deployed HTTPS origin. They include
the normal, invalid, boundary, recovery, keyboard, focus, reduced-motion, 200% text,
offline, legal, 404, demo-isolation, billing-fixture, and new history/license paths.
The offline fallback regression verifies its navigation, footer, skip link, metadata,
icons, serious/critical Axe result, and no console errors.

`/opt/fleet/lib/verify-url.sh` checked the cold live root in 901 ms: HTTP 200, no
console errors, title, `lang="en"`, one h1, main landmark, and complete image
alternatives. A fresh phone (390×844) and desktop (1440×1000) check both found, before
scrolling:

- Job: **Practice recalling answers in a short session.**
- Audience: students and self-learners who want focused practice without streaks,
  feeds, or generated lessons.
- First action: **Try it with sample data**.
- Result after clicking: **Opens a five-prompt practice session.**

On both sizes the action ended within the viewport (518 px phone; 540 px desktop),
there was no horizontal overflow or console error, the sample opened at prompt 1 of
5 with the persistent **Demo — sample data, nothing is saved** label, Reset returned
to prompt 1, and Start for real retained a separate real-data sentinel.

Live SHA-256 comparison covered all 23 deployable files except the deployment-only
configuration file: **0 mismatches**. `/`, `/demo`, `/library`, `/about`, `/privacy/`,
`/terms/`, and `/offline.html` return 200. `/does-not-exist` deliberately returns the
designed 404 with a title and recovery actions. The live headers retain restrictive
CSP, header-only `frame-ancestors 'none'`, `nosniff`, referrer policy, and permissions
policy.

Lighthouse against the deployed root measured:

| Category or metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1.29 s |
| Total blocking time | 149 ms |
| CLS | 0 |

The production app bundle is 35.34 kB raw / 11.56 kB gzip. CSS is 24.82 kB raw /
5.88 kB gzip. The initial static-app budgets remain satisfied.

Evidence is under `/work/.evidence/repair-8/`. The required catalog description is
verb-first, 51 characters, and copied to `/work/.evidence/catalog-description.txt`.

## Earlier finding disposition

| Earlier findings | Current disposition and proof |
| --- | --- |
| Initial verification: billing registration, target size, caching, CSP/permissions, manifest MIME | Closed. The live billing contract passes; responsive claim and live suite pass; immutable assets, restrictive headers, and manifest MIME remain in `staticwebapp.config.json`. |
| V4/V9 malformed import and active-session recovery | Closed. Unit and browser recovery tests reject poisoned data and retain usable recovery controls without page errors. |
| F-1 navigation/footer, sitemap, plain wording, terminology, provenance, README copy | Closed. Shared shell test, sitemap check, copy audit, and route tests pass. Provenance remains in the design record rather than public promise copy. |
| F-2 free core/scope claims, 404 metadata, README wording | Closed. Registered claim tests cover unlicensed study/export, supplied-content limits, and designed 404 metadata. |
| F-3 demo exit, billing-destination claim, privacy wording | Closed. Demo-isolation clears demo namespaces on legal exits; billing route/token test and local privacy test pass. |
| F-4 boundary, themes, billing data distinction, retention mechanics, named controls | Closed. The browser suite exercises 4/5/30/31 bounds, both themes/Axe, token-only verification, no retention mechanics, and recovery labels. |
| F-5 unlisted tracker promise | Closed. The registered production-artifact and runtime request scan passes locally and live. |
| F-6-1/F-6-2 offline skeleton and metadata | Closed by the new offline shared-shell/metadata/Axe regression and live 33-test suite. |
| F-6-3 three-record history and 21-record export | Closed by `free-history-limit` and `history-overflow-export`, each importing 21 records and inspecting visible/downloaded outcomes. |
| F-6-4 free accessibility and invalid-license lifecycle | Closed by `free-accessibility` and `invalid-license-lock`, including all four named verification reasons. |

## Product boundaries and known gaps

No repair-scope gaps remain. This is a static local-first PWA: it has no product
backend, shared database, tenant boundary, health endpoint, restart persistence, or
product-server rate limit to test. Study data remains in browser storage. The live
one-time Contour offer is registered at $12, its checkout redirect and catalog entry
pass the release check, and no payment was attempted. No external AI feature is
appropriate because the brief explicitly excludes generated lessons.

## Useful commands

```sh
npm ci
npm run test:unit
npm run test:e2e
npm run build
npm run test:release
PLAYWRIGHT_BASE_URL=https://focus-study-sprint.sociobot.in npm run test:e2e
```
