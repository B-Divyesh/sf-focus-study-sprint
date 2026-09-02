# Independent verification 10 — Focus Study Sprint

## Result

**PASS** — candidate `7bd0f882ab62eafe10787eb0becc5bba6c943de9` is deployed at
<https://focus-study-sprint.sociobot.in> and satisfies the supplied researched
brief and release contract. Verification was run on 2026-09-02 from this clean
candidate checkout. No product code or infrastructure was changed.

## First-read and demo gate

I opened the live root in a fresh browser context before interacting. It plainly
says what it does — **“Practice recalling answers in a short session.”** — who it
is for — students and self-learners who want focused practice without streaks,
feeds, or generated lessons — and what to click first: **“Try it with sample
data,”** with the nearby explanation **“Opens a five-prompt practice session.”**

That one click opened `/demo` at prompt 1 of 5. The persistent **“Demo — sample
data, nothing is saved”** banner includes Reset demo and Start for real. Keyboard
Enter then 1/2 completed all five prompts; the recap persisted in Library. This
meets the plain-words and one-click sandbox requirement.

## Claims gate

`.factory/claims.json` is present. I installed with `npm ci` and, before broader
testing, ran every listed command separately through the production preview/demo
entry point. All 13 passed:

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Real-data sentinel survived demo enter/reset/exit; demo storage used `demo:` namespaces. |
| `input-limits` | PASS | 4 and 31 pairs failed, 5 passed, and 5/10/20-minute choices existed. |
| `study-flow` | PASS | Keyboard Enter and 1/2 finished five prompts and the recap survived reload. |
| `offline-reload` | PASS | Fresh demo context reloaded offline and revealed the cached expected answer. |
| `local-privacy` | PASS | Typed answer, reveal, and rating made no cross-origin request. |
| `json-backup` | PASS | Session and saved set exported, cleared, restored, and were reusable. |
| `free-core` | PASS | Unlicensed real workspace completed, exported, cleared, and restored core data. |
| `scope-limits` | PASS | Shipped prompt/expected answer/self-rating flow has no teaching, grading, or generation request. |
| `accessible-layout` | PASS | 390×844 and 1440×1000 had no overflow and tested controls were at least 44 px. |
| `display-preferences` | PASS | Dark-mode axe scans passed and reduced-motion durations were zero. |
| `contour-price` | PASS | Recorded valid verification unlocked saved sets and exactly the latest 20 of 21 records for $12. |
| `session-timing` | PASS | Pause retained time; expiry produced the time-ended recap. |
| `installable-shell` | PASS | Standalone manifest and active app-owned service worker were present. |

## Clean quality gates

```text
npm ci                         PASS — 174 packages, 0 vulnerabilities
npm test                       PASS — 25 Vitest tests and 27 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — tsc + Vite; dist/ produced
npm run test:live-contract     PASS — $12 production catalog entry and hosted checkout redirect
git diff --check               PASS
```

The exact build has 35,570 B application JS (11.73 kB gzip), 24,655 B application
CSS (5.86 kB gzip), no downloaded fonts, and a 47,956 B mobile hero. These are
within the static/PWA bundle budgets. A fresh live mobile Lighthouse run reported
Performance 94, Accessibility 100, Best Practices 100, SEO 100, FCP 1.1 s, LCP
1.3 s, CLS 0, and 54 KiB total transfer.

## Independent live product QA

- Normal path: live one-click demo completed all five self-rated prompts by keyboard,
  produced the private recap, and retained it in Library.
- Boundaries and recovery: live setup rejected 4 pairs, accepted 5 and 30, rejected
  31, showed exactly 5/10/20-minute choices, rejected a malformed line with a
  specific instruction, and became startable after correction.
- The designed live 404 returns HTTP 404 with its own title, one h1, and one main.
  All discovered internal links returned HTTP 200.
- At 390×844 the initial action was visible and there was no horizontal overflow;
  at 1440×1000 there was likewise no overflow and no interactive target below 44 px.
  The skip link moved focus to main. Reduced-motion computed duration was 0 seconds.
- Axe found zero serious or critical findings on root (light and dark), demo,
  Privacy, Terms, About, and Library. Normal-path console and page errors were zero.
  Visual review of live 390px light and desktop dark screens confirms the documented
  quiet topographic field-notebook system is legible and product-specific.

## Privacy, headers, rate limit, and deployment identity

- The full independent demo flow made no request to another origin. The cold load
  requested only the document, hashed JS/CSS, and product hero from the product
  origin. No analytics, CDN fonts/scripts, prompt, or typed answer left the origin.
- Live root headers include a self-only CSP with header-only
  `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict
  referrer policy, and restrictive permissions policy. HTML has 30-second
  revalidation; hashed assets are one-year immutable; `sw.js` is `no-cache`; the
  manifest is `application/manifest+json` with one-hour revalidation.
- The public license verification endpoint allowed 30 requests from one client.
  Request 31 returned **429** with `Retry-After: 4` and `X-RateLimit-After: 4`.
  The product has no sign-in; Entra verification does not apply.
- SHA-256 comparison of every deployable build output against the live custom-domain
  response compared 21 files (excluding deployment-only `staticwebapp.config.json`):
  **0 mismatches**. This proves production serves this candidate build.

## PWA verification

The live `/demo` page obtained the `/sw.js` controller, manifest `display:
standalone`, and `start_url: /?v=9`. In a dedicated fresh context, after the first
online visit, an offline reload showed the offline notice and still revealed the
sample answer. A disposable in-memory host served the unmodified build as v9 and
then a v10 service-worker response: the app showed **“An app update is ready,”**
Update app activated `fss-v10-shell`/`fss-v10-runtime`, retained one main landmark,
and raised no error. No product files were changed for this test.

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | None. |

## Final disposition

**PASS.** The deployed candidate matches the tested commit and fulfills the calm,
finite, local-first active-recall job described in the brief.
