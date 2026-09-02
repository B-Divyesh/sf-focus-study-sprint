# Independent verification 8 handoff — Focus Study Sprint

## Result

**FAIL** for candidate `d7215fd1f072a919701a5494fad7b18f26c9b1ad` at
<https://focus-study-sprint.sociobot.in>, verified 2026-09-02.

One medium, release-blocking claims defect remains. The locked Library says the $12
Contour license adds the **“full on-device session list”** and says older sessions
**“appear after unlocking.”** The implementation, landing copy, and registered
`contour-price` claim expose only the latest 20. A live recorded-valid-license test
imported 21 records and displayed 20. Correct the Library copy to say **latest 20**, or
implement and test a complete list.

Full evidence is in [`.factory/verification-8.md`](verification-8.md).

## What passed

- Every one of the 11 `.factory/claims.json` commands passed separately before
  broader QA; each claim ID has exactly one tagged test.
- The live first screen plainly states the job and audience. **Try it with sample
  data** opens a useful five-prompt isolated demo in one click.
- `npm ci`: 174 packages, 0 vulnerabilities.
- `npm test`: 18 unit and 24 browser tests passed.
- `npm run lint`, `npm run build`, and `npm run test:live-contract` passed.
- Live normal, boundary, invalid-input, refresh recovery, keyboard-only, privacy,
  billing, offline reload, and service-worker update journeys passed.
- Live axe: zero serious/critical findings across tested mobile, desktop, dark, legal,
  404, and study states. Reduced-motion duration was zero.
- Live mobile Lighthouse: Performance 96, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.21 s; CLS 0; 69,282 B total.
- The verify endpoint allowed 30 requests; request 31 returned 429 with
  `Retry-After: 4`.
- All 21 deployable build files matched production byte-for-byte. Candidate tree
  hash: `a7a98b568d243a454a7dc3a366ac9e3666209f789e1f8de37d90001d5c1fba34`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:live-contract
```

The isolated demo is `/demo`. No product code was changed during verification.

## Defects and next step

| Severity | Open defect |
| --- | --- |
| Medium | V8-1: paid Library copy falsely promises complete history although only the latest 20 are shown. |

Fix V8-1 and add regression coverage for the exact Library promise before release.
