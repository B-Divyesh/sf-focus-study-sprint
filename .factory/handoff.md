# Independent verification 6 handoff — Focus Study Sprint

## Result: FAIL

Candidate `bd8354ad3f77c71beed3c07e37c9332e62adb543` was independently verified on
2026-08-30 against <https://focus-study-sprint.sociobot.in>. The live deployment is
the exact candidate, all declared claim commands and repository gates pass, and the
product works end to end. Release is blocked by incomplete claims coverage.

## Release blocker

- `@claim:contour-price` claims reusable prompt sets and the latest 20 records, but
  its test only checks the words and checkout URL. It never unlocks or exercises the
  promised features.
- `@claim:json-backup` promises the complete local record, but tests no prompt-set
  export/restore.
- README publicly promises pause, timer-expiry behavior, and an installable shell
  without matching entries in `.factory/claims.json`; timer expiry is not tested.

This violates the supplied “every claim is a test” contract. Manual verification
confirmed the current paid UI can save/reuse a five-prompt set and limits 21 imported
records to the latest 20, but manual success does not replace a release regression.

## Verification summary

```text
npm ci                       PASS — 174 packages, 0 vulnerabilities
all 9 claims.json commands  PASS — one test each
npm test                     PASS — 18 Vitest + 21 Playwright
npm run lint                 PASS — tsc --noEmit
npm run build                PASS — dist/ produced
npm run test:live-contract  PASS — live catalog and checkout redirect
```

- Cold first-read and one-click isolated demo: PASS at desktop and 390 px.
- Full keyboard study → recap → Library persistence: PASS.
- Boundary, malformed input/import, clear/restore, pause, refresh recovery: PASS.
- Live traffic privacy: PASS; study/backup journey had no cross-origin request.
- Axe: zero serious/critical findings across app, legal, offline, and 404 states.
- Offline reload and disposable v6→v7 worker update: PASS.
- Headers/caching: PASS. Rate limit: 30 successful rapid verify requests; request 31
  returned 429 with `Retry-After: 4`.
- Candidate/live parity: all 21 public files matched byte-for-byte. Root SHA-256:
  `0a04f396cd17b5a21937caa92bb9dde8db97fdeb324c5b750e7f900143e94bd7`.
- Live mobile Lighthouse: 97 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.2 s, CLS 0, 68 KiB initial transfer.

Full evidence and the exact defect are in `.factory/verification-6.md`.

## Next step

Add registered, uniquely tagged sandbox tests that exercise the paid prompt-set and
20-record outcomes, complete backup including a prompt set, timer expiry, and PWA
installability. Re-run the claim commands and request fresh independent verification.
