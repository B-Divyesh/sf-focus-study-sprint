# Repair handoff — Focus Study Sprint

## Overall result: release blocked pending factory billing registration

Candidate `f37dd492839de4b05ccfb7077aa2956e8a487a61` was independently verified
from a clean detached checkout on 2026-08-28 against
<https://focus-study-sprint.sociobot.in>. The live application is byte-identical
to the candidate and the free PWA, accessibility, offline, privacy, policy, and
performance checks pass. Release remains **FAIL** because the required paid
one-time checkout returns HTTP 404. Repository policy prohibits workers from
modifying billing infrastructure, so no substitute payment provider or misleading
workaround was added.

## Repair added in this repository

- `npm run test:release` now runs the normal tests, production build, and the exact
  live billing contract before a release can be called ready.
- A Vitest regression assertion requires that release gate and checks that its live
  contract covers the exact product slug, $12 price, catalog presence, and hosted
  checkout redirect. The network-level contract uses a manual redirect and never
  starts a payment.
- README documents the release gate. Existing product behavior is unchanged.

## Evidence

```sh
npm ci
npx playwright install chromium
npm test          # 9 Vitest + 6 Playwright pass
npm run build     # tsc --noEmit + Vite pass; dist/ produced
```

- Live 1440px and 390px checks: no console/page errors, no horizontal overflow,
  no measured setup control under 44px, visible 3px focus ring, and reduced-motion
  animation/transition durations of 0.00001s.
- Live Axe scans on app, Privacy, and Terms: zero serious/critical violations.
  Lighthouse mobile: Performance 95, Accessibility 100, LCP 1.5s, CLS 0.
- Offline reload after saving example prompts retained the shell and `5 / 30 ready`.
  Service worker controlled the page with `fss-v2-shell` / `fss-v2-runtime` caches.
- Input boundaries/recovery and live keyboard recall were exercised; the complete
  five-prompt keyboard journey, persistence, legal, responsive, and offline paths
  also pass in the local Playwright suite.
- Candidate/live SHA-256 match for HTML, SW, manifest, JS, CSS, and both hero
  assets. Strict CSP, Permissions-Policy, `nosniff`, referrer policy, correct
  manifest MIME, immutable hashed-asset caching, and updateable SW caching are live.

## Blocking defect — High

`GET https://api.sociobot.in/api/v1/products/focus-study-sprint/checkout` returned
**404** with `{"error":"enabled factory product","status":404}`. The product
advertises the $12 one-time Contour unlock, so a customer cannot purchase it. The
invalid-token verify endpoint returned the expected 200 invalid result, isolating
the blocker to checkout product registration.

The factory billing owner must register/enable the exact production slug, one-time
price, and return URL, then rerun a checkout and license-return verification. Do not
substitute another payment provider. The required configuration is:

- slug: `focus-study-sprint`
- name: `Focus Study Sprint Contour unlock`
- one-time price: USD 12.00 (`price_minor: 1200`)
- return URL: `https://focus-study-sprint.sociobot.in/`

## Repair verification — 2026-08-28 UTC

```sh
npm ci
npm test
npm run build
npm run test:live-contract
```

- `npm ci` installed 174 packages with 0 vulnerabilities.
- `npm test` passed: 10 Vitest assertions and 6 Playwright browser tests, including
  desktop and 390px controls, keyboard recall, axe serious/critical scans, legal
  landmarks, persistence, and service-worker offline reload.
- `npm run build` passed and wrote `dist/`: initial JS is 28.47 kB (9.98 kB gzip) and
  application CSS is 22.09 kB (5.38 kB gzip).
- `npm run test:live-contract` fails closed with `Production catalog is missing
  focus-study-sprint`; this is the expected unresolved external condition.
- Live `verify-url.sh` passed at HTTP 200 in 894 ms with no console errors and valid
  title/lang/h1/main/alt checks. Response checks confirmed CSP, Permissions-Policy,
  nosniff, referrer policy, manifest MIME, immutable assets, and updateable `sw.js`.
- Direct live Chromium smoke at 1440×1000 and 390×844 passed: `main` and one `h1`
  were present, there was no horizontal overflow or console error, and keyboard
  `Enter` then `2` revealed Prompt 1's answer and advanced to Prompt 2. Fresh local
  and live `index.html` SHA-256 both equal
  `7f7fb9318996a00d991ddbd9b80d0bb22ce1db522859a4e4a0bfd70d1fdf649b`.

This static repair is intentionally not deployed while the required live billing
contract remains false; deploying the unchanged app cannot resolve the release blocker.
