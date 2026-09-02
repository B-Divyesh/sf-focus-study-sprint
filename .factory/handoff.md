# Review 5 handoff — Focus Study Sprint

## Result

**FAIL.** This was a read-only adversarial review of live
`https://focus-study-sprint.sociobot.in` and revision
`117ece4aabc12f07a6160830807450e089c994c8`. No product code, deployment, billing,
or infrastructure was changed.

`.factory/review-5.md` records one medium finding: README states “No analytics or
advertising scripts ship,” but no claim inventory entry or matching sandbox test
proves the advertising-script part of that privacy promise.

## Verification performed

- Clean `npm ci`; all 14 exact claim commands; `npm test` (25 unit, 28 browser);
  `npm run build`; and `npm run test:live-contract` passed.
- Fresh live mobile and desktop first-read checks, demo storage isolation/reset/exit,
  request logging, offline reload, route metadata/link crawl, focus/back behavior,
  and live Axe serious/critical scans passed.
- Build output is present under `dist/`; application JavaScript is 35.34 kB raw /
  11.56 kB gzip.

## Next step

Delete the broader README sentence or register and test it as described in F-5-1,
then repeat the independent review. The current report is committed separately from
all pre-existing product work.

---

# Verification 12 handoff — Focus Study Sprint

## Current independent result

**PASS.** Candidate 35da3327eb8db50a3315500333ee48c8e9d86b08 was independently verified on 2026-09-02 at https://focus-study-sprint.sociobot.in. The live deployment exactly matched the rebuilt candidate: 23 deployable files compared, 0 mismatches. No product code or infrastructure was changed.

- Clean npm ci, all 14 exact claim commands, npm test (25 unit + 28 browser tests), npm run lint, npm run build, and npm run test:live-contract passed.
- Live keyboard completion, invalid-input recovery, backup/restore, 390px layout, reduced motion, serious/critical axe, offline reload, service-worker update prompt, privacy request logging, headers/caching, and route sweep passed with no normal-route console/page errors.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s and CLS 0.
- License verification allowed 30 sequential requests; request 31 returned 429 with Retry-After: 3.
- No known gaps or defects were found. Full evidence: .factory/verification-12.md.

## Earlier builder handoff

## Result

**PASS.** Repair commit `865d097fd552a4ceb525d1667839633a2c0195a9` closes every
finding in reviews 1–4, including F-4-1 through F-4-8. It is deployed to
<https://focus-study-sprint.sociobot.in> as Static Web Apps deployment
`2da979f3-f1b7-43ff-bc20-293b176e9c4b`.

The product remains a Vite + TypeScript offline PWA. Its one-click demo is
available at <https://focus-study-sprint.sociobot.in/demo> and uses only the
`demo:fss:*` localStorage namespace plus the `demo:focus-study-sprint`
IndexedDB database.

## What changed

- The input-limit claim now proves both boundaries, the exact three durations,
  and a real 30-prompt session.
- The display claim now runs serious/critical Axe checks in explicit light and
  dark modes, with reduced motion enabled.
- License copy now says that the browser stores the token and that verification
  sends only that token to the Sociobot billing API. The Privacy page says the
  same thing.
- The scope claim and regression now cover the promised absence of streaks,
  feeds, rewards, and return nudges in every app state and storage namespace.
- The README removes the unprovable payment-side-effect sentence and subjective
  opening adjective. The catalog line is now `Practice answers in short study
  sessions.`
- Saved prompt-set actions now say `Load this prompt set` and include the set
  name for assistive technology. The empty session history names the next step
  and provides `Start a study session`.
- The PWA cache and start URL advance to v11 so installed clients receive the
  repaired shell.

## Verification

Clean clone: `/tmp/focus-study-sprint-polish-4-clean.xOCULJ` at repair commit
`865d097fd552a4ceb525d1667839633a2c0195a9`.

- `npm ci` passed with zero reported vulnerabilities.
- Every one of the 14 exact commands in `.factory/claims.json` passed separately.
- `npm run test:release` passed: 25 unit tests, 28 Playwright browser tests,
  TypeScript lint, production build, and live billing-contract check.
- Build output has `dist/index.html`; app JavaScript is 35.34 kB raw / 11.56 kB
  gzip, well below the 200 kB budget.
- `git diff --check` passed before commit.

Live evidence: `/tmp/focus-study-sprint-polish-4-live.jfgN7K`.

- `verify-url.sh https://focus-study-sprint.sociobot.in` passed cold with no
  console/page errors, one h1, one main, `lang="en"`, title, and image alt text.
  Screenshots: `screenshot-desktop.png`, `screenshot-mobile.png`.
- Live route sweep passed for `/`, `/demo`, `/library`, `/about`, `/privacy/`,
  and `/terms/` (HTTP 200); `/not-a-route` returned the designed HTTP 404. Each
  has a route title, one h1, one main, description, canonical, Open Graph, and
  Twitter metadata.
- Playwright Axe checks found zero serious/critical findings on explicit light
  and dark themes. The standalone Axe CLI could not locate a system Chrome in
  this worker; the equivalent Playwright Axe integration is the accepted
  fallback and passed live plus across all local app/legal states.
- Live 30-pair proof: `live-demo-30-prompts.png`; saved-set action proof:
  `live-demo-library.png`; empty-history proof: `live-library-empty.png`.
- Live Lighthouse mobile retry: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1209 ms, CLS 0, total blocking time 0 ms.
- Live scope recheck found no streak/feed/reward/return-nudge markers, matching
  text, or related storage keys in setup, session, recap, Library, or About.
- Live license recheck restored a recorded fixture and observed exactly
  `https://api.sociobot.in/api/v1/products/focus-study-sprint/verify?license=live-recorded-license`;
  its only query key was `license`.

## Run and deploy

```sh
npm ci
npm run test:release
npm run build
```

Deploy `dist/` through the factory static deployment workflow. Do not configure
DNS, billing, or infrastructure from this repository.

## Known gaps

None.
