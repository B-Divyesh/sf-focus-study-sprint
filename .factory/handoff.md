# Review 3 handoff — Focus Study Sprint

## Result

**PASS.** All findings from review 1, review 2, and review 3 are closed. The
deployed repair is commit `4d5bcdfb472957f4507f4db44ede99a305947f24` at
<https://focus-study-sprint.sociobot.in>.

## What changed

- Demo exits now delete `demo:fss:*` keys and the entire
  `demo:focus-study-sprint` IndexedDB database before navigation. Privacy and Terms
  links use the same exit path, with a legal-page fallback for an exit link opened
  outside the app shell.
- Added the `billing-destination` claim and recorded-request browser proof. Removed
  the untestable public-key sentence.
- Rewrote the review-3 wording issues in the landing page, README, privacy policy,
  and purchase copy. The catalog description is verb-first and 50 characters.
- Bumped the PWA shell to `fss-v10` / manifest `?v=10` so installed clients receive
  the changed shell.

## How to run and verify

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:release
```

The isolated demo is `/demo` or `/?demo=1`. Its Reset demo and Start for real
controls are persistent. See `.factory/demo.md` for sample contents and storage
namespaces.

## Exact verification evidence

- Clean clone: `/tmp/focus-study-sprint-polish-3-clean.fkV5HY`, cloned with
  `git clone --no-local`, then `npm ci`.
- Every one of the 14 commands listed in `.factory/claims.json` was run separately
  in that clone and passed: demo isolation, limits, keyboard study flow, offline
  reload, local privacy, JSON backup, free core, scope limits, responsive layout,
  display preferences, Contour price, billing destination, timing, and installability.
- The clean clone then passed `npm run test:release`: 25 Vitest tests, 28 Playwright
  tests, type check, production build, and live billing-contract verification.
- Final local build: `npm run build` passed and wrote `dist/index.html`. Initial app
  JavaScript is 35.24 kB raw / 11.55 kB gzip; CSS is 24.66 kB raw / 5.86 kB gzip.
- Live factory verification: `/opt/fleet/lib/verify-url.sh
  https://focus-study-sprint.sociobot.in /tmp/focus-study-sprint-polish-3-live.kRNGvh`
  passed (HTTP 200, 776 ms cold navigation, title/lang/one h1/main/alt checks, no
  console errors). Screenshots: `/tmp/focus-study-sprint-polish-3-live.kRNGvh/screenshot-desktop.png`,
  `/tmp/focus-study-sprint-polish-3-live.kRNGvh/screenshot-mobile.png`,
  `/tmp/focus-study-sprint-polish-3-live.kRNGvh/live-root-mobile.png`, and
  `/tmp/focus-study-sprint-polish-3-live.kRNGvh/live-demo-mobile.png`.
- Live cold recheck: `/tmp/focus-study-sprint-polish-3-live.kRNGvh/live-recheck.json`.
  It confirms direct demo entry, real-data preservation, demo database deletion on
  Demo → Privacy → Start, a fresh prompt 1 on re-entry, 200s and one h1/main for
  every public route, the designed 404 status, route-specific titles, and no live
  Axe serious/critical findings. The 404 has only Chromium’s expected failed 404
  navigation-resource console entry.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100. Report: `/tmp/focus-study-sprint-polish-3-live.kRNGvh/lighthouse-mobile.json`.
- `npm run test:live-contract` passed after deployment: the $12 catalog entry and
  hosted Sociobot checkout redirect are available.

## Deployment

Built `dist/` was deployed with `/opt/fleet/lib/deploy-static.sh focus-study-sprint
/work/repo/dist`. Azure deployment `be06ef76-558f-434a-8e04-62165f1b83e7` succeeded,
the existing `sf-focus-study-sprint` app remained in `eastus2`, and the custom domain
returned HTTPS 200 after deployment.

## Known gaps and next steps

None. The product remains a local-first offline PWA with no generated lessons, as
required by the brief.
