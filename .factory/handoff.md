# Review 4 handoff — Focus Study Sprint

## Result

**FAIL.** Adversarial review 4 was completed against live production and repository
revision `e2c397097f9f5396ae987b418c51a92a1aa999dd`. No product code, deployment,
DNS, billing, secrets, or infrastructure was changed.

The full report is `.factory/review-4.md`. It records eight findings: four medium
claim/privacy coverage issues and four low copy issues. No blocking failure was
reproduced.

## Verification performed

- Opened the live site cold in fresh 390×844 and 1440×900 browser contexts.
- Exercised the one-click demo, realistic sample, reset, Start for real, legal-page
  exit, isolated localStorage/IndexedDB namespaces, real-data sentinel, and offline
  reload.
- Ran all 14 commands from `.factory/claims.json` separately in clean clone
  `/tmp/focus-study-sprint-review-4-clean.HoqK2w`; every command exited successfully.
- Ran `npm test` (25 unit and 28 Playwright tests), `npm run lint`, `npm run build`,
  `npm run test:live-contract`, and `git diff --check` in that clone; all passed.
- Crawled live routes and assets, verified history/focus, headers, metadata, 404,
  and consistent navigation/footer. Live Axe scans reported zero violations.
- `/opt/fleet/lib/verify-url.sh` passed. Mobile Lighthouse scored 100 in all four
  categories, with 1.2 s LCP, zero CLS, and zero total blocking time.
- Rechecked every finding from reviews 1–3 against live production and current code.
  All earlier findings remain fixed.

## Required next steps

Resolve F-4-1 through F-4-8 in `.factory/review-4.md`, then repeat the complete
claim, copy, demo, route, accessibility, and build review. The most important work
is aligning the input-limit and light/dark contrast tests with their full published
claims, and clarifying how license tokens leave the browser for verification.
