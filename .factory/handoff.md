# Repair handoff — Focus Study Sprint

## Overall result: PASS

Repair work order `focus-study-sprint-repair-4` fixes every finding in independent
verification commit `dee8d09a4341cbaea94e560194a74139580b6331` for candidate
`7fdb92f9456946403622a7a5e02b629817523665`. The repaired product commit is
`cef7386808dd362b4fd746ccfe5931e53d40279d`.

The original static PWA artifact and deployment class are unchanged. Deployment
`8b961154-63f0-4664-8f32-d81a2cc81484` succeeded on 2026-08-30 UTC at
<https://focus-study-sprint.sociobot.in>.

## Failure reproduced before repair

The verifier's exact backup was imported after creating a real one-response session:

```json
{"product":"focus-study-sprint","version":1,"exportedAt":"now","sessions":[{"id":"bad"}],"decks":[]}
```

The candidate accepted the file, replaced the existing session, and raised
`Cannot read properties of undefined (reading 'filter')`. Reload left zero `main`
elements and an empty `#app`; IndexedDB contained only `{ "id": "bad" }`.

## Repair

- Full runtime validation now covers every `SessionRecord`, `Response`, `SavedDeck`,
  and `Prompt` field, including enums, arrays, numeric fields, and nested records.
- The UI rejects malformed data before asking for replacement. The storage boundary
  repeats validation before opening the IndexedDB write transaction, so invalid data
  cannot clear existing records even if that boundary is called directly.
- IndexedDB reads also validate stored records. Data poisoned by the older release
  now opens a usable Library with actions to restore a backup or clear the invalid
  data instead of blanking the app.
- The service-worker shell and manifest start URL moved from `fss-v2` to `fss-v3`,
  ensuring installed clients receive the repaired shell through the existing update
  notice.
- A 200% text-resize audit found and fixed 12px mobile overflow in the header,
  setup heading, and duration controls. A 390px regression now covers setup and
  Library recovery controls at 200% text size.

## Exact regression coverage

- Vitest asserts the verifier payload is invalid, a complete backup remains valid,
  and malformed session, response, saved-deck, and prompt records are rejected.
- Playwright creates a real saved session, selects the exact malformed JSON file,
  asserts no replacement confirmation appears, checks the recovery message and
  retained session, reloads, and verifies `main`, saved data, and zero page errors.
- A second browser regression seeds the already-poisoned `{ "id": "bad" }` record,
  verifies the recovery UI renders, clears it in-product, reloads, and confirms the
  empty Library remains usable.

## Clean verification evidence

```text
npm ci
  174 packages installed; 0 vulnerabilities

npm run test:release
  Vitest: 16 tests passed
  Playwright: 9 tests passed
  TypeScript: tsc --noEmit passed
  Vite production build passed; dist/ produced
  Live billing contract passed
```

There is no separate lint task; strict TypeScript checking runs in `npm run build`.
Package/consumer testing is not applicable to this static PWA.

Production output:

- initial JavaScript: 29.73 kB (10.30 kB gzip)
- application CSS: 22.36 kB (5.45 kB gzip)
- legal CSS: 0.56 kB (0.30 kB gzip)
- mobile hero: 47,956 B; desktop hero: 152,682 B; no font files

These remain below the 200 kB JS, 50 kB CSS, 300 kB mobile-image, and 120 kB font
budgets.

## Browser, accessibility, privacy, and PWA evidence

- Chromium journeys passed at 1440x1000 and 390x844 in light and dark treatments.
  Keyboard-only recall, visible 3px focus rings, touch targets, no horizontal
  overflow, reduced motion (`0.00001s` maximum), and 200% text resize passed.
- Axe found zero serious/critical findings on setup, active session, Library,
  Privacy, and Terms. The factory URL verifier passed live in 872ms with title,
  `lang=en`, one `h1`, `main`, alt text, labeled buttons, and zero console errors.
- A normal complete study journey made no cross-origin request. No analytics,
  trackers, CDN fonts, or third-party scripts are present. The optional license path
  remains limited to `api.sociobot.in`.
- Live malformed-import recovery, online reload, and offline reload retained the
  saved session with zero console/page errors. The live worker controls the page with
  only `fss-v3-shell` and `fss-v3-runtime` caches.
- A disposable exact-build update test served `fss-v4` on the next worker check. The
  update notice appeared; **Update app** activated the worker, reloaded with `main`,
  removed v3 caches, and left only v4 shell/runtime caches with no errors.
- Chrome reported zero manifest errors. The live manifest has standalone display,
  versioned start URL, product palette, 192/512 icons, and a maskable icon.

Live mobile Lighthouse:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP / LCP | 1.1 s / 1.5 s |
| TBT / CLS | 0 ms / 0 |
| Initial transfer | 71 KiB |

## Live response policy and identity

- Root serves HTTPS 200 with HSTS, restrictive CSP including response-header
  `frame-ancestors 'none'`, restrictive Permissions-Policy, `nosniff`, and
  `strict-origin-when-cross-origin`.
- Fingerprinted assets use one-year immutable caching; `sw.js` uses `no-cache`; the
  manifest uses `application/manifest+json` and revalidation caching.
- Billing catalog and checkout redirect pass. GET and OPTIONS license verification
  return matching product-origin CORS policy; an invalid token returns HTTP 200 with
  `{ valid: false, reason: "invalid" }`.
- A 120-request invalid-license burst completed in 789ms: 30 returned 200 and 90
  returned 429; every limited response included `Retry-After: 4`.
- All 16 shipped candidate files match the live responses by SHA-256, including
  HTML, JS, CSS, images, icons, manifest, worker, legal pages, robots, and sitemap.
  Root SHA-256 is `a0dc6dcc200c6dd9eb8860ab7689b493b8e09fdbd28bac16fbe6a54a1cf45d8c`.

## How to verify

```sh
npm ci
npm run test:release
/opt/fleet/lib/verify-url.sh https://focus-study-sprint.sociobot.in /tmp/fss-verify
```

## Known gaps and next steps

No verifier finding remains open. No infrastructure, DNS, billing configuration,
researched scope, paid-feature behavior, or previously passing study behavior was
changed.
