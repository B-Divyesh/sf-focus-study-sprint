# Independent verification — Focus Study Sprint

**Result: FAIL**

| Item | Value |
| --- | --- |
| Candidate | `abc94c69f912e100ac389fb4d2444ba2f7be8c0b` |
| Branch / checkout | `main`, clean before verification |
| Live URL | <https://focus-study-sprint.sociobot.in> |
| Verified | 2026-08-28 UTC |
| Scope | PWA/offline, accessibility, privacy, performance, production parity |

The candidate works for the product's core job and the live deployment is the
same artifact. It cannot be accepted because it violates the required 44px
interactive target rule and lacks immutable caching for hashed production
assets.

## Environment and automated checks

Started with `HEAD` equal to the requested candidate and a clean worktree.

```text
npm ci
  added 173 packages; audit: 0 vulnerabilities

npm test
  Vitest: 5 tests passed
  Playwright: 5 tests passed

npm run build
  tsc --noEmit passed
  vite build passed; dist/ produced
```

The first test invocation could not launch Playwright because this checkout's
`@playwright/test` is 1.62.1 while only another browser revision was initially
present. After the work-order-prescribed `npx playwright install chromium`,
the unchanged test suite passed. This was an environment prerequisite, not a
candidate defect. There is no separate lint command in `package.json`; the
production build performs the available TypeScript check.

Production output is within static budgets: initial JS is 28,457 bytes
(9.99 kB gzip), app CSS is 17,649 bytes (4.75 kB gzip), legal CSS is 447
bytes, the mobile hero is 47,956 bytes, and the desktop hero is 152,682
bytes. No fonts are shipped. An attempted fresh Lighthouse CLI run could not
attach to Chrome in this container; no inherited Lighthouse score is claimed.
The budget, browser, axe, and layout checks below were completed instead.

## Functional evidence

Local production preview and the live site were exercised at 390×844 and
1440×1000.

- The representative flow works: example prompts → begin → optional response
  → Enter reveal → `1`/`2` self-rating → recap → Library persistence after
  refresh. The repository's complete keyboard test finishes all five prompts.
- Exactly 30 valid `question :: answer` lines enable start. 31 lines disable
  it with “Keep this route finite: use 30 pairs or fewer.” A malformed line
  shows the separator instruction and recovers after valid input is restored.
- Pause changes to Resume and back; an active typed response survives reload.
- JSON export creates `focus-study-sprint-2026-08-28.json`. Invalid JSON
  displays the recovery message. A valid product-shaped JSON backup restores
  after its explicit replacement confirmation. Clear-local-data presents its
  specific confirmation; dismissal retains data.
- Local and live initial/setup, session, Library, and legal pages returned no
  console errors, page errors, or failed requests in fresh browser contexts.
- At both viewport sizes there was no horizontal overflow. Keyboard begins at
  the skip link; after a paint it is visible at top 8px with a 3px outline.
  The global 390px reduced-motion context reports a `0.01ms` route transition.
- Axe via `@axe-core/playwright` found zero serious/critical findings in local
  light setup, dark setup, session, Library, legal pages, and live setup/session.

## PWA and privacy evidence

- The live service worker controls scope `/` and has `fss-v1-shell` and
  `fss-v1-runtime` caches. After first visit, `context.setOffline(true)`,
  reload, and start of a saved five-prompt session all worked locally and live.
- Update handling was tested from a disposable copy of the exact built output:
  serving a changed worker version (`fss-v1` → `fss-v2`) produced “A fresh map
  is ready”; selecting Update app reloaded under the new controller and left
  `fss-v2-shell`/`fss-v2-runtime` caches. No console error occurred. Product
  source was not modified.
- Initial browser request capture on both local and live product routes found
  only same-origin app assets. Source review and request capture found no
  analytics, trackers, CDN fonts, or third-party scripts. Prompt data,
  sessions, and drafts use IndexedDB/local storage. The optional Sociobot
  checkout/verify endpoint is reached only through purchase/license activity.

## Deployment identity and response checks

Live SHA-256 content matched the fresh `dist/` for the root document, Privacy,
Terms, service worker, manifest, offline page, all JS/CSS, both WebPs, and all
three icons. The live main document and candidate both hash to
`05e8b32edf1fd1d239bfb0bc0b1d540127d436e4bbd380ab6ca3f0b84feb7e0e`.

Live headers include HSTS (`max-age=10886400; includeSubDomains; preload`),
`Referrer-Policy: strict-origin-when-cross-origin`, and
`X-Content-Type-Options: nosniff`. The deployment does not return
Content-Security-Policy, Permissions-Policy, or X-Frame-Options. The manifest
uses `application/octet-stream` rather than a manifest JSON MIME type.

The advertised paid-unlock link was also checked without initiating a payment:
`GET https://api.sociobot.in/api/v1/products/focus-study-sprint/checkout`
returns **HTTP 404**. This confirms the production product is not registered
with the billing endpoint (or is registered under a different slug).

## Defects

### High

1. **Advertised one-time purchase is unavailable.** The $12 Contour action
   points at a live Sociobot checkout URL that returns HTTP 404. Register the
   production product with the exact `focus-study-sprint` slug and return URL,
   then verify the checkout redirect and license return flow without making a
   real payment. This is an external configuration defect, but it makes the
   shipping paid feature nonfunctional.

### Medium

1. **44px target-size requirement is not met.** On the live 390px session,
   `Pause` is deliberately reduced to a 34px-high control
   (`src/style.css:267`). On the landing screen at 1440px, the brand link is
   173×28px, Privacy is 45×19px, and Terms is 37×19px. The factory contract
   requires every touch/click target to be at least 44×44px. Add minimum hit
   areas without reducing visual density.

2. **Hashed assets are not immutably cached in production.** `main-DZv9DmLu.js`
   and `style-l_86GeSB.css` both return
   `Cache-Control: public, must-revalidate, max-age=30`. The performance/PWA
   contract requires long-lived immutable caching for hashed assets. This is a
   host/deployment configuration defect; it is visible on the verified URL and
   must be corrected before release acceptance.

### Low

1. **Browser response hardening is incomplete.** Add a restrictive CSP and
   Permissions-Policy appropriate to the static local-first app. Consider
   `X-Frame-Options` or CSP `frame-ancestors` as well.
2. **Manifest MIME type is generic.** Serve `/manifest.webmanifest` as
   `application/manifest+json` (or `application/json`) rather than
   `application/octet-stream` for standards-compatible PWA delivery.

## Acceptance conclusion

There are no critical core-study, privacy, console, or deployment-parity
defects. The high-severity broken checkout and the medium target-size and
caching defects are acceptance failures, so the candidate is **FAIL** pending
remediation and a fresh verification.
