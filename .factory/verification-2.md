# Independent verification 2 — FAIL

**Candidate:** `f37dd492839de4b05ccfb7077aa2956e8a487a61`  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Verdict:** **FAIL** — the deployed PWA and free study journey pass, but its required
one-time-purchase checkout is not registered and returns HTTP 404.

## Scope and method

Verified a fresh detached clone of the candidate in `/tmp/focus-study-sprint-qa.po67K8`.
The clone was clean before install. The repository has no separate lint script; its
production build runs `tsc --noEmit` before Vite.

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

`npm ci` installed 173 packages and reported zero vulnerabilities. The first test
attempt correctly reported that the repository's Playwright 1.62.1 browser revision
was absent from the preinstalled 1.58 browser path; after installing the pinned
Chromium revision, `npm test` passed: **9 Vitest assertions and 6 Playwright E2E
tests**. `npm run build` passed TypeScript and created `dist/`.

The build contains 28,470 B JavaScript (9.98 kB gzip), 22,090 B application CSS
(5.38 kB gzip), and 563 B legal CSS: all within the 200 kB JS / 50 kB CSS static
budgets. A mobile Lighthouse run against production scored **95 Performance** and
**100 Accessibility** (FCP 1.1 s, LCP 1.5 s, TBT 270 ms, CLS 0, 70 KiB transferred).

## Functional evidence

- Local E2E covered a complete five-prompt keyboard recall session, persistence,
  malformed input recovery, legal pages, 390px/desktop touch targets, and offline
  reload. All six passed.
- Independent live exercise confirmed four prompts disable Start; 31 prompts show
  “Keep this route finite: use 30 pairs or fewer”; a malformed line names the `::`
  or tab recovery; then valid sample data re-enables Start.
- On live, keyboard Enter revealed the expected answer, shortcut `1` advanced to
  Prompt 2, and confirmed early ending produced a private recap with one checked /
  one keep-practicing response. No console or page errors occurred.
- The live 1440px page has one `h1`, `main`, `lang=en`, descriptive image alt text,
  no horizontal overflow, no setup controls under 44px, and an active service-worker
  controller. At 390px it likewise has no horizontal overflow or undersized setup
  target; the visible focused control uses a 3px blue outline with 3px offset.
- Reduced-motion emulation reports 0.00001s animation/transition durations and
  `scroll-behavior: auto`. The live visual mobile review matched the supplied quiet
  field-notebook design and had no overlapping controls.
- Axe found **zero serious/critical violations** on the live app, Privacy, and Terms
  pages. The legal pages each have a title, one h1, and main landmark.

## PWA, privacy, and deployment evidence

- After an online load and saved example data, `context.setOffline(true)` showed the
  offline notice; reload retained `main` and `5 / 30 ready`. Live cache names were
  `fss-v2-shell` and `fss-v2-runtime` and IndexedDB database
  `focus-study-sprint` was present.
- The deployed SW is byte-identical to the candidate and has versioned caches,
  `clients.claim`, `SKIP_WAITING`, and the in-app update listener/toast path. It is
  served `Cache-Control: no-cache`; an actual new-version waiting-worker transition
  cannot be induced without a second deployment.
- Browser initial-load requests were same-origin only; source review found no
  analytics, beacons, third-party fonts, or CDN scripts. Local data uses localStorage
  and IndexedDB; the sole conditional external connection is the Sociobot license
  API. The deployed CSP limits it to `https://api.sociobot.in`.
- Live response checks found the strict CSP (no `unsafe-inline`),
  `frame-ancestors 'none'`, `nosniff`, restrictive Permissions-Policy, and
  `strict-origin-when-cross-origin`. Manifest is
  `application/manifest+json`; hashed JS/CSS are immutable for one year; SW is
  revalidated. No CSP console error was observed.
- Candidate/live SHA-256 values match for `index.html`, `sw.js`, manifest, JS, CSS,
  and both hero WebP assets. For example both `index.html` values are
  `7f7fb9318996a00d991ddbd9b80d0bb22ce1db522859a4e4a0bfd70d1fdf649b`.

## Defects

| Severity | Finding | Evidence / impact |
| --- | --- | --- |
| High | Production paid checkout is unavailable. | `GET https://api.sociobot.in/api/v1/products/focus-study-sprint/checkout` returned **404** with `{"error":"enabled factory product","status":404}` on 2026-08-28. The product advertises a required one-time $12 Contour unlock, so a customer cannot purchase it. The invalid-license verification endpoint correctly returned `200 {"valid":false,"reason":"invalid"}`; this isolates the failure to product registration/checkout. |

No Medium or Low defects were found in this pass.

## Required resolution and rerun

The Sociobot billing owner must register/enable the exact production product slug
`focus-study-sprint`, its $12 one-time price, and return URL. Then rerun a checkout
redirect and successful license-return/verification test. This is external to the
repository and must not be worked around by embedding another payment provider.
