# Independent verification 12 — Focus Study Sprint

## Result

**PASS.** Candidate 35da3327eb8db50a3315500333ee48c8e9d86b08 is the exact payload deployed at https://focus-study-sprint.sociobot.in. Verification ran on 2026-09-02 from this clean checkout. No product code, deployment, or infrastructure was changed.

## First read and demo gate

In a fresh live browser context, the opening screen says **“Practice recalling answers in a short session.”** It identifies students and self-learners who want focused practice without streaks, feeds, or generated lessons. Its first obvious action, **“Try it with sample data,”** says that it opens a five-prompt practice session.

One click entered /demo at prompt 1 of 5. The persistent **“Demo — sample data, nothing is saved”** banner included Reset demo and Start for real. The plain-words and one-click isolated-demo requirements pass.

## Claims gate

.factory/claims.json exists with 14 unique claims and matching claim browser tests. After clean npm ci, every exact test command in the manifest was run independently through the demo entry point; all passed. The clean full suite below also passed every claim test.

| Claim | Result | Observable result |
| --- | --- | --- |
| demo-isolation | PASS | Demo storage/reset/exit did not alter real data. |
| input-limits | PASS | 5–30 pairs and only 5/10/20-minute choices were enforced. |
| study-flow | PASS | Keyboard completion produced a persisted recap. |
| offline-reload | PASS | A fresh demo reloaded offline and revealed its cached answer. |
| local-privacy | PASS | Demo study activity made no cross-origin request. |
| json-backup | PASS | Full JSON export, clear, import, and prompt-set reuse worked. |
| free-core | PASS | Unlicensed real sessions and backup/restore worked. |
| scope-limits | PASS | Supplied content and self-rating only; no grading, generation, or retention mechanics. |
| accessible-layout | PASS | 390px and desktop layouts had no horizontal overflow and usable controls. |
| display-preferences | PASS | Explicit themes passed serious/critical axe checks; reduced motion removed movement. |
| contour-price | PASS | $12 fixture unlocked saved sets and exactly the latest 20 of 21 records. |
| billing-destination | PASS | Checkout and the sole license request used Sociobot billing with only license as query key. |
| session-timing | PASS | Pause retained time and expiry produced a time-ended recap. |
| installable-shell | PASS | Standalone manifest and active app-owned worker were present. |

## Quality gates

    npm ci                     PASS — 174 packages installed; 0 vulnerabilities reported
    npm test                   PASS — 25 Vitest tests and 28 Playwright tests
    npm run lint               PASS — tsc --noEmit
    npm run build              PASS — exact production build; dist/ produced
    npm run test:live-contract PASS — live $12 catalog entry and checkout redirect
    git diff --check           PASS

Initial application JavaScript is 35,336 B raw / 11.56 kB gzip; main CSS is 24,815 B raw / 5.88 kB gzip; the mobile hero is 47,956 B. These meet the static/PWA budgets.

## Independent live evidence

- Completed the live five-prompt demo using Enter then 1/2 only; its persisted recap appeared in Library. Invalid input and corrupt backup recovery passed in the clean browser suite.
- Fresh live desktop and 390×844 contexts had one h1 and main, no console/page errors, no horizontal overflow, and a 350×50.8px demo action. Reduced-motion context had zero visible transitions/animations. Live axe found zero serious/critical violations; the local suite also covered all app states, legal pages, dark mode, 200% text, skip link, and dialog focus.
- Complete live demo request logging observed only the product origin: no analytics, third-party assets, prompt, response, or study data left the origin. The product has no sign-in.
- Root, demo, Library, About, Privacy, and Terms returned 200; an unknown route returned the designed 404. Headers include a self-first CSP with header-only frame-ancestors none, HSTS, nosniff, strict referrer policy, restrictive permissions policy, immutable fingerprinted assets, and a no-cache service worker.
- The standalone manifest has two icons and start URL /?v=11; /sw.js controls the app. A fresh live demo reloaded offline and revealed its answer. A disposable two-version server serving the unmodified candidate then a v12 worker showed **“An app update is ready”**; Update app activated fss-v12-shell/fss-v12-runtime with one h1/main and no errors.
- Live mobile Lighthouse: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.2 s, CLS 0, total transfer 69 KiB. The first Chromium measurement crashed; retrying with supplied-browser shared-memory-safe flags passed.

## Deployment identity and rate limit

I rebuilt the candidate then SHA-256 compared every deployable file except deployment-only staticwebapp.config.json with the matching live response: **23 files compared, 0 mismatches**. The deployed fingerprinted assets are therefore from this candidate.

The product-scoped license verification endpoint admitted 30 sequential requests from this client. Request 31 returned **429** with Retry-After: 3 and X-RateLimit-After: 3.

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | None. |

## Final disposition

**PASS.** The deployed candidate fulfills the researched brief’s finite, calm, local answer-practice workflow and meets the release contract.

