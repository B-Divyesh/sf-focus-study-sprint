# Independent verification 6 — FAIL

**Candidate:** `bd8354ad3f77c71beed3c07e37c9332e62adb543`  
**Branch:** `main` (`origin/main` matched before verification)  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Verdict:** **FAIL**

The candidate and live deployment work end to end and all declared claim commands
pass. The release still fails the supplied claims contract: tagged tests omit parts
of their promised outcomes, and public README claims for pause/timer behavior and
installability have no entries in `.factory/claims.json`. These are release-blocking
claim-coverage defects even
though independent manual checks found the implemented flows working.

## Mandatory first gates

Verification started with an empty `git status`, exact HEAD
`bd8354ad3f77c71beed3c07e37c9332e62adb543`, and `npm ci` (174 packages, zero
vulnerabilities).

### Declared claim commands — command PASS, contract FAIL

`.factory/claims.json` exists. Every listed command was run separately, in file order,
through the configured Playwright demo/landing sandbox before the remaining QA:

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS — 1 test |
| `input-limits` | PASS — 1 test |
| `study-flow` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `local-privacy` | PASS — 1 test |
| `json-backup` | PASS — 1 test |
| `accessible-layout` | PASS — 1 test |
| `display-preferences` | PASS — 1 test |
| `contour-price` | PASS — 1 test |

The registry is nevertheless insufficient under the attached claims contract:

- `contour-price` says Contour “adds reusable prompt sets plus the latest 20 session
  records.” Its sole tagged test at `tests/app.spec.ts:402` only asserts the sales
  words and checkout `href`. It never establishes an unlocked state, saves or reuses
  a set, or verifies the 20-record view. It proves the advertisement exists, not that
  the advertised result happens.
- `json-backup` calls the JSON a “complete local record,” but its tagged test exports
  and restores a session with no prompt set. The paid prompt-set portion of the local
  record is not covered.
- README's pause and timer-expiry promises and “installable app shell” are public
  observable claims without corresponding entries in `.factory/claims.json`. No test
  exercises a timer-expiry ending. Untagged configuration checks do not satisfy the
  required one-claim/one-sandbox-test mapping.

Manual QA showed that a locally cached valid entitlement exposes **Save current
draft**, saves and loads reusable five-prompt sets, and displays exactly 20 of 21
imported records. That confirms current behavior, but it does not provide the required
repeatable claim regression or prove a real license response.

### Cold first-read — PASS

At 1440×900, a fresh browser saw one h1: “Run a short active-recall study session.”
The next sentence names students and self-learners and says the experience avoids
streaks, feeds, and generated lessons. The primary action is **Try it with sample
data**, with adjacent copy saying it opens a five-prompt practice session. The first
screen therefore answers what it does, who it is for, and what to click first.

At 390×844 the action bottom was 472 px, so it remained in the first viewport. One
click opened `/demo` with a sample prompt already active and the persistent “Demo —
sample data, nothing is saved” banner, **Reset demo**, and **Start for real**.

## Clean install, tests, type check, and build

Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`.

```text
npm ci
  174 packages installed; 0 vulnerabilities

npm test
  Vitest: 18/18 passed
  Playwright: 21/21 passed

npm run lint
  tsc --noEmit passed

npm run build
  tsc --noEmit passed
  Vite build passed; dist/index.html produced

npm run test:live-contract
  production catalog and hosted checkout redirect passed
```

Fresh production assets are inside the static budgets:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| Initial JavaScript | 34,660 B | 11,401 B |
| Application CSS | 24,655 B | 5,870 B |
| Legal CSS | 563 B | 304 B |
| Mobile hero | 47,956 B | — |
| Desktop hero | 152,682 B | — |
| Fonts | 0 B | — |

## Functional, boundary, and recovery evidence

- The live `/demo` completed all five prompts using only `Enter`, `1`, and `2`, then
  showed a private recap with 5 checked, 3 recalled, and 2 to revisit.
- A typed private response, reveal, ratings, recap, Library, export, import, and reload
  produced 14 same-origin requests and zero cross-origin requests.
- A pre-existing real draft sentinel remained unchanged throughout demo work. The
  demo used four `demo:fss:*` keys; leaving it removed those keys and returned to `/`
  with the real draft intact.
- Export produced `focus-study-sprint-2026-08-30.json`. A malformed nested session
  was rejected without a replacement confirmation or data loss. Clear followed by
  valid import restored the recap, which remained after reload.
- Four valid pairs disabled Start with “Add 1 more pair to begin.” Thirty-one disabled
  it with “Use 30 pairs or fewer.” A row without a separator produced the specific
  correction. Five pairs enabled Start; 5, 10, and 20 minute choices were present.
- Pause exposed **Resume**. A typed in-progress response survived reload. The local
  regressions also passed for poisoned legacy IndexedDB recovery, 200% text,
  confirmation paths, route history, and malformed backups.
- Invalid license restore showed “That license is not active for this product,” left
  free JSON export present, and contacted only the expected Sociobot verify URL.

No product-owned backend, library, or CLI exists, so backend concurrency/persistence
and consumer-package tests are not applicable. There is no sign-in, so the Entra
authority requirement is not applicable.

## Accessibility and responsive behavior

- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200 in 788 ms, `lang=en`, useful title,
  one h1, one main landmark, no missing image alt, no unlabeled buttons, and no load
  errors.
- Independent `@axe-core/playwright` scans found zero serious/critical findings on
  desktop and 390 px mobile, in light and dark treatments, and on demo/session/recap,
  Library, About, Privacy, Terms, offline, and 404 states.
- Keyboard focus begins on the skip link. Its visible focus style is a 3 px blue ring
  with 3 px offset and 5.15:1 contrast against the paper background. Activating it
  moves focus to main. The restore dialog initially focuses Close and supports Escape.
- At 390×844, document width was exactly 390 px, no measured interactive target was
  below 44×44 px, and the sample action remained above the fold. The 1440×1000 check
  also had no overflow.
- Under `prefers-reduced-motion: reduce`, the maximum computed transition/animation
  duration was 0. Dark mode had zero serious/critical axe findings.
- Normal desktop/mobile journeys logged zero console errors, page errors, or failed
  requests. The deliberate unknown-URL navigation produced only Chromium's expected
  main-resource 404 message, not an application exception.

## Privacy, PWA, headers, caching, and performance

- Live study and backup flows made no cross-origin request. Source and live traffic
  contain no analytics, advertising, CDN fonts, or third-party runtime scripts.
- After one online `/demo` visit, a dedicated context went offline, reloaded, retained
  the active sample prompt, showed the offline notice, and revealed the answer.
- A disposable exact `dist/` copy was changed only from worker cache v6 to v7. It
  displayed “An app update is ready,” reloaded exactly once after **Update app**,
  retained one main landmark, removed v6 caches, left v7 shell/runtime caches, and
  logged no errors.
- The manifest is live as `application/manifest+json`, uses standalone display and a
  versioned start URL, and has verified 192×192, 512×512 maskable, and 180×180 Apple
  icons.
- Root headers include HSTS, restrictive CSP with response-header
  `frame-ancestors 'none'`, Permissions-Policy, `nosniff`, and strict referrer policy.
  Hashed assets use one-year immutable caching; `sw.js` is `no-cache`; HTML revalidates
  after 30 seconds.
- Live mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 210 ms, CLS 0, initial transfer 68 KiB. A live
  four-action Event Timing sample had a maximum interaction duration of 48 ms.

## Deployment identity, routes, billing, and rate limit

All 21 public files in fresh `dist/` matched the live custom-domain responses
byte-for-byte by SHA-256, excluding deployment-only `staticwebapp.config.json`.
Root candidate/live SHA-256:
`0a04f396cd17b5a21937caa92bb9dde8db97fdeb324c5b750e7f900143e94bd7`.
The designed unknown-route body also matched `dist/404.html` and returned HTTP 404.

Root, Demo, Library, About, Privacy, Terms, and offline routes returned 200 with the
correct title, one h1, one main, and clean serious/critical axe scans. All internal
landing links returned 200.

The production catalog lists the exact `$12 USD` one-time product and return URL.
Checkout returned HTTP 303 to the hosted Dodo session; no purchase was made. Invalid
verification returned `{valid:false, reason:"invalid"}` with correct product-origin
CORS. A rapid single-client test observed **30 successful requests per window**; the
31st returned HTTP 429 with `Retry-After: 4`.

## Defects by severity

| Severity | Finding | Evidence / impact |
| --- | --- | --- |
| **High — release blocker** | The claim registry/test suite does not prove all public promises. | `@claim:contour-price` checks only copy/link, not the promised paid outcomes; `@claim:json-backup` omits prompt sets; README's pause/timer and installability claims are unregistered. This violates the explicit claims acceptance contract and allows feature regressions while every claim command remains green. |

No independent functional, privacy, accessibility, deployment-parity, PWA, security-
header, caching, rate-limit, or performance defect was found.

## Acceptance conclusion

Candidate `bd8354ad3f77c71beed3c07e37c9332e62adb543` **FAILS** the supplied acceptance
contract. The prior deployment-only failure is not present: the live artifact exactly
matches the candidate and billing checkout is available. Release requires expanding
the claim registry and tagged sandbox tests so each advertised outcome is actually
exercised, then running a fresh independent verification.
