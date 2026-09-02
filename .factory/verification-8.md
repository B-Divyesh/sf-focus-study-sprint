# Independent verification 8 — Focus Study Sprint

## Result

**FAIL** — candidate `d7215fd1f072a919701a5494fad7b18f26c9b1ad` at
<https://focus-study-sprint.sociobot.in> is not release-ready under the supplied
claims contract. Verification ran on 2026-09-02 from the clean candidate checkout.
No product code was changed.

The functional, accessibility, privacy, PWA, build, performance, deployment, and all
11 registered claim tests pass. One medium release blocker remains: paid-feature copy
in Library promises the **full on-device session list**, but the implementation and
registered claim expose only the latest 20. A live import of 21 valid records showed
20. The same locked view also says older sessions “appear after unlocking,” which is
false for records older than the newest 20.

## Mandatory first gates

### Claims registry

`.factory/claims.json` exists with 11 unique IDs. Each ID occurs in exactly one
`@claim:<id>` Playwright test. Before broader inspection, every listed command was run
separately through the built demo entry point; all passed.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Real-data sentinel survived demo entry/reset/exit; demo keys were separate and cleared. |
| `input-limits` | PASS | Four and 31 pairs failed; five passed; 5/10/20-minute choices existed. |
| `study-flow` | PASS | A five-prompt keyboard session produced a recap that survived Library reload. |
| `offline-reload` | PASS | A dedicated context reloaded `/demo` offline and revealed the cached answer. |
| `local-privacy` | PASS | Typed-response/reveal/rating flow requested only the product origin. |
| `json-backup` | PASS | Session and saved prompt set exported, cleared, restored, and reused. |
| `accessible-layout` | PASS | 390×844 and 1440×1000 had no overflow or undersized tested controls. |
| `display-preferences` | PASS | Dark-mode axe checks passed and reduced-motion durations were zero. |
| `contour-price` | PASS | Recorded valid license enabled reusable sets and exactly the newest 20 of 21 imported records for $12. |
| `session-timing` | PASS | Pause retained time; resumed expiry produced the time-ended recap. |
| `installable-shell` | PASS | Standalone manifest and controlling service worker were present. |

The claims/copy cross-check does not pass. Library contains a stronger, conflicting
version of `contour-price` that its own test disproves. Under the supplied claims rule,
a public promise not proved as written is release-blocking even when the registered
test commands pass.

### Cold first read

The live root was opened cold at desktop and 390×844 before interaction. It clearly
answers the required questions:

- What: **“Practice recalling answers in a short session.”**
- For whom: **“For students and self-learners…”**
- First click: **“Try it with sample data,”** followed by **“Opens a five-prompt
  practice session.”**

One click opened `/demo` directly at prompt 1 of 5 with a 05:00 timer. The persistent
**“Demo — sample data, nothing is saved”** banner included **Reset demo** and **Start
for real**. The first-read/demo gate passes.

## Clean install, tests, and build

```text
npm ci                         PASS — 174 packages; 0 vulnerabilities
11 claims.json commands       PASS — each command run separately
npm test                       PASS — 18 Vitest + 24 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — tsc + Vite; dist/ produced
npm run test:live-contract     PASS — live catalog and hosted checkout redirect
```

The build contains 34,643 B JavaScript (11,403 B gzip), 24,655 B application CSS
(5,870 B gzip), no font files, and a 47,956 B mobile hero. These satisfy the 200 kB
JavaScript, 50 kB CSS, 120 kB font, and 300 kB mobile-hero budgets.

## Product journeys and recovery

- A live five-prompt demo was completed with Enter and 1/2. It produced a recap and
  persisted `5 checked · 2 to revisit` after Library reload.
- The whole live journey made 10 requests, all to
  `https://focus-study-sprint.sociobot.in`; console errors, page errors, and failed
  requests were zero.
- Live setup rejected four and 31 pairs, accepted five and 30, exposed exactly three
  durations, and gave a specific recovery instruction for a malformed line.
- An in-progress typed response survived live reload.
- The full repository suite also passed malformed nested-backup recovery, poisoned
  older-storage recovery, JSON export/clear/import/reuse, timer pause/expiry, demo
  isolation, and browser-history/focus behavior.
- A recorded valid license response on the live client proved query-token capture,
  URL stripping, local token storage, paid controls, and one verification across
  reload. No purchase or real license was used.

## Privacy, network, billing, and headers

- A cold load requested only the same-origin document, hashed JavaScript, hashed CSS,
  and responsive hero. No analytics, CDN, remote font, or third-party script loaded.
- The normal study flow sent no prompt or response content off-origin. The documented
  license exception targets only the Sociobot billing API.
- Root responses include CSP with header-only `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict referrer policy, and a restrictive permissions policy. HTML
  revalidates after 30 seconds; hashed assets are immutable for one year; `sw.js` is
  `no-cache`; the manifest has the correct MIME type and one-hour revalidation.
- The public product verification endpoint allowed **30** requests from one client.
  Request 31 returned **HTTP 429** with `Retry-After: 4` and
  `X-RateLimit-After: 4`.
- The production catalog lists the $12 USD product and correct product URL. Checkout
  redirected to the hosted Sociobot/Dodo flow; no payment was started.

There is no sign-in, product backend, library package, or CLI. Entra identity,
backend concurrency/persistence, and clean-consumer package checks do not apply.

## Accessibility and responsive behavior

- `/opt/fleet/lib/verify-url.sh` passed the live root at HTTP 200 in 713 ms: useful
  title, `lang=en`, one h1, one main, no missing image alt, no unlabeled button, and
  no console error.
- Independent Playwright axe scans found zero serious/critical findings at mobile and
  desktop widths on root, Privacy, Terms, About, the real 404, the demo session,
  revealed-answer state, recap, Library, and desktop dark mode.
- Mobile and desktop checks had no horizontal overflow. The passing claim suite also
  measured 44 px controls and usable setup/recovery controls at 200% text.
- Keyboard-only use reached the primary action at Tab stop 8 with a visible
  `3px solid rgb(34, 107, 145)` outline, opened the demo with Enter, and completed all
  five prompts with Enter and 1/2. The skip link moved focus to `main`.
- With reduced motion requested, the maximum computed animation/transition duration
  was 0 seconds. Manual screenshots confirmed the documented topographic notebook
  identity in 390 px light and desktop dark treatments.

Normal routes returned 200 with route-specific titles, one h1, and one main, with no
console/page errors. An unknown path returned the designed HTTP 404; Chromium's
failed-resource console line for that intentional navigation status is expected.
Every discovered internal link returned 2xx; mail links were explicit.

## PWA and deployment identity

- The manifest reports `display: standalone`, scope `/`, start URL `/?v=7`, and
  192/512 icons with a maskable 512 icon.
- After one online visit, a dedicated live context reloaded `/demo` offline, displayed
  the offline notice, retained the sample, and revealed the answer.
- A disposable two-version server using the exact candidate build displayed **“An app
  update is ready.”** Clicking **Update app** reloaded exactly once, kept one main
  landmark, removed the old v7 caches, and left only the new shell/runtime caches.
- All 21 built files other than deployment-only `staticwebapp.config.json` match the
  live custom-domain responses byte-for-byte. Mismatches: **0**. Candidate tree hash:
  `a7a98b568d243a454a7dc3a366ac9e3666209f789e1f8de37d90001d5c1fba34`.

This establishes that production serves the application output of candidate
`d7215fd1`.

## Performance

Live mobile Lighthouse with standard simulated mobile throttling:

```text
Performance       96
Accessibility     100
Best Practices    100
SEO               100
FCP               0.91 s
LCP               1.21 s
TBT               241 ms
CLS               0
Total byte weight 69,282 B
```

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None |
| High | None |
| Medium | **V8-1 — Paid history is promised as complete but capped at 20.** The live locked Library says, “The $12 one-time Contour license adds reusable prompt sets and your full on-device session list.” It can also say, “Older sessions remain in your export and appear after unlocking.” The implementation slices unlocked history to 20, the registered claim promises “latest 20,” and a live valid-license fixture with 21 imported records displayed 20. Change both Library statements to the exact latest-20 contract, or implement and test a genuinely complete list. |
| Low | None |

## Final disposition

**FAIL.** Fix V8-1, add an assertion covering the corrected Library copy or complete
history behavior, then rerun the claims/copy gate and release suite. All other tested
areas pass.
