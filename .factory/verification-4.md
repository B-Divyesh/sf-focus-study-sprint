# Independent verification 4 — FAIL

**Candidate:** `7fdb92f9456946403622a7a5e02b629817523665`

**Live URL:** <https://focus-study-sprint.sociobot.in>

**Verified:** 2026-08-28 UTC

**Verdict:** **FAIL** — the deployed candidate passes its normal study journey,
deployment, billing, PWA, accessibility, privacy, policy, and performance checks, but
a malformed product-shaped import is accepted into IndexedDB and leaves the app
persistently blank after reload.

## Clean checkout and repository gates

Verification started with a clean `main` checkout at exactly the requested commit;
`origin/main` also resolved to that commit. No product source was changed.

```text
node --version             v22.23.2
npm --version              10.9.8
npm ci                     174 packages; 0 vulnerabilities
npm test                   10 Vitest assertions + 6 Playwright tests passed
npm run build              tsc --noEmit + Vite passed; dist/ produced
npm run test:live-contract passed
```

There is no separate lint script. The production build is the repository's available
type check and exact build. The clean output contains 28,471 B initial JavaScript
(9.98 kB gzip), 22,087 B app CSS (5.38 kB gzip), 563 B legal CSS, no fonts, a
47,956 B mobile hero, and a 152,682 B desktop hero. These meet the 200 kB JS,
50 kB CSS, 120 kB font, and 300 kB mobile-image budgets.

## Functional and invalid-input evidence

The local production preview and live deployment were exercised in fresh Chromium
contexts at 1440x1000 and 390x844.

- Exact 5- and 30-pair inputs enabled Start; a 30-pair route opened at `PROMPT 1 OF
  30`. Four pairs produced `Add 1 more pair to begin.` and disabled Start. Thirty-one
  produced `Keep this route finite: use 30 pairs or fewer.` and disabled Start.
- A line without a supported separator produced the explicit `::`/tab recovery
  message. Restoring five valid pairs cleared the error and re-enabled Start. Literal
  `<img ...>` prompt text remained text and created no DOM image or script execution.
- All 5/10/20-minute controls selected correctly. A 20-minute route began at `20:00`.
  A typed response survived reload, Pause froze the timer, Resume restarted it,
  Enter revealed the expected answer, and keyboard shortcut `2` advanced to Prompt 2.
- Confirmed early ending produced a private recap with one checked/recalled prompt.
  A forced expired active-session boundary produced `Time ended the route.` and a
  zero-response recap without errors.
- Export downloaded `focus-study-sprint-2026-08-28.json` with product/version 1 and
  the saved session. Invalid JSON was rejected with an actionable message. A valid
  empty backup required a specific replacement confirmation and restored normally.
  Cancelling Clear local data preserved the Library.
- Empty and invalid license restoration showed actionable errors. The invalid live
  verification returned HTTP 200 `{valid:false, reason:"invalid"}`. A stubbed valid
  return URL test saved `sb_license:focus-study-sprint`, stripped `?license=` from the
  URL, unlocked the Library, and made only one verify request across a reload,
  confirming the daily verdict cache.
- Fresh normal journeys had no console errors, page errors, failed requests, or
  horizontal overflow at either viewport.

### Release-blocking malformed import reproduction

1. Open Library and choose Import JSON.
2. Select this syntactically valid, product-shaped file and accept replacement:

   ```json
   {"product":"focus-study-sprint","version":1,"exportedAt":"now","sessions":[{"id":"bad"}],"decks":[]}
   ```

3. The envelope-only `isValidImport` check accepts it and IndexedDB persists it.
4. Rendering raises `TypeError: Cannot read properties of undefined (reading
   'filter')`. Reload the page.
5. `#app` is empty, there is no `<main>`, and only the pre-mount skip link remains.
   The same TypeError recurs. There is no in-product recovery after reload; clearing
   site data externally is required.

This also replaces the user's previously stored sessions as part of the confirmed
import. The product must validate every session, response, deck, and prompt field
before opening a write transaction, reject invalid data without changing existing
records, and include regression coverage for malformed nested records.

## Accessibility and responsive evidence

- The factory `/opt/fleet/lib/verify-url.sh` passed at HTTP 200 in 978 ms: title,
  `lang=en`, one h1, main, image alt, labeled buttons, and zero console errors.
- `@axe-core/playwright` found zero serious/critical findings in live light setup,
  dark 390px setup, active session, recap, Library, Privacy, and Terms states.
- Keyboard focus began on a visible `Skip to main content` link with a 3 px blue
  outline and 3 px offset. The full recall path worked by keyboard, and reveal moved
  focus to `1 Keep practicing`. The restore dialog opened with focus on its labeled
  Close button and had no trap in smoke testing.
- No visible setup or revealed-session target measured below 44x44 CSS px at 390px;
  desktop controls also passed the repository target audit. There was no horizontal
  overflow at 390px or desktop. Visual inspection found no overlap or clipped task
  controls in the responsive light/dark treatments.
- Under `prefers-reduced-motion: reduce`, the media query matched, maximum animation
  and transition duration was 0.01 ms, and scroll behavior was `auto`.

## PWA, privacy, and response-policy evidence

- Chrome's manifest parser reported no manifest errors and no installability errors.
  The live manifest has a versioned start URL, standalone display, 192/512 icons,
  maskable purpose, and product palette colors.
- The live worker controlled `/` with `fss-v2-shell` and `fss-v2-runtime`. After an
  online visit and saved example, Playwright offline mode, reload, and retained
  `5 / 30 ready` all passed with the offline status visible.
- Update behavior was tested without changing product code by serving the exact
  `dist/` from a disposable local server and returning the worker as `fss-v3` on its
  next update check. The app showed `A fresh map is ready`; Update app activated the
  new controller, reloaded successfully, removed v2 caches, and left v3 shell/runtime
  caches with no console/page errors.
- Source review and a fresh live request capture found no analytics, beacon, CDN font,
  or third-party script. Initial app requests were same-origin only. Study data used
  localStorage/IndexedDB; only explicit license activity contacted the allowlisted
  Sociobot API. Privacy and Terms accurately describe this behavior.
- HTTP redirects to HTTPS. Root responses include HSTS, a restrictive CSP with
  `frame-ancestors 'none'`, restrictive Permissions-Policy, `nosniff`, and
  `strict-origin-when-cross-origin`. The manifest is
  `application/manifest+json`; hashed JS/CSS/images use one-year immutable caching;
  `sw.js` uses `no-cache`.

## Live identity, performance, billing, and rate limiting

Every shipped candidate file matched the live response by SHA-256: root, Privacy,
Terms, offline page, manifest, service worker, all generated JS/CSS, both hero WebPs,
all icons, robots, and sitemap. Root candidate/live SHA-256 is
`7f7fb9318996a00d991ddbd9b80d0bb22ce1db522859a4e4a0bfd70d1fdf649b`.

Fresh Lighthouse mobile results:

| Category / metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP / LCP | 1.0 s / 1.5 s |
| TBT / CLS | 150 ms / 0 |
| Initial transfer | 71,901 B; 0 third-party bytes |

The earlier deployment-only billing defect is resolved. The live catalog is in live
mode and lists the exact slug, `$12` (`price_minor: 1200`) USD price, product URL, and
checkout URL. Checkout returned HTTP 303 to
`https://checkout.dodopayments.com/session/...`; no payment was initiated. GET and
OPTIONS verification requests with the product Origin returned matching CORS policy.

Rate limiting was confirmed against the read-only invalid-license verify endpoint. In
a 120-request concurrent burst completed in 930 ms, 30 requests returned 200 and 90
returned 429. In submitted order, request 31 was the first 429; every limited response
had `Retry-After: 4` and `Too Many Requests! Wait for 4s`. No sign-in exists, so the
Entra tenant requirement is not applicable.

## Defects

| Severity | Finding | Impact |
| --- | --- | --- |
| **High** | Nested backup records are not validated before import. | A small product-shaped malformed file is committed to IndexedDB, replaces local records, throws during Library rendering, and leaves the app blank on every reload with no UI recovery. This violates invalid-input recovery, local-data safety, and the design promise that imports are validated before replacement. |

No other Critical, High, Medium, or Low defects were found in this pass. The former
checkout registration failure is verified fixed, but the high-severity persistent
import failure makes candidate `7fdb92f9456946403622a7a5e02b629817523665`
**FAIL** pending a code repair and fresh verification.
