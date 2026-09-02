# Independent verification 9 — Focus Study Sprint

## Result

**PASS** — candidate `8febb2f6ed18fd734a202b238a1616a8b2d0ab0d` at
<https://focus-study-sprint.sociobot.in> satisfies the supplied brief and release
contract. Verification ran on 2026-09-02 from the clean candidate checkout. No
product code or infrastructure was changed.

All 11 registered claim commands, the complete local suite, type check, exact
production build, live billing contract, accessibility checks, privacy checks, PWA
checks, and deployment-identity comparison pass. One low-severity defensive-storage
gap is documented below; it is not reachable through the current UI or validated
import path.

## Mandatory first gates

### Claims registry

`.factory/claims.json` exists with 11 unique IDs. Each ID appears in exactly one
`@claim:<id>` Playwright test. After installing the locked dependencies, every listed
command was run separately through the production preview and demo entry point before
broader QA.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | A real-data sentinel survived demo entry, reset, and exit; demo keys stayed in the `demo:` namespace. |
| `input-limits` | PASS | Four and 31 pairs failed; five passed; 5/10/20-minute choices existed. |
| `study-flow` | PASS | Enter and 1/2 completed five prompts; the recap survived Library reload. |
| `offline-reload` | PASS | A dedicated context reloaded `/demo` offline and revealed the cached answer. |
| `local-privacy` | PASS | Typed response, reveal, and rating sent no request outside the product origin. |
| `json-backup` | PASS | A session and saved set exported, cleared, restored, and were reusable. |
| `accessible-layout` | PASS | 390×844 and 1440×1000 had no overflow; tested controls met 44 px. |
| `display-preferences` | PASS | Repeated dark-mode axe scans passed; reduced-motion durations were zero. |
| `contour-price` | PASS | Recorded valid verification enabled saved sets and exactly the newest 20 of 21 imported sessions for $12. |
| `session-timing` | PASS | Pause retained time; resumed expiry produced a time-ended recap. |
| `installable-shell` | PASS | The standalone manifest and controlling service worker were present. |

The rendered landing page, Library, About, Privacy, Terms, README, and copy audit were
cross-checked against the registry. The previous latest-20 paid-history contradiction
is fixed, and no unlisted contradictory material claim remains.

### Cold first read and one-click demo

The live root was opened cold before interaction. Its first screen answers all three
questions in plain words:

- What: **“Practice recalling answers in a short session.”**
- For whom: **“For students and self-learners…”**
- First click: **“Try it with sample data,”** beside **“Opens a five-prompt practice
  session.”**

One keyboard-activated click opened `/demo` at prompt 1 of 5 with a 05:00 timer. The
persistent **“Demo — sample data, nothing is saved”** banner exposed **Reset demo** and
**Start for real**. The demo used `demo:fss:*` localStorage and
`demo:focus-study-sprint` IndexedDB without changing real study data.

## Clean install, tests, and build

```text
npm ci                         PASS — 174 packages; 0 vulnerabilities
11 claims.json commands       PASS — each exact command run independently
npm test                       PASS — 18 Vitest + 24 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — tsc + Vite; dist/ produced
npm run test:live-contract     PASS — catalog and hosted checkout redirect
git diff --check               PASS
```

The production build contains 34,682 B JavaScript (11.48 kB gzip), 24,655 B
application CSS (5.86 kB gzip), 563 B legal CSS, no font downloads, a 47,956 B mobile
hero, and a 211,961 B social image. These satisfy the 200 kB JS, 50 kB CSS, 120 kB
font, and 300 kB mobile-hero budgets.

## End-to-end product and recovery evidence

- A live 390 px keyboard-only journey reached the sample action at Tab stop 8, with a
  `3px solid rgb(34, 107, 145)` focus outline, then completed five prompts using Enter
  and 1/2. The recap reported 5 checked, 3 recalled, and 2 to revisit, and persisted in
  Library.
- Live setup rejected four pairs, accepted five and 30, rejected 31, exposed exactly
  5/10/20 minutes, rejected a malformed line with a specific repair instruction, and
  became startable after correction.
- The full suite additionally passed malformed nested-backup rejection without data
  loss, recovery controls for invalid stored records, in-progress response reload,
  JSON clear/import/reuse, timer pause/expiry, and license restore.
- A recorded valid-license response on the live client proved query-token capture,
  URL stripping, local token storage, paid controls, and daily verification caching:
  one verification occurred before and after reload combined.
- Every discovered internal link returned 200 except the intentional designed 404;
  the buy link returned HTTP 303 to the hosted Sociobot/Dodo checkout. No payment was
  started.

## Accessibility, responsive behavior, and visual review

- `/opt/fleet/lib/verify-url.sh` passed the live root in 724 ms with a useful title,
  `lang=en`, one h1, one main, no missing image alt, no unlabeled button, and no
  console error.
- Independent Playwright axe scans found zero serious or critical findings, and in
  fact zero axe violations, on mobile root, demo, revealed-answer, recap, Library,
  About, Privacy, Terms, the real 404, and desktop dark mode.
- Root, session, recap, Library, legal, About, and 404 states had no horizontal
  overflow at 390 px. Desktop at 1440 px also had none. At 200% root text size, setup,
  durations, Library, and recovery controls remained available without overflow.
- The skip link moved focus to `main`. The license dialog received focus on Close,
  kept background controls inert, closed with Escape, and restored focus to its
  opener. Route changes focused the new h1.
- With reduced motion requested, the maximum computed animation or transition
  duration was 0 seconds. Dark mode had no serious/critical contrast finding.
- Captured light-mobile and dark-desktop screens matched the documented quiet
  topographic field-notebook identity. The mobile first action was visible without
  horizontal clipping; controls, copy, and generated artwork remained legible.

The HTTP 404 navigation produces Chromium's normal failed-resource console entry for
the document status. The designed 404 itself has correct title, h1, main, links, and
zero axe violations.

## Privacy, network, headers, and billing rate limit

- The cold page requested only the document, hashed JS, hashed CSS, and its responsive
  hero from the product origin. The complete live demo journey made seven requests,
  all same-origin; no analytics, CDN, third-party font/script, prompt, or typed answer
  left the product origin.
- Root responses include restrictive CSP with header-only `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict referrer policy, and a restrictive permissions policy.
  Browser console and page errors were zero in normal routes and flows.
- HTML uses 30-second revalidation; hashed assets use one-year immutable caching;
  `sw.js` is `no-cache`; the manifest is `application/manifest+json` with one-hour
  revalidation.
- The public product-license verification endpoint allowed **30** requests from one
  client. Request **31** returned **HTTP 429** with `Retry-After: 4` and
  `X-RateLimit-After: 4`.
- The production catalog lists the product at $12 USD with the correct return URL.
  Checkout redirects to the hosted Sociobot/Dodo flow. The product has no sign-in,
  backend, package API, or CLI; Entra, backend concurrency/persistence, and clean
  consumer-install checks do not apply.

## PWA, offline, and deployment identity

- The live manifest has `display: standalone`, scope `/`, start URL `/?v=8`, 192 and
  512 icons, and a maskable 512 icon.
- In a dedicated fresh live context, `/demo` acquired the app-owned `/sw.js`
  controller. After the context was set offline, reload showed the offline notice,
  retained the sample, and revealed an expected answer with no error.
- A disposable two-version server exercised the exact build. An installed
  `fss-v7-shell` detected v8, showed **“An app update is ready,”** reloaded exactly once
  after **Update app**, removed v7, and left `fss-v8-shell` plus `fss-v8-runtime`, one
  main landmark, and no errors.
- All **21** deployable files in `dist/` (excluding deployment-only
  `staticwebapp.config.json`) matched live custom-domain responses byte-for-byte by
  SHA-256. Mismatches: **0**. The main bundle hash was
  `8e06323db43fef841ceeaaffa5400dee604c71d4826b1cebeea178223e894c93`.

This establishes that production serves the build produced from candidate
`8febb2f6ed18fd734a202b238a1616a8b2d0ab0d`.

## Live mobile Lighthouse

| Category or metric | Result |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.3 s |
| TBT | 190 ms |
| CLS | 0 |
| Total transfer | 68 KiB |

INP is not emitted by this no-interaction lab run. TBT is 190 ms and the exercised
interactions responded without visible delay.

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | **V9-1 — Deeply malformed internal active-session state is not rejected.** Manually seed `fss:active-session` with valid JSON containing a nonempty `prompts` array but an out-of-range `current` index, then reload `/`. The response is 200, but the client throws `Cannot read properties of undefined (reading 'question')`, renders no main landmark, and leaves only the skip link. Current UI writes valid snapshots, malformed JSON is already caught, and validated JSON import cannot create this state, so this is a non-blocking hardening gap. Future work should validate the full snapshot and clear or quarantine invalid state before rendering. |

## Final disposition

**PASS.** The researched job-to-be-done works end to end on the deployed candidate;
all mandatory claim, demo, privacy, accessibility, PWA, performance, billing, build,
and deployment-identity gates pass. V9-1 is recommended hardening, not a release
blocker.
