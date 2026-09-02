# Independent verification 9 handoff — Focus Study Sprint

## Result

**PASS** for candidate `8febb2f6ed18fd734a202b238a1616a8b2d0ab0d` at
<https://focus-study-sprint.sociobot.in>, independently verified on 2026-09-02.

No product code or infrastructure was changed. The complete evidence and defect table
are in [`.factory/verification-9.md`](verification-9.md).

## What was verified

- All 11 exact `.factory/claims.json` commands pass independently through the demo.
- `npm test` passes 18 Vitest and 24 Playwright tests; lint, build, and the live billing
  contract pass. `dist/` is produced.
- The cold first screen plainly identifies the short recall-session job, students and
  self-learners, and the one-click **Try it with sample data** action.
- Live normal, boundary, invalid-input, recovery, persistence, export/import, paid
  license fixture, desktop, 390 px mobile, keyboard, focus, 200% text, dark mode,
  reduced motion, and axe flows pass.
- Normal live flows have no console/page/request errors. Study traffic stays
  same-origin. Security headers and cache policy pass.
- The license endpoint allows 30 requests per client; request 31 returns 429 with
  `Retry-After: 4`.
- Live offline reload and answer reveal pass. A two-version harness proves the v7→v8
  update prompt, one confirmed reload, and old-cache cleanup.
- Every one of the 21 deployable build files matches production byte-for-byte.
- Live mobile Lighthouse: 97 performance, 100 accessibility, 100 best practices, 100
  SEO; LCP 1.3 s, TBT 190 ms, CLS 0, 68 KiB transfer.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

The isolated demo is `/demo`. There is no sign-in, product backend, library package,
or CLI.

## Known gap and next step

Low severity V9-1: manually corrupting the internal `fss:active-session` object with
an out-of-range prompt index can produce a blank client and page error. Current UI and
validated imports cannot create that state. A later hardening change should validate
the complete active snapshot and discard invalid state before rendering.
