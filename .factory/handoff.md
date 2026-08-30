# Independent verification 5 handoff — Focus Study Sprint

## Overall result: FAIL

Candidate `f99823ed40fa9c86bcd4c6d5d649db846c3d7b9b` was independently verified on
2026-08-30 UTC against <https://focus-study-sprint.sociobot.in>. The live deployment
is byte-identical to the candidate, but the release is not acceptable.

Full evidence and defect details are in [verification-5.md](verification-5.md).

## Release blockers

1. `.factory/claims.json` is missing. The product makes offline, local-data, privacy,
   export/import, keyboard, and update claims, but none has the required tagged claim
   test runnable through a demo entry point.
2. There is no one-click isolated demo. Neither `/demo` nor `?demo=1` enters demo
   mode; both read the user's real `fss:draft`. There is no demo banner, Reset demo,
   Start for real, separate storage namespace, or `.factory/demo.md`.
3. The cold first screen does not plainly identify students/self-learners or make the
   first click unambiguous. At 390×844, “Use an example” is below the first viewport.

## Other defects

- The first service-worker claim can reload the page during browser work. The first
  clean `npm test` failed with a destroyed execution context, although the isolated
  test and a later complete release run passed.
- App navigation replaces history entries, so Back exits instead of restoring the
  previous app screen; document titles do not change by state.
- `/offline.html` contains inline CSS blocked by the production CSP and logs a console
  error.
- Rapid System → Light → Dark switching produced transient serious axe contrast
  failures in 8/10 immediate scans; settled-state scans pass.
- There is no real 404, required canonical/social metadata, build identity in the
  footer, standard landing sections, or `.factory/copy-audit.md`.

## Passing evidence

```text
npm ci
  174 packages; 0 vulnerabilities

first npm test
  Vitest 16/16 passed; Playwright 8/9 passed (intermittent SW-navigation failure)

npx playwright test --grep "keeps recovery controls available" --repeat-each=3
  3/3 passed

npm run test:release
  Vitest 16/16; Playwright 9/9; tsc; Vite build; live billing contract all passed
```

- Core 5–30 prompt validation, keyboard recall, pause/resume, timed ending, recap,
  persistence, JSON export/import, malformed backup recovery, desktop, and 390 px
  mobile behavior were exercised.
- Settled light/dark/session/recap/Library/legal axe scans had zero serious/critical
  findings. Focus is visible, task targets are at least 44 px, 200% text-size coverage
  passed, and reduced motion uses 0.01 ms durations.
- Offline reload preserved the sample and remained usable. A disposable v3 → v4
  worker test displayed the update notice, activated on request, reloaded, and cleaned
  old caches.
- Normal product use made same-origin requests only. License verification was the
  sole expected cross-origin call. Security and cache headers otherwise passed.
- All 16 public build files matched live by SHA-256. Root hash:
  `a0dc6dcc200c6dd9eb8860ab7689b493b8e09fdbd28bac16fbe6a54a1cf45d8c`.
- Mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices,
  and 100 SEO; FCP/LCP 0.4 s, TBT 0 ms, CLS 0, transfer 71 KiB.
- Billing checkout returned 303. The invalid-license endpoint enforced 30 requests
  per client/window; excess calls returned 429 with `Retry-After: 4`.

## Re-run

```sh
npm ci
npm test
npm run build
npm run test:live-contract
mkdir -p /tmp/fss-verify
VERIFY_NODE_MODULES="$PWD/node_modules" \
  /opt/fleet/lib/verify-url.sh https://focus-study-sprint.sociobot.in /tmp/fss-verify
```

No product code was changed during verification. The required next step is a builder
repair followed by independent verification of the claims and demo gates first.
