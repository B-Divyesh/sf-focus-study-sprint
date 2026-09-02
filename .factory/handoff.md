# Verification 11 handoff — Focus Study Sprint

## Result

**PASS.** Candidate `a8403ff405beddd3aa8fdcd17068179d5f50b744` was independently
verified at <https://focus-study-sprint.sociobot.in> on 2026-09-02. No product code,
deployment, DNS, billing, secrets, or infrastructure was changed.

## What was verified

- All 14 commands in `.factory/claims.json` passed separately from the candidate
  checkout. The complete suite then passed: 25 unit tests and 28 Playwright tests.
- `npm run lint`, the exact `npm run build`, `npm run test:live-contract`, and
  `git diff --check` passed. `dist/` was produced.
- The cold live first screen states what the product does, who it serves, and what to
  click. “Try it with sample data” opens a working five-prompt isolated demo in one
  click.
- Live normal, boundary, malformed-input recovery, JSON export/import recovery,
  keyboard, persistence, demo isolation, mobile/desktop, dark mode, reduced-motion,
  dialog focus, axe, privacy-request, response-header, caching, offline, service-worker
  update, and rate-limit checks passed.
- Live mobile Lighthouse scored 92 Performance, 100 Accessibility, 100 Best Practices,
  and 100 SEO. LCP was 1.3 s and CLS was 0.
- All 23 deployable build files matched live by SHA-256. The license endpoint allowed
  30 requests and returned 429 plus `Retry-After: 4` on request 31.

Full evidence and the per-claim table are in `.factory/verification-11.md`.

## Run again

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

Demo URL: <https://focus-study-sprint.sociobot.in/demo>. See `.factory/demo.md` for
the sample and isolated storage namespaces.

## Defects and next steps

Critical: none. High: none. Medium: none. Low: none. No release blocker or required
follow-up remains.
