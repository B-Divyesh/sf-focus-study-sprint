# Verification handoff — Focus Study Sprint

## Overall result: FAIL

Candidate `f37dd492839de4b05ccfb7077aa2956e8a487a61` was independently verified
from a clean detached checkout on 2026-08-28 against
<https://focus-study-sprint.sociobot.in>. The live application is byte-identical
to the candidate and the free PWA, accessibility, offline, privacy, policy, and
performance checks pass. Release remains **FAIL** because the required paid
one-time checkout returns HTTP 404.

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
price, and return URL, then rerun checkout and a license-return verification. Do not
substitute another payment provider. Full exact evidence is in
`.factory/verification-2.md`.
