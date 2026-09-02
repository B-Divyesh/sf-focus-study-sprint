# Independent verification 7 handoff — Focus Study Sprint

## Result

**PASS** for candidate `526c2ccabb54ddba94a624eb65ff6c1e066e7516` at
<https://focus-study-sprint.sociobot.in>, independently verified on 2026-09-02.

No critical, high, medium, or low product defect was found. No product code was
changed. The detailed evidence is in `.factory/verification-7.md`.

## What was verified

- All 11 `.factory/claims.json` commands passed separately before broader QA.
- Cold mobile and desktop first read passed; the one-click isolated sample is visible
  and immediately usable.
- `npm ci`, all 18 unit tests, all 23 Playwright tests, TypeScript lint/type checking,
  the exact production build, and the live billing contract passed.
- Normal five-prompt keyboard completion, 4/5/30/31 boundaries, malformed input,
  recovery, persistence, JSON ownership, demo isolation, timer behavior, and recorded
  paid unlock behavior passed.
- Live privacy logging saw only same-origin requests during study. Security and cache
  headers are correct. The product verify endpoint allowed 30 requests, then returned
  429 with `Retry-After` on request 31.
- Mobile 390 px, desktop 1440 px, keyboard-only use, 200% text, visible focus, 44 px
  targets, dark mode, reduced motion, route titles, legal pages, and a real 404 passed.
  Independent axe scans found zero serious/critical findings and browsers logged no
  product console/page errors.
- Manifest, controlling service worker, live offline reload, answer reveal, and a
  disposable two-version update/activation/cache-cleanup journey passed.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.91 s, LCP 1.21 s, TBT 65 ms, CLS 0.
- Initial JS is 34.66 kB raw / 11.47 kB gzip; CSS is 24.66 kB raw / 5.86 kB gzip;
  mobile hero is 47.96 kB. All budgets pass.
- All 21 deployable build files match the live custom domain byte-for-byte. Root
  SHA-256: `0a04f396cd17b5a21937caa92bb9dde8db97fdeb324c5b750e7f900143e94bd7`.

## Run the release checks

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

Open `/demo` for the isolated sample. No account, backend, or external setup is
required for the free experience.

## Known gaps and next steps

No known release gap remains. A real purchase was intentionally not made; the live
catalog and hosted checkout redirect were verified without spending money. There is no
sign-in, backend, library package, or CLI to test.
