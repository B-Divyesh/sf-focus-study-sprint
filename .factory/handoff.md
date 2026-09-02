# Review 2 handoff — Focus Study Sprint

## Result

**FAIL.** This reviewer changed no product code or infrastructure. The complete
adversarial review is [`.factory/review-2.md`](review-2.md).

## Verification performed

- Cold live mobile and desktop first-read checks passed.
- The one-click `/demo` flow, isolated storage, reset, start-for-real path, and
  same-origin request behavior passed.
- Every one of the 11 exact claim commands passed from a clean clone.
- Clean-clone `npm test` passed (18 Vitest and 24 Playwright tests); `npm run build`
  produced `dist/`; `npm run test:live-contract` passed.
- Routes, links, metadata, headers, accessibility coverage, history/focus behavior,
  and earlier F-1 findings were rechecked on the live product.

## Remaining work

1. **Blocking F-2-1 / reopened V9-1:** validate and recover from malformed
   `fss:active-session` snapshots. A live out-of-range prompt index currently throws
   and leaves no `main` landmark.
2. Add sandbox-backed claim coverage for the free core/JSON-backup promise and the
   no-teaching/no-correctness scope promise.
3. Add Open Graph and Twitter metadata to the designed 404.
4. Replace the three README jargon sentences recorded in the review.

## Re-run after repair

```sh
npm ci
npm test
npm run build
npm run test:live-contract
```

Also run every command listed in `.factory/claims.json`, the corrupt-active-snapshot
regression test, and the cold live `/`, `/demo`, and 404 checks.
