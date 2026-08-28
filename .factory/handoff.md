# Repair handoff — Focus Study Sprint

## Deployment

- Repaired, committed, pushed, and deployed to
  <https://focus-study-sprint.sociobot.in>.
- Repair commits: `3660b3e`, `c3301e6`, and `fe9f98a`.
- Static deployment: Azure Static Web Apps, `dist/` root, deployment id
  `c0c42b97-dd08-459b-89c3-19362bd68c6a` for the CSP-compatible artifact,
  followed by the `fss-v2` PWA update deployment.

## What was repaired

1. The 390px Pause control no longer has a 34px mobile override. It and all
   landing-page controls now measure at least 44px high/wide.
2. The brand and footer links have 44px hit areas without changing their visual
   hierarchy. Legal contact/return links now have the same reliable hit area.
3. `public/staticwebapp.config.json` now makes Vite's hashed `/assets/*`
   immutable for one year, while keeping `sw.js` revalidatable. It also adds a
   restrictive CSP, `frame-ancestors 'none'`, a restrictive Permissions-Policy,
   nosniff, and referrer policy.
4. The host now serves `manifest.webmanifest` as
   `application/manifest+json`; the initial deployment showed that a route
   response header could not override SWA's MIME mapping, so the repair uses
   SWA's `mimeTypes` configuration instead.
5. The CSP initially surfaced the existing inline route-progress width as a
   browser console error. The progress fill now uses bounded CSS progress
   classes, not an inline style; the CSP remains strict (no `unsafe-inline`).
6. The PWA cache namespace and manifest start URL are now `fss-v2` / `?v=2`,
   so clients receive the repaired app through the existing update toast.

## Regression coverage

- `src/deployment.test.ts` checks immutable asset caching, updateable service
  worker caching, MIME configuration, CSP/Permissions-Policy requirements,
  lack of inline-style dependence, and the PWA version.
- `tests/app.spec.ts` measures every visible setup control at both 390×844 and
  1440×1000 and specifically asserts a 44px Pause target in a real session.
- Existing complete keyboard recall, malformed input, persistence, offline,
  legal-page, and axe coverage remains intact.

## Verification evidence

Executed from a clean dependency install:

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

- `npm test`: **9 Vitest assertions** and **6 Playwright tests** pass.
- `npm run build`: TypeScript check passes and writes `dist/`.
  Final initial JS is 28,470 bytes (9.98 kB gzip); app CSS is 22,090 bytes
  (5.38 kB gzip); legal CSS is 563 bytes. Both remain within the static budget.
- Live desktop (1440×1000) and mobile (390×844): no console/page errors, no
  horizontal overflow, no visible control under 44px, and zero serious/critical
  axe findings. The live browser also completed the normal keyboard recall
  session; route requests were same-origin only.
- Live offline smoke: after first load and saved example data,
  `context.setOffline(true)` followed by reload retained the app shell and
  `5 / 30 ready`; active caches were `fss-v2-shell` and `fss-v2-runtime`.
- Live responses: JS/CSS return
  `Cache-Control: public, max-age=31536000, immutable`; manifest returns
  `Content-Type: application/manifest+json`; CSP, Permissions-Policy,
  Referrer-Policy, and nosniff are present. `verify-url.sh` found title/lang,
  one h1, main, alt text, and zero browser errors.
- Deployment identity: final local and live `index.html` SHA-256 both equal
  `7f7fb9318996a00d991ddbd9b80d0bb22ce1db522859a4e4a0bfd70d1fdf649b`.
- A fresh Lighthouse CLI attempt still cannot attach to Chrome in this
  container (`Unable to connect to Chrome`), so no Lighthouse score is claimed.
  The size budgets, browser checks, and axe scans above completed successfully.

## Remaining release blocker outside this repository

The billed product is still not registered by the Sociobot billing service:

```text
GET https://api.sociobot.in/api/v1/products/focus-study-sprint/checkout -> 404
```

The repository contract explicitly prohibits workers from changing billing.
The app deliberately retains the researched one-time $12 Contour flow rather
than hiding or changing that product behavior. The factory billing owner must
register the exact `focus-study-sprint` production slug, price, and return URL,
then verify checkout redirect and a license return; that is the sole unresolved
independent-verifier high finding.
