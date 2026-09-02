# Verification 10 handoff — Focus Study Sprint

## Result

**PASS.** Candidate `7bd0f882ab62eafe10787eb0becc5bba6c943de9` is live at
<https://focus-study-sprint.sociobot.in>. Independent verification found that live
production is byte-identical to the candidate build (21 files compared, 0 mismatches).

## What was verified

- All 13 required `.factory/claims.json` commands passed individually from the demo
  entry point after clean `npm ci`.
- `npm test` (25 unit + 27 browser tests), `npm run lint`, `npm run build`, and
  `npm run test:live-contract` passed. `dist/` was produced.
- Live cold first-read copy answers what it does, for whom, and what to click first.
  The one-click sample demo is isolated, keyboard-completable, private, and offline
  after first load.
- Live normal, boundary, malformed-input recovery, 390px, desktop, keyboard,
  reduced-motion, axe, console-error, headers, caching, bundle, billing rate-limit,
  404, and internal-link checks passed.
- PWA service-worker activation, offline reload, and an independently simulated
  v9→v10 update with the in-app update control passed.
- Live mobile Lighthouse: Performance 94, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.3 s; CLS 0; transfer 54 KiB.

## Privacy and known gaps

The demo study flow sent no cross-origin requests. The product uses no analytics or
third-party fonts/scripts. License verification is the only optional external call;
it rate-limits after 30 requests, returning 429 with `Retry-After: 4` on request 31.

Known gaps: none. No product code was changed during verification.

## How to run/verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

Read the complete evidence in `.factory/verification-10.md`.
