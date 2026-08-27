# Build handoff — Focus Study Sprint

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
