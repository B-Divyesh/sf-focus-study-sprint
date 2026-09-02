# Focus Study Sprint — polish 5 handoff

## Result

**PASS.** Review finding F-5-1 and every earlier finding are closed. The repaired
offline PWA is deployed at <https://focus-study-sprint.sociobot.in> through Static
Web Apps deployment `8aa68553-b47b-477e-8a81-605bb7aab98b`.

The one-click sample is live at <https://focus-study-sprint.sociobot.in/demo> and
through `/?demo=1`. It uses only `demo:fss:*` localStorage keys and the
`demo:focus-study-sprint` IndexedDB database. Reset and every exit clear those
namespaces without changing real study data.

## What changed

- Added `no-advertising-scripts` to `.factory/claims.json` for the public privacy
  promise in README and Privacy.
- Added a tagged browser test that records requests and loaded resources across the
  landing, demo, and Privacy flow. It also scans production HTML, CSS, JavaScript,
  and the service worker for external script/font loading and known analytics or
  advertising integrations.
- Reworded the README promise consistently: “No analytics, advertising trackers,
  or third-party fonts and scripts ship.”
- Updated the catalog line to “Practice recalling answers in short study sessions.”
  It is verb-first and 51 characters.
- Advanced the product footer to `v1.1.5 · polish-5`, the service-worker cache to
  `fss-v12`, and the manifest start URL to `/?v=12`.
- Made Playwright accept an external base URL for live verification. The 200% text
  check now uses a CSP-compatible browser style change.

The quiet topographic field-notebook visual system, original artwork, static PWA
class, local-first data model, and one-time Sociobot Contour purchase remain intact.

## Verification

Clean clone: `/tmp/focus-study-sprint-polish-5-final-clean.lcUjZR` at
`23b8cb00f293b647c5e83db538002e2142efcae6`.

- `npm ci` passed with zero reported vulnerabilities.
- All 15 exact claim commands passed separately. Their complete output is
  `claim-results.log` inside the clean clone.
- `npm run test:release` passed: 26 Vitest unit/deployment checks, 29 Playwright
  browser tests, TypeScript, production build, and the live billing check.
- `dist/index.html` exists. The app bundle is 35.34 kB raw / 11.56 kB gzip; CSS is
  24.82 kB raw / 5.88 kB gzip.
- `git diff --check` passed.

Live evidence: `/tmp/focus-study-sprint-polish-5-live.Mi4Rjn`.

- The full 29-test Playwright suite passed against the production URL. This covers
  all claim tests, demo isolation, offline reload, malformed-data recovery, 390 px
  and 200% text layouts, keyboard/dialog focus, route history, metadata, 404, and
  service-worker control.
- Playwright Axe found zero serious or critical findings on all app/legal states and
  explicit light and dark themes.
- `/opt/fleet/lib/verify-url.sh` passed with no console/page errors. Screenshots:
  `screenshot-desktop.png`, `screenshot-mobile.png`, `live-root-mobile.png`,
  `live-demo-mobile.png`, and `live-404-mobile.png`.
- `live-recheck.json` records the plain first-screen copy, visible 350×50.8 px demo
  action, zero overflow, isolated demo reset/exit, all route metadata/statuses, and
  zero cross-origin requests or console/page errors.
- Lighthouse mobile scored 100 Performance, 100 Accessibility, 100 Best Practices,
  and 100 SEO. LCP was 1.30 s, CLS 0, and total blocking time 18 ms.
- `headers-and-version.log` records the production CSP and security headers,
  manifest MIME/cache policy, no-cache service worker, and `fss-v12` shell.

## Run and deploy

```sh
npm ci
npm run test:release
npm run build
/opt/fleet/lib/deploy-static.sh focus-study-sprint dist
```

## Known gaps

None.
