# Review 3 handoff — Focus Study Sprint

## Result

**FAIL.** Review 3 found one blocking demo-exit defect, two unregistered claims,
and four plain-language issues. No product code or infrastructure was changed.
The full report is in `.factory/review-3.md`.

## What was done

- Opened live production cold at 390×844 and 1440×1000 before scrolling.
- Exercised the one-click demo, Reset demo, Start for real, storage isolation,
  request logging, and the alternate Demo → Privacy → Start exit.
- Ran all 13 commands in `.factory/claims.json` individually from a fresh clone.
- Re-ran the full unit/browser suite, type check, production build, and live billing
  contract check.
- Crawled public routes and links; checked metadata, 404, history/back focus,
  headers, mobile fit, and live axe results.
- Read and verified every finding from review 1, review 2, polish 1, polish 2, and
  the prior handoff.
- Audited every landing and README sentence, heading, and action.

## Verification results

```text
13/13 listed claim commands                 PASS
npm test                                   PASS — 25 unit, 27 browser
npm run lint                               PASS
npm run build                              PASS — dist/ produced
npm run test:live-contract                 PASS
live axe, six public routes                PASS — zero violations
live demo same-origin request check        PASS
demo exit through Privacy, then Start      FAIL — demo data persists
```

Fresh clone: `/tmp/focus-study-sprint-review-3-clean.RdF5JG`.

## Required next work

1. Clear both demo storage namespaces on every demo-origin exit, including legal
   links, and add the regression described in F-3-1.
2. Register and test, or remove, the billing-destination and no-private-key claims.
3. Apply the four concrete copy rewrites in F-3-4 through F-3-7.
4. Re-run the complete review from scratch; do not accept a diff-only check.

## Scope

Only `.factory/review-3.md` and `.factory/handoff.md` were changed. No deployment,
resource, DNS, billing, secret, or product-code operation was performed.
