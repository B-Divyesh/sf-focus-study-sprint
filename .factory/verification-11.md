# Independent verification 11 — Focus Study Sprint

## Result

**PASS.** Candidate `a8403ff405beddd3aa8fdcd17068179d5f50b744` is deployed at
<https://focus-study-sprint.sociobot.in> and satisfies the supplied researched brief
and acceptance contract. Verification ran on 2026-09-02 from the candidate checkout.
No product code or infrastructure was changed.

## First-read and demo gate

I opened the live page cold in fresh desktop and 390×844 browser contexts before
reading the implementation. The first screen says what it does: **“Practice recalling
answers in a short session.”** It says who it is for: students and self-learners who
want focused practice without streaks, feeds, or generated lessons. The obvious first
action is **“Try it with sample data,”** beside **“Opens a five-prompt practice
session.”**

One click opened `/demo` at prompt 1 of 5. The persistent banner says **“Demo — sample
data, nothing is saved”** and provides Reset demo and Start for real. This passes the
mandatory plain-words and one-click demo gate.

## Claims gate

`.factory/claims.json` exists with 14 unique claims, 14 unique commands, and exactly
one `@claim:<id>` test tag per claim. After `npm ci`, I ran every listed command
separately before broader QA. All passed:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Demo used `demo:` storage; reset/exit preserved real data and deleted demo data. |
| `input-limits` | PASS | Four and 31 pairs were rejected; five passed; 5/10/20-minute choices existed. |
| `study-flow` | PASS | Enter and 1/2 completed five prompts; recap persisted after reload. |
| `offline-reload` | PASS | Fresh demo reloaded offline and revealed the cached answer. |
| `local-privacy` | PASS | Typed-answer flow made no cross-origin request. |
| `json-backup` | PASS | Complete local session/set export, clear, restore, and reuse succeeded. |
| `free-core` | PASS | An unlicensed real workspace completed, exported, cleared, and restored a session. |
| `scope-limits` | PASS | The app presented supplied content, self-ratings, and no grade/generation request. |
| `accessible-layout` | PASS | 390px and desktop layouts had no overflow and usable control targets. |
| `display-preferences` | PASS | Dark contrast scans were clean; reduced-motion durations were zero. |
| `contour-price` | PASS | The $12 fixture unlocked reusable sets and exactly the latest 20 of 21 records. |
| `billing-destination` | PASS | Checkout and the sole license request used the Sociobot billing API. |
| `session-timing` | PASS | Pause preserved time; expiry produced a time-ended recap. |
| `installable-shell` | PASS | The standalone manifest and an active app-owned service worker were present. |

The live landing page, app routes, legal pages, README, copy audit, and claim registry
were cross-checked. I found no unlisted public product promise.

## Clean checkout quality gates

```text
npm ci                     PASS — 174 packages; 0 vulnerabilities
npm test                   PASS — 25 Vitest tests; 28 Playwright tests
npm run lint               PASS — tsc --noEmit
npm run build              PASS — exact production build; dist/ produced
npm run test:live-contract PASS — live $12 catalog entry and checkout redirect
git diff --check           PASS
verify-url.sh              PASS — HTTP 200, 905 ms, title/lang/h1/main/alt, no errors
```

The first `verify-url.sh` call lacked its required output directory and stopped before
inspection; rerunning after creating that directory passed. Lighthouse likewise
needed `CHROME_PATH` set to the supplied Playwright Chromium; the configured run
passed.

## Independent live functional QA

- Completed the five-prompt demo using only Enter and 1/2, opened Library by keyboard,
  and confirmed the 5-checked/2-to-revisit recap survived reload.
- On live setup, a line without a separator showed the corrective instruction. Four
  pairs and 31 pairs disabled Start; five and 30 enabled it. Replacing invalid input
  with five valid pairs started prompt 1 of 5. All three duration choices were present.
- Exported a live demo record to JSON, rejected an invalid JSON import without losing
  the record, cleared data, and restored the valid export successfully.
- A real-data sentinel survived demo entry/reset/exit. Demo localStorage keys and the
  `demo:focus-study-sprint` database existed only in demo and were deleted on exit.
- Root, demo, library, about, privacy, and terms returned 200. An unknown route
  returned the designed 404 with its own title, h1, main landmark, and route back.
- The live billing contract lists the exact $12 USD product and checkout redirect.
  The product has no sign-in, so the Entra authority requirement does not apply.

## Accessibility and responsive QA

- Live axe scans found zero serious or critical findings on root, demo, library,
  about, privacy, terms, and 404; the dark landing scan was also clear.
- Desktop and 390×844 had zero horizontal overflow. The first demo action was visible
  in the initial mobile viewport. Visible controls were at least 44 px; duration label
  targets measured 64 px high. The local suite also passed 200% text resize.
- The first Tab focused the skip link with a designed 3 px outline, Enter moved focus
  to main, and reduced-motion contexts had a maximum computed motion duration of 0.
- The restore-license dialog focused Close when opened by keyboard, closed with Escape,
  and returned focus to its trigger. No keyboard trap was found.
- Each audited route had one h1 and one main. `verify-url.sh` also found no missing alt
  text or unlabeled buttons.

The intentional 404 navigation causes Chromium's expected “Failed to load resource:
404” console message. Normal routes and full study/offline/update flows produced no
console or page errors.

## Privacy, headers, caching, and rate limiting

- The complete live demo flow issued only same-origin GETs for the document and hashed
  app assets. No analytics, CDN font/script, prompt, typed answer, or study result left
  the product origin. Lighthouse also reported zero third-party requests and no fonts.
- Live response headers include a self-first CSP with header-only
  `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer policy, and a restrictive
  permissions policy. HTML revalidates after 30 seconds; hashed assets are immutable
  for one year; `sw.js` is `no-cache`; the manifest uses
  `application/manifest+json` and one-hour revalidation.
- The product-scoped public license verifier allowed 30 requests from one client.
  Request 31 returned **429** with `Retry-After: 4` and `X-RateLimit-After: 4`.

## PWA and performance

- The live manifest is standalone with 192/512 icons and start URL `/?v=10`. The live
  `/sw.js` controlled `/demo` and populated `fss-v10-shell`.
- In a dedicated fresh context, `/demo` reloaded offline, showed its offline status,
  and revealed “Photosynthesis.”
- A disposable two-version server served the unmodified build, then a v11 worker
  response. The app displayed **“An app update is ready.”** Selecting **Update app**
  activated `fss-v11-shell`/`fss-v11-runtime`, reloaded exactly once, retained one h1
  and one main, and raised no errors.
- Live mobile Lighthouse: Performance **92**, Accessibility **100**, Best Practices
  **100**, SEO **100**; FCP 1.0 s, LCP 1.3 s, CLS 0, and 70,142 B total transfer.
  A four-times CPU-throttled interaction trace measured a worst interaction duration
  of 128 ms.
- Initial application JavaScript is 36,614 B raw (two modules; about 12.3 kB gzip),
  CSS is 24,655 B raw / 5.86 kB gzip, and the mobile hero is 47,956 B. These satisfy
  the 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB hero budgets.

## Deployment identity

SHA-256 comparisons covered all 23 deployable files in `dist/` except the
deployment-only `staticwebapp.config.json`. There were **zero mismatches** between the
candidate build and live custom-domain responses. Production therefore serves the
tested candidate payload.

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None. |
| High | None. |
| Medium | None. |
| Low | None. |

## Final disposition

**PASS.** The deployed candidate fulfills the calm, finite, private, offline
answer-practice job in the brief and meets the factory release contract.
