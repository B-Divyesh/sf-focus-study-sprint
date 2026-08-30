# Repair 5 handoff — Focus Study Sprint

## Result

All release-blocking and additional findings from independent verification 5
(`d52e053`, candidate `f99823e`) are repaired. The researched brief, offline PWA
artifact class, free study flow, local persistence, import/export, and Sociobot
billing integration remain intact.

## What changed

- Added `.factory/claims.json` with nine public claims. Every entry maps to one
  unique `@claim:<id>` Playwright regression, and every command passes alone.
- Added a true one-click `/demo` and `/?demo=1` sandbox. It opens a five-prompt
  session, shows the persistent required banner, and provides **Reset demo** and
  **Start for real**. Demo data uses `demo:fss:*` localStorage keys and the
  `demo:focus-study-sprint` IndexedDB database; real-data sentinels are preserved.
- Rebuilt the cold first screen around the direct job headline “Run a short
  active-recall study session.” It names students and self-learners and puts the
  demo action above the fold at 390×844. Added How it works, privacy/non-goal, and
  exact $12 one-time purchase sections.
- Replaced the header wordmark h1 with text and gave every app state exactly one
  task-specific h1. Added real `/library`, `/about`, `/session`, and `/recap`
  history routes, `pushState`, back/forward restoration, route titles, canonical
  updates, h1 focus, and a route-change live announcement.
- Stopped the service worker from reloading on its first claim. Only a user-approved
  update now reloads. The v6 worker discovers Vite’s hashed shell assets during
  install and uses `ignoreVary` for offline module/CSS matches, so the first online
  visit is sufficient without a second navigation.
- Moved offline fallback styles into `/offline.css`, keeping the restrictive CSP
  without `unsafe-inline`. Added a designed `404.html`; Static Web Apps rewrites
  only known app routes and returns the 404 page with status 404 for unknown paths.
- Removed the theme-render race and opacity-based contrast transients. Reduced
  motion now removes animation and transition entirely; ten immediate dark-mode axe
  scans pass. The prompt card retains directional transform motion in normal mode.
- Added canonical, Open Graph, Twitter card, social image, apple-touch icon, footer
  factory/build identity, route sitemap entry, demo docs, and the required copy
  audit. The 1200×630 social image derives from the existing original hero source.

## Exact regression coverage

`tests/app.spec.ts` covers the demo/real sentinel boundary, reset/exit cleanup,
5–30 limits, all duration choices, same-origin request logging, keyboard completion,
JSON export/clear/import, malformed and poisoned data recovery, first-visit offline
reload, first service-worker claim stability, legal metadata, social image dimensions,
settled axe scans across setup/session/recap/Library/About/legal/404, skip-link and
dialog focus, 44px controls, 390px layout, 200% text, ten immediate dark switches,
reduced motion, browser history/title/focus, offline fallback styling, 404 UI, and
the exact billing link/copy. `src/deployment.test.ts` covers CSP, cache policy,
route rewrites/404 status configuration, worker/manifest versioning, offline external
CSS, claim/tag uniqueness, and the mandatory live billing gate.

## Verification evidence

Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`.

```text
npm ci
  added 174 packages; audited 175; 0 vulnerabilities

npm run test:release
  Vitest: 18/18 passed
  Playwright: 21/21 passed
  tsc --noEmit: passed
  Vite production build: passed; dist/index.html produced
  live Sociobot catalog + checkout redirect contract: passed

all nine .factory/claims.json commands
  demo-isolation, input-limits, study-flow, offline-reload, local-privacy,
  json-backup, accessible-layout, display-preferences, contour-price: PASS
```

Production assets remain well under budget:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| Initial JavaScript | 34.66 kB | 11.47 kB |
| Application CSS | 24.66 kB | 5.86 kB |
| Legal CSS | 0.56 kB | 0.30 kB |
| Mobile hero | 47,956 B | — |
| Desktop hero | 152,682 B | — |
| Social image | 211,961 B | — |
| Fonts | 0 B | — |

Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
SEO 100; FCP 0.9 s, LCP 1.8 s, TBT 0 ms, CLS 0, initial transfer 72 KiB.

The Static Web Apps emulator returned 200 for `/`, `/demo`, `/library`, `/about`,
Privacy, Terms, and `/offline.html`; an unknown route returned the designed page with
HTTP 404. CSP, HSTS, Permissions-Policy, `nosniff`, referrer policy, immutable asset
caching, and `sw.js: no-cache` were present. A disposable v6→v7 worker test showed
the update notice, reloaded exactly once after **Update app**, retained one main
landmark, replaced v6 caches with v7 shell/runtime caches, and logged no errors.

## Run and verify

```sh
npm ci
npm run test:release
npm run dev
```

Open `/demo` for the isolated verifier entry point. Use `swa start dist` to exercise
the production route and response policy locally.

## Known gaps and next steps

No product-code gap is known. Deployment and byte-identity/live response checks are
the remaining work-order steps; their exact evidence will be appended after upload.
