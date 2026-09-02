# Independent verification 7 — Focus Study Sprint

## Result

**PASS** — candidate `526c2ccabb54ddba94a624eb65ff6c1e066e7516` at
<https://focus-study-sprint.sociobot.in> satisfies the researched brief and supplied
acceptance contract. Verification ran on 2026-09-02 from a clean checkout. No product
code was changed.

No critical, high, medium, or low product defects were found.

## Mandatory first gates

### Claims registry

`.factory/claims.json` exists. It contains 11 unique claims, and each ID appears in
exactly one `@claim:<id>` Playwright test. Before broader QA, every listed command was
run separately through the built preview and passed:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Real-data sentinel survived demo entry/reset/exit; demo keys were separate and cleared on exit. |
| `input-limits` | PASS | 4 and 31 pairs were rejected; 5 passed; 5/10/20 minute choices were present. |
| `study-flow` | PASS | Five prompts completed by keyboard; recap persisted after Library reload. |
| `offline-reload` | PASS | Dedicated context reloaded `/demo` offline and revealed the cached answer. |
| `local-privacy` | PASS | Typed-response/reveal/rating flow made only same-origin requests. |
| `json-backup` | PASS | Session and saved prompt set exported, cleared, restored, and reused. |
| `accessible-layout` | PASS | 390×844 and 1440×1000 had no overflow or undersized tested controls. |
| `display-preferences` | PASS | Ten immediate dark-theme scans were clean; reduced-motion durations were zero. |
| `contour-price` | PASS | Recorded valid license enabled reusable sets and exactly the newest 20 of 21 imported records for $12. |
| `session-timing` | PASS | Pause preserved time; resume and five-minute expiry produced a time-ended recap. |
| `installable-shell` | PASS | Standalone manifest and controlling service worker were present. |

The live landing page, legal pages, README, demo documentation, and UI were
cross-checked against the registry. No unregistered claim-like product promise was
found. Billing price/return/redirect evidence is additionally covered by the live
contract check.

### Cold first read

The live page was opened in fresh 390×844 and 1440×1000 contexts before interaction.
The first screen answers all required questions in plain words:

- What: **“Run a short active-recall study session.”**
- For whom: **“For students and self-learners…”**
- First click: **“Try it with sample data”**, beside **“Opens a five-prompt practice
  session.”**

The primary action ended at 472 CSS px on the 844 px-high mobile viewport. One click
opened `/demo` with a live five-prompt session and the persistent **“Demo — sample
data, nothing is saved”** banner, plus **Reset demo** and **Start for real**.

## Clean install, tests, and build

```text
npm ci                         PASS — 174 packages; 0 vulnerabilities
npm test                       PASS — 18 Vitest + 23 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — tsc + Vite; dist/ produced
npm run test:live-contract     PASS — live catalog and hosted checkout redirect
each claims.json test command  PASS — 11/11 run separately
```

The production build contains 34,660 B JavaScript (11.47 kB gzip), 24,655 B
application CSS (5.86 kB gzip), no font payload, and a 47,956 B mobile hero. These are
within the 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB hero budgets.

## Independent product journeys

- The live primary action opened the isolated sample. A complete five-prompt session
  was performed with keyboard shortcuts, producing a 5-checked/2-to-revisit recap.
  Library persistence survived reload.
- A second live run used only Tab and Enter from the landing page through demo entry,
  then Enter and 1/2 through all five prompts. The primary action was the eighth Tab
  stop and had a designed 3 px focus outline.
- Live setup rejected 4 pairs, a malformed line, and 31 pairs with specific recovery
  text. It accepted both 5 and 30 pairs and exposed exactly 5/10/20 minute options.
- Reset demo returned to prompt 1. Start for real removed every `demo:fss:*` key and
  restored the untouched real-workspace sentinel.
- The repository tests additionally covered malformed nested imports without data
  replacement, poisoned older storage recovery, active-response refresh recovery,
  timer pause/expiry, complete JSON export/import, browser history, and dialog focus.
- A recorded successful license response on the live client proved query-token
  capture, URL stripping, local token storage, optimistic unlock, and one verification
  across reload. No real license or payment was used.

## Privacy, network, and security

- Cold landing load requested only the document, hashed JS, hashed CSS, and the
  responsive same-origin hero. There were no analytics, font, CDN, or other third-party
  requests.
- The whole live sample entry, typed response, five-prompt flow, recap, Library, and
  reload made 10 requests, all to the product origin. Console errors, page errors, and
  failed requests were all zero.
- License verification is the documented exception and targets only
  `https://api.sociobot.in/api/v1/products/focus-study-sprint/verify`.
- Root responses include the restrictive CSP (including header-only
  `frame-ancestors 'none'`), HSTS, `nosniff`, strict referrer policy, and permissions
  policy. HTML revalidates after 30 seconds; hashed assets are immutable for one year;
  `sw.js` is `no-cache`; the manifest has the correct MIME type and revalidates hourly.
- The product verify endpoint enforced **30 successful requests per client window**.
  Request 31 returned HTTP 429 with `Retry-After: 4` and `X-RateLimit-After: 4`.
- The production billing catalog lists the exact $12 USD product and return URL. The
  checkout endpoint redirected to the hosted Sociobot/Dodo flow. No purchase was made.

There is no product sign-in, backend, library package, or CLI, so Entra, persistence
boundary/concurrency, and clean-consumer package tests do not apply.

## Accessibility and responsive behavior

- `/opt/fleet/lib/verify-url.sh` passed the live URL at HTTP 200 in 1,062 ms: useful
  title, `lang=en`, one h1, one main, no missing image alt, no unlabeled button, and no
  console error.
- Independent `@axe-core/playwright` scans found zero serious/critical findings on the
  mobile landing, session, revealed answer, recap, Library, desktop dark treatment,
  Privacy, Terms, and real 404. In fact, those individual scans reported zero
  violations of any severity.
- 390×844 and 1440×1000 had no horizontal overflow. All tested visible links, buttons,
  form controls, and the in-session Pause action met 44 px target sizing.
- At a computed 200% root text size, setup and Library remained usable with 390 px
  content and viewport widths. Skip-link focus moved to main; the license dialog
  focuses Close and exits with Escape in the repository suite.
- Dark mode passed axe. With reduced motion requested, the maximum computed animation
  or transition duration was 0 seconds.
- Visual inspection confirmed the documented topographic field-notebook identity in
  mobile light and desktop dark treatments, with clear hierarchy and no generic
  framework/gradient presentation.

## PWA, routes, and deployment identity

- The manifest reports `display: standalone`, scope `/`, start URL `/?v=6`, and
  192/512 icons including a maskable 512 icon. The live worker controlled `/demo` and
  populated `fss-v6-shell`.
- After one online visit, a dedicated live context reloaded `/demo` offline, displayed
  the offline status, retained the sample, and revealed its answer without errors.
- A disposable two-version server using the exact built shell showed **An app update
  is ready**, activated through **Update app**, reloaded exactly once, retained one
  main landmark, and removed the old cache. Only the new shell/runtime caches remained.
- Privacy and Terms returned 200 with route-specific titles; an unknown path returned
  a designed HTTP 404. Every discovered internal link returned 2xx; the two `mailto:`
  links were valid explicit mail actions.
- All 21 built files, excluding deployment-only `staticwebapp.config.json`, were
  fetched from the custom domain and matched byte-for-byte. Mismatches: **0**. The
  matching root SHA-256 is
  `0a04f396cd17b5a21937caa92bb9dde8db97fdeb324c5b750e7f900143e94bd7`.

This proves the live deployment is the output of candidate `526c2cc`.

## Performance

Live mobile Lighthouse (standard simulated mobile throttling, headless Chromium):

```text
Performance       100
Accessibility     100
Best Practices    100
SEO               100
FCP               0.91 s
LCP               1.21 s
TBT               65 ms
CLS               0
Total byte weight 69,251 B
```

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Final disposition

**PASS.** The candidate is release-ready under the supplied work order.
