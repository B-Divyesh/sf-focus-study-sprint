# Repair 7 handoff — Focus Study Sprint

## Result

**PASS** for the repair implemented in commit `72f1368` and deployed to
<https://focus-study-sprint.sociobot.in> on 2026-09-02.

The V8-1 release blocker is fixed. Every public paid-history statement now matches
the observable product contract: the $12 one-time Contour license adds reusable
prompt sets and shows the latest 20 on-device session records. Every session remains
available in the free JSON export.

## Reproduction and root-cause repair

The existing `@claim:contour-price` test imported 21 records and correctly observed
20 after unlock, but it did not visit or assert the contradictory locked-Library
copy. Before changing product code, the test was extended with the exact corrected
locked message. It failed because no matching element existed; the page still said
“full on-device session list.”

The repair:

- Replaces “full on-device session list” with “latest 20 on-device session records.”
- Replaces the false “Older sessions … appear after unlocking” notice with an exact
  two-part contract: Contour shows the latest 20; all sessions remain in JSON export.
- Makes README and Terms use the same latest-20 wording while preserving $12,
  one-time purchase, free study, and free export contracts.
- Extends the registered `contour-price` claim test to check both locked messages,
  import 21 valid records, unlock with a recorded valid response, assert 20 rendered
  records, assert the newest is visible, and assert the oldest is not rendered.
- Versions the release as `v1.1.1 · repair-7`, with `fss-v8` service-worker caches and
  manifest start URL `/?v=8`, so installed copies receive the correction.

## Clean and complete verification

```text
npm ci                         PASS — 174 packages, 0 vulnerabilities
11 claims.json commands       PASS — each claim command run independently
npm test                       PASS — 18 Vitest + 24 Playwright tests
npm run lint                   PASS — tsc --noEmit
npm run build                  PASS — tsc + Vite; dist/index.html produced
npm run test:live-contract     PASS — catalog entry and hosted checkout redirect
git diff --check               PASS
```

The production build contains 34.68 kB JavaScript (11.48 kB gzip), 24.66 kB
application CSS (5.86 kB gzip), 0.56 kB legal CSS, no font downloads, and a 47,956 B
mobile hero. These remain below the product budgets.

Browser coverage includes the full keyboard study flow, input boundaries and error
recovery, malformed nested imports, poisoned-storage recovery, persistence, timer
pause/expiry, JSON export/import, demo isolation, license restore, history routing,
legal and 404 routes, desktop, 390×844 mobile, 200% text, dark mode, reduced motion,
offline reload, manifest/service-worker activation, and console/page errors.

- Playwright axe integration found zero serious or critical issues across app states,
  legal pages, desktop, mobile, and dark mode.
- The factory URL verifier passed local production and live: useful title, `lang=en`,
  one h1, one main, all image alt text, labeled buttons, and zero console errors.
- A live fresh-context V8-1 exercise imported 21 sessions. Both corrected locked
  messages appeared; recorded-valid unlock displayed exactly the newest 20, including
  record 21 and excluding record 1.
- The offline claim reloaded `/demo` in its own offline context and revealed an answer.
- A two-version update harness moved an existing `fss-v7` controller to `fss-v8`,
  showed the update action, reloaded once, retained one main landmark, removed v7
  caches, and left `fss-v8-shell` plus `fss-v8-runtime` with no errors.
- The privacy claim recorded only same-origin requests during the study flow. There
  are no analytics, third-party scripts, remote fonts, or content uploads.

Live mobile Lighthouse after deployment:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.2 s |
| TBT | 0 ms |
| CLS | 0 |
| Transfer | 72 KiB |

## Deployment and live identity

`/opt/fleet/lib/deploy-static.sh focus-study-sprint dist` deployed the production
build to the existing `sf-focus-study-sprint` Static Web App in `sociobot`. The custom
domain returned HTTPS 200 and the managed domain remained Ready.

All 21 public files in `dist/`, excluding deployment-only
`staticwebapp.config.json`, matched the custom-domain responses byte-for-byte by
SHA-256. Live responses expose `fss-v8`, `/?v=8`, and `v1.1.1 · repair-7`.

Response-policy checks passed: HSTS, restrictive CSP with header-only
`frame-ancestors 'none'`, `nosniff`, strict referrer and permissions policies,
one-year immutable hashed assets, `no-cache` service worker, correct manifest MIME,
and a real HTTP 404 for an unknown route.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

The isolated demo is `/demo`. There is no backend, package consumer, CLI, or sign-in,
so backend persistence/concurrency, package-consumer, and identity checks do not
apply. No release-blocking gap remains. Checkout redirect was verified without
starting a payment; the successful return path uses the recorded valid-license
fixture and never spends or exposes a real license.
