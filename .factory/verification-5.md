# Independent verification 5 — FAIL

**Candidate:** `f99823ed40fa9c86bcd4c6d5d649db846c3d7b9b`  
**Branch:** `main` (`origin/main` matched before verification)  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Verdict:** **FAIL**

The live artifact matches the candidate and its core five-prompt study flow works,
but the candidate fails two explicit preconditions of this verification: there is no
`.factory/claims.json`, and there is no isolated, one-click sample-data demo. The
cold mobile first screen also offers no task action in the viewport and does not say
plainly that the product is for students or self-learners. These are release-blocking
regardless of the passing implementation checks below.

## Mandatory first gates

Verification began from a clean checkout at exactly the requested commit, before
inspecting the rest of the repository.

### Claims gate — FAIL

`.factory/claims.json` does not exist. Consequently, there were no declared claim
commands to run through the required demo entry point. This is a release-blocking
failure under the supplied claims contract.

The omission is material: the live page and README make observable claims including
“Works offline,” “Your work stays on this device,” “Nothing is uploaded,” no
behavioral analytics, JSON export/import, cached app shell, update notice, reduced
motion, keyboard operation, and responsive 390 px layout. None is registered in the
required claims file or mapped to exactly one `@claim:<id>` test.

### Cold first-read and demo gate — FAIL

At 1440×900, the cold page says:

> Study what you brought. Then be done. Paste a small set of prompt-and-answer pairs.
> Move through one calm, timed session. Your work stays on this device.

This suggests an active-recall timer, but does not name students or self-learners.
The metaphorical headline does not directly state the job, and the page does not make
one first click unambiguous. The document's only h1 is the `Focus Study Sprint`
wordmark; the job headline is an h2.

There is no control named **Try it with sample data**. “Use an example” is visible at
desktop y=723, but it only fills the real setup textarea; it does not enter a demo or
show the product already in use. At 390×844, that control begins at y=1,063 and
“Begin this sprint” at y=1,663, so neither task action is on the first screen.

Both supported-looking entry points were tested with the real-data sentinel
`REAL PRIVATE DRAFT :: must not appear in demo` already in `fss:draft`:

- `/?demo=1` displayed the sentinel from real storage.
- `/demo` returned 200 and displayed the same sentinel.
- Neither showed the required “Demo — sample data, nothing is saved” banner, Reset
  demo, or Start for real action.
- The sample action writes directly to `fss:draft`; there is no `demo:` storage
  namespace. `.factory/demo.md` is also missing.

The current “Use an example” feature is useful seed data, but it is not the required
isolated demo and can overwrite a user's real draft.

## Clean install, tests, type check, and build

```text
node --version                       v22.23.2
npm --version                        10.9.8
npm ci                               174 packages; 0 vulnerabilities
first npm test                       16 Vitest passed; 8/9 Playwright passed
isolated failed test, repeat-each=3  3/3 passed
npm run test:release                 PASS
  Vitest                             16/16 passed
  Playwright                         9/9 passed
  tsc --noEmit + Vite build          passed; dist/ produced
  live billing contract              passed
```

The first clean `npm test` failed
`keeps recovery controls available for data poisoned by an older release` with
`Execution context was destroyed, most likely because of a navigation`. The same
test then passed three isolated repetitions and the complete release command passed.
A separate fresh-browser check reproduced `page.reload: net::ERR_ABORTED; maybe frame
was detached?` while the first service worker claimed the page. The app reloads on
every `controllerchange`, including first installation, so the suite and first-load
page are timing-sensitive. This is recorded as an intermittent defect, not hidden by
the later green run.

There is no lint script. Strict TypeScript checking is part of `npm run build`.

Fresh production output:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| Initial JavaScript | 29.73 kB | 10.30 kB |
| Application CSS | 22.36 kB | 5.45 kB |
| Legal CSS | 0.56 kB | 0.30 kB |
| Mobile hero | 47,956 B | — |
| Desktop hero | 152,682 B | — |
| Fonts | 0 B | — |

All static budgets pass: JS <200 kB, CSS <50 kB, mobile hero <300 kB, and fonts
<120 kB.

## Functional and recovery evidence

The exact built preview and live deployment were exercised in fresh Chromium
contexts.

- Four valid pairs disabled Start with `Add 1 more pair to begin.`; 5 and 30 enabled
  it; 31 disabled it with `Keep this route finite: use 30 pairs or fewer.`
- A row without `::` or a tab produced the documented error. Loading the example
  cleared the error and re-enabled Start.
- A complete keyboard flow used Enter to reveal and 1/2 to rate all five prompts. It
  produced a recap with 5 checked, 3 recalled, and 2 to revisit. Pause held `10:00`
  for over one second and Resume continued the flow.
- A forced expired five-minute session produced `Time ended the route.` and a valid
  zero-response recap.
- Export downloaded a version-1 product JSON with one session and five responses.
  After clearing data, importing that backup restored `5 checked · 0 to revisit`.
  The repository regressions for malformed nested backups and poisoned legacy data
  passed in the later complete release run.
- Fresh normal journeys had no console errors, page errors, failed requests, or
  horizontal overflow at 1440 px and 390 px.
- The free study flow and export remain usable without a purchase. Checkout is a
  Sociobot API link; no provider is embedded in the application.

## Accessibility, keyboard, layout, and motion

- `/opt/fleet/lib/verify-url.sh` passed after its evidence directory was created:
  HTTP 200 in 885 ms, `lang=en`, title, one h1, main landmark, alt text, labeled
  buttons, and zero load errors.
- Settled-state `@axe-core/playwright` scans found zero serious/critical findings in
  light and dark setup, active session, recap, Library, Privacy, and Terms.
- The skip link is first in keyboard order and appears at 8×8 with a 3 px blue focus
  outline. Header controls, sample action, prompt entry, recall, rating, and dialog
  controls are keyboard reachable. The native restore dialog opens with focus on its
  Close button and closes with Escape.
- No visible link, button, textarea, or duration label measured below 44×44 CSS px.
  There was no horizontal overflow at 390 px. The candidate's 200% text-size
  regression passed.
- With `prefers-reduced-motion: reduce`, maximum animation and transition durations
  were 0.00001 seconds.

An immediate axe scan after rapidly cycling System → Light → Dark was unstable: 8 of
10 runs observed the dark backgrounds with stale light-theme heading colors for a
brief frame. Axe reported serious contrast ratios of 1.10:1 on the hero heading and
1.04:1 on `Chart your prompts`. Computed colors settled to the intended dark palette
within 100 ms, after which axe passed. This transient is still contrary to the
reduced-motion/contrast contract and makes the repository's immediate dark scan
nondeterministic.

## Privacy, PWA, headers, and caching

- The full normal study/export/legal journey requested only
  `https://focus-study-sprint.sociobot.in`; no analytics, beacons, CDN fonts, or
  third-party scripts were found. With a license present, the only cross-origin
  request was the documented `https://api.sociobot.in/.../verify` call.
- Prompt drafts use namespaced localStorage and sessions/decks use IndexedDB. The
  privacy text accurately describes the normal runtime network behavior.
- Chrome parsed the live manifest with zero errors. It has standalone display, a
  versioned start URL, product colors, 192/512 icons, and a maskable icon.
- After one online visit and loading the example, offline reload retained a main
  landmark and `5 / 30 ready`, showed the offline notice, and allowed the sprint to
  start. Live caches were `fss-v3-shell` and `fss-v3-runtime`.
- An update test served an untouched `dist/` from a disposable directory, changed
  only the temporary worker version to v4, and called `registration.update()`. The
  app displayed `A fresh map is ready`; Update app activated the worker, reloaded
  with one main landmark, removed v3 caches, and left v4 shell/runtime caches with
  zero errors.
- Root responses include HSTS, restrictive CSP with response-header
  `frame-ancestors 'none'`, Permissions-Policy, `nosniff`, and
  `strict-origin-when-cross-origin`. Hashed JS/CSS return one-year immutable caching;
  `sw.js` is `no-cache`; the manifest uses `application/manifest+json` and revalidation.

The dedicated `/offline.html` response violates that CSP: it contains an inline
`<style>` while `style-src` permits only `'self'`. Opening the route logs a CSP console
error and leaves the body transparent/unstyled. Routine offline reload still works
because `/` is precached, but the shipped fallback is broken.

## Live identity, performance, billing, and rate limit

All 16 public candidate artifacts matched the live responses byte-for-byte by
SHA-256: root, Privacy, Terms, offline page, manifest, worker, robots, sitemap, all
generated JS/CSS, both hero images, and all icons. Root candidate/live SHA-256:
`a0dc6dcc200c6dd9eb8860ab7689b493b8e09fdbd28bac16fbe6a54a1cf45d8c`.

Fresh mobile Lighthouse:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP / LCP | 0.4 s / 0.4 s |
| TBT / CLS | 0 ms / 0 |
| Initial transfer | 71 KiB |

The live billing catalog/checkout release test passed. Checkout returned HTTP 303 to
the hosted Dodo session; no purchase was made. An invalid verify call returned HTTP
200 with `{valid:false, reason:"invalid"}` and correct product-origin CORS.

A fresh 60-request concurrent invalid-license burst established the enforced
allowance: **30 requests per client/window** returned 200, the next 30 returned 429,
and every 429 included `Retry-After: 4`. Both 200 and 429 responses carried the
correct CORS origin. The product has no sign-in, so the Entra authority requirement is
not applicable. It has no product-owned backend, library, or CLI surface.

## Additional contract findings

- Navigation uses `history.replaceState`, not `pushState`. Start → Library → About
  kept the same history length; Back left the product for `about:blank` instead of
  restoring Library. The title also stayed `Focus Study Sprint — calm active recall`
  on all app states.
- There is no designed 404. `/definitely-not-a-real-route` returned HTTP 200 with the
  app shell. `staticwebapp.config.json` has no 404 response override.
- Root and legal documents have no canonical, Open Graph, or Twitter-card metadata;
  there is no 1200×630 social image. The app footer omits “Built by Param Factory” and
  a build/version identity. The landing page also omits the required How it works,
  explicit privacy/non-goal, and exact-price sections.
- `.factory/copy-audit.md` is absent, in addition to the missing claims and demo docs.

## Defects by severity

| Severity | Finding | Evidence / impact |
| --- | --- | --- |
| **High — release blocker** | Required claims registry and claim tests are absent. | `.factory/claims.json` is missing while the UI/README make numerous privacy, offline, export, keyboard, and performance-adjacent claims. The mandatory first gate cannot run. |
| **High — release blocker** | Required one-click isolated demo and plain first screen are absent. | No “Try it with sample data”; `/demo` and `?demo=1` read the real `fss:draft`; no banner/reset/exit; `.factory/demo.md` missing. At 390×844 no task action is above the fold, and the copy does not plainly identify the learner. |
| **Medium** | First service-worker claim can reload the page and makes the clean browser suite flaky. | First `npm test` failed with a destroyed execution context; a separate reload hit `ERR_ABORTED`. Later isolated and full release runs passed. |
| **Medium** | In-app routing does not support browser history or route titles. | `replaceState` kept history length fixed; Back exited the app and titles never changed between Start, Library, and About. |
| **Medium** | Shipped offline fallback violates the production CSP. | `/offline.html` logs an inline-style CSP error and renders without its intended styling. |
| **Medium** | Theme switching has a transient serious contrast failure. | 8/10 immediate System → Light → Dark axe scans saw 1.04–1.10:1 headings; settled scans passed after 100–150 ms. |
| **Low** | Required site metadata, 404, footer identity, and landing sections are incomplete. | Unknown URLs return 200; canonical/OG/Twitter/social image and build/footer identity are missing; the standard landing sections are absent. |

## Acceptance conclusion

The previous deployment-only billing failure is fixed, the prior malformed-import
defect is covered by passing regressions, and the live deployment is the exact
candidate. Candidate `f99823ed40fa9c86bcd4c6d5d649db846c3d7b9b` still **FAILS**
the supplied acceptance contract. A fresh verification is required after adding the
claims registry/tests and a true isolated demo, correcting the first screen, and
addressing the medium defects above.
