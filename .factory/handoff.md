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

At the time of repair, `npm run test:live-contract` could not finish because the
factory-owned `https://api.sociobot.in/api/v1/products` endpoint returned HTTP 503
with its own temporary service-unavailable page (also reproduced with `curl`). This
is outside the static product and is the only incomplete check before deployment.
The source-side Contour behavior is covered by the recorded-response regression
above. Re-run this command after the catalog service recovers; it verifies the live
catalog, return URL, exact $12 price, and hosted checkout redirect without making a
purchase.

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

The static deploy command is `/opt/fleet/lib/deploy-static.sh focus-study-sprint dist`.
After deploy, verify `https://focus-study-sprint.sociobot.in`, `/demo`, `/privacy/`,
`/terms/`, offline reload, and the live billing contract. Deployment identity and
final live evidence will be appended after the repair commit is pushed and uploaded.
