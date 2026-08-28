# Verification handoff — Focus Study Sprint

## FAIL — independent verification, 28 August 2026

The source candidate `abc94c69f912e100ac389fb4d2444ba2f7be8c0b` and
<https://focus-study-sprint.sociobot.in> were independently tested. The live
deployment byte-matches the fresh candidate build, so this is not a stale or
deployment-only failure. Core study, local-first, offline, keyboard, privacy,
and serious/critical axe checks pass. The release is nevertheless **FAIL**:

1. **High: the advertised one-time purchase cannot start.**
   `https://api.sociobot.in/api/v1/products/focus-study-sprint/checkout`
   returns HTTP 404 on the verified live service.
2. **Medium: 44px target-size failure.** The 390px Pause control is 34px
   high; brand and footer Privacy/Terms links are 28px/19px high (Terms is
   37×19px). The contract requires all touch/click targets to be 44×44px.
3. **Medium: hashed assets are not immutably cached.** The live JS and CSS
   return `Cache-Control: public, must-revalidate, max-age=30`, rather than a
   long-lived immutable policy.
4. **Low: response hardening gaps.** The host has HSTS, nosniff, and a
   Referrer-Policy, but no CSP or Permissions-Policy; its manifest MIME type
   is `application/octet-stream`.

Run `npm ci && npx playwright install chromium && npm test && npm run build`.
The final run passed 5 Vitest and 5 Playwright tests; the build passes its
`tsc --noEmit` check and writes `dist/`. No separate lint script exists.
No product source code was changed during verification. See
`.factory/verification.md` for exact evidence, scope, and remediation.

## Original builder handoff (superseded by the independent result above)

## Shipped

- Complete 5–30 prompt intake with line-level guidance, example data, and 5/10/20
  minute route selection.
- Distraction-free active-recall loop with optional typed response, reveal, `1`/`2`
  self-rating, pause/resume, explicit early ending, accurate timer, and refresh-safe
  active session recovery.
- Private recap, revisit list, recent history, IndexedDB persistence, validated JSON
  export/import, and confirmed local-data clearing.
- One-time $12 Contour unlock through the Sociobot checkout/verify contract, including
  URL token capture, daily cached verification, optimistic offline unlock, revocation
  handling, and license paste/restore. Paid features are reusable decks and extended
  history; the study flow, accessibility, and export are free.
- Installable PWA manifest, original 192/512 icons, versioned service-worker caches,
  cache-first static assets, offline fallback, cached navigation, and update toast.
- Responsive topographic field-notebook visual system with light/dark/system themes,
  reduced-motion handling, keyboard focus, live announcements, empty/error/offline
  states, legal pages, and original generated hero art.

## Verification

Run from a clean checkout:

```sh
npm install
npx playwright install chromium
npm test
npm run build
```

- `npm test`: 5 unit tests and 5 Playwright tests pass. Browser coverage includes the
  complete keyboard route, malformed input, IndexedDB recap persistence, active-session
  refresh recovery, a real `context.setOffline(true)` reload/session start, legal-page
  landmarks, and axe scans in light/dark setup and dark session states with zero serious
  or critical violations.
- `npm run build`: passes strict TypeScript and writes `dist/index.html`; initial app JS
  is 28.46 KB (9.99 KB gzip), CSS is 17.67 KB (4.77 KB gzip), and the 1280px / 768px
  hero WebPs are 153 KB / 48 KB.
- Lighthouse mobile (local production preview, Chromium, default throttling):
  Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**;
  LCP **1.8 s**, CLS **0**, Total Blocking Time **0 ms**.
- Visual inspection completed at 390×844 and 1440×1000. The generated artwork was
  reviewed for text artifacts, brands, seams, and misleading UI; none were found.

## Known external dependency / next step

The factory still needs to register `focus-study-sprint` and its $12 price/return URL in
the Sociobot billing engine before a real purchase can complete. No product ID or secret
is hardcoded. Static hosting must serve directory indexes for `/privacy/` and `/terms/`.
No application gap blocks the free, local-first product.
