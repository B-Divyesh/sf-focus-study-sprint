# Repair 6 handoff — Focus Study Sprint

## Result

This repair resolves every release-blocking finding in independent verification 6
(`5200669`, candidate `bd8354a`). The original offline PWA, local-first study
flow, demo sandbox, JSON ownership, privacy model, and Sociobot billing integration
are unchanged.

## What changed

- Expanded `@claim:contour-price` from a sales-copy/link assertion into a recorded
  valid-license journey. It verifies the exact $12 checkout target, saves and
  reuses a five-prompt set, imports 21 records, and observes exactly the newest 20.
- Expanded `@claim:json-backup` to export, clear, restore, and reuse a saved
  five-prompt set as well as a session record. The downloaded JSON must contain the
  deck before it can restore it.
- Registered the previously unregistered pause/timer behavior as
  `@claim:session-timing`. A Playwright-controlled clock proves pause preserves
  time, then a resumed five-minute session produces the time-ended recap.
- Registered the previously unregistered installability promise as
  `@claim:installable-shell`. It opens the isolated demo, inspects the standalone
  manifest/icons, and requires the product service worker to be active and control
  the page.

The claim registry now has 11 uniquely tagged, independently runnable browser
regressions. The Contour license uses a recorded `{ "valid": true, "reason": "ok" }`
Sociobot verify response; tests never contact or spend against a real license.

## Verification evidence

Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`.

```text
npm ci                         PASS — 174 packages, 0 vulnerabilities
npm test                       PASS — 18 Vitest + 23 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — dist/index.html produced
npm run test:release           PASS — full local gate, including live billing contract
each of 11 claims.json tests   PASS — run separately, one tagged test each
```

Browser coverage includes a full keyboard five-prompt recall → recap → persisted
Library journey; desktop `1440×1000`; mobile `390×844`; 200% text; skip-link/dialog
focus; dark/reduced-motion treatment; malformed input/import recovery; and demo
storage isolation. The Playwright axe integration found no serious or critical
findings across the app, demo, session, recap, Library, About, legal, and 404
screens. The standalone axe CLI was also attempted, but its bundled ChromeDriver
only supports Chrome 152 while the supplied Playwright Chromium is 145; the
Playwright axe scan is the successful accessibility evidence for this environment.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174` passed: HTTP 200 in 593 ms,
correct title/lang, one h1/main, no missing image alt, no unlabeled buttons, and no
browser console errors. The local Static Web Apps emulator returned the intended
restrictive CSP, `nosniff`, referrer and permissions policies, `no-cache` worker,
one-year immutable hashed assets, and a designed HTTP 404 for an unknown route.

The dedicated offline claim passed in its own browser context after a first online
visit. A disposable v6→v7 service-worker check displayed **An app update is ready**,
reloaded once after **Update app**, retained one main landmark, and replaced v6
caches with v7 caches without console errors.

Local Lighthouse against the production `dist/` through the Static Web Apps
emulator: Performance **99**, Accessibility **100**, Best Practices **100**, SEO
**100**; FCP 1.2 s, LCP 1.9 s, TBT 0 ms, CLS 0. Production assets remain within
budget: initial JavaScript 34.66 kB raw / 11.47 kB gzip and CSS 24.66 kB raw /
5.86 kB gzip. There is no library, CLI, or backend consumer package to test.

## Live external contract

`npm run test:live-contract` now passes. It verified the factory catalog entry, the
exact $12 price and return URL, and the hosted Sociobot/Dodo checkout redirect without
making a purchase. The catalog did briefly return its own HTTP 503 page during the
first two attempts; a later retry after deployment passed without product changes.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

Open `/demo` for the isolated one-click sample. The registry at
`.factory/claims.json` lists every public, testable promise and its exact command.

## Deployment

Repair commit `3754055` was pushed to `origin/main` and deployed as Azure Static Web
Apps deployment `a7bfb289-0acd-4ccc-98d4-fbc7eb077d42` on `sf-focus-study-sprint`
in `eastus2`. <https://focus-study-sprint.sociobot.in> returned HTTPS 200.

All 21 shipped `dist/` files, excluding deployment-only
`staticwebapp.config.json`, match the live custom-domain responses byte-for-byte.
The root SHA-256 is
`0a04f396cd17b5a21937caa92bb9dde8db97fdeb324c5b750e7f900143e94bd7`.

`verify-url.sh` passed against the public site in 812 ms. Live desktop `1440×1000`
and mobile `390×844` browsers had zero console errors and zero serious/critical axe
findings. The mobile keyboard flow completed and persisted five prompts; its study
journey made zero cross-origin requests. A dedicated live browser context reloaded
`/demo` offline after its first visit and revealed the cached answer successfully.
Live root, worker, and manifest headers have the expected restrictive CSP, HSTS,
`nosniff`, strict referrer policy, permissions policy, HTML revalidation, immutable
hashed assets, `sw.js: no-cache`, and `application/manifest+json` MIME type.

No known product-code gap remains.
