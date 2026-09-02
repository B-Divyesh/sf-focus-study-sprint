# Polish 1 handoff — Focus Study Sprint

## Delivered

Polished and deployed the released candidate from the first adversarial review. The
product keeps its topographic field-notebook identity while now has one shared
navigation/footer system, a complete sitemap, plain first-screen wording, consistent
study-session terminology, a descriptive limits section, and no untested footer
provenance promise.

The one-click `/demo` sandbox remains isolated in `demo:focus-study-sprint` IndexedDB
and `demo:fss:*` localStorage. It retains its persistent banner, Reset demo, and Start
for real controls. PWA app-shell cache and manifest start URL are versioned as v7.

## Revision and deployment

- Application revision deployed: `4f43c97839f1e7e6cf7065399c238e6464dffd50`
- Production URL: <https://focus-study-sprint.sociobot.in>
- Static deployment: Azure Static Web App `sf-focus-study-sprint`, production environment
- Finding-by-finding closure: [`.factory/polish-1.md`](polish-1.md)

## Verification

- Clean clone `/tmp/focus-study-sprint-final.Ux0GJ9` at the deployed revision: `npm ci`,
  `npm test` — 18 unit and 24 browser tests passed — then `npm run build`; `dist/index.html`
  exists.
- Every one of the 11 commands in `.factory/claims.json` was separately executed from a
  clean clone. The final clean clone also executes each tagged claim in the full suite.
- Final workspace commands passed: `npm test`, `npm run build`, and `npm run test:live-contract`.
- Live cold checks passed for `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/`:
  200 status, route-specific title, one h1, one main, and no console/page errors.
- Live `/not-a-route` returns the designed page with status 404. The browser’s failed-resource
  message is the expected consequence of that intentional HTTP 404.
- Live axe checks on root, demo, privacy, and terms: no serious or critical findings.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
  Report: `/tmp/focus-study-sprint-lighthouse.json`.
- Evidence screenshots: `/tmp/focus-study-sprint-live-mobile.png` and
  `/tmp/focus-study-sprint-live-demo-mobile.png`.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:live-contract
```

Deploy the contents of `dist/` through the scoped Static Web App configuration.

## Known gaps

None. No review finding remains open.
