# Focus Study Sprint review 7 — practice recalling answers in short sessions

## Verdict

**PASS.** This review found zero findings at every severity and zero untested
public claims.

- Candidate implementation: `30a7f5548b2d7f6a1879191efcc20be96eea7876`
- Documentation baseline: `50b2a22869606357f7b65f4d772e068ac971bb03`
- Live URL: <https://focus-study-sprint.sociobot.in>
- Reviewed: 2026-09-05 UTC
- Clean candidate checkout: `/tmp/focus-study-sprint-review7-clean`

The commits after the candidate modify only `.factory/handoff.md` and verification
reports. A fresh build matched all 23 fetchable live files byte for byte. The
deployment-only `staticwebapp.config.json` is not publicly served.

## First screen before scrolling

Fresh 390×844 phone and 1440×1000 desktop browser contexts opened the live root at
scroll position zero. Both clearly showed:

- Job: **Practice recalling answers in a short session.**
- Audience: students and self-learners who want focused practice without streaks,
  feeds, or generated lessons.
- First action: **Try it with sample data**.
- Next result: **Opens a five-prompt practice session.**
- Facts: offline after the first visit, study data stays in the browser, and study
  sessions plus JSON backup are free.

The action was fully visible in both viewports. Neither viewport had horizontal
overflow, console errors, nor page errors. The seven-word h1 names the job directly;
the supporting sentence and action use plain, consistent terms.

## One-click sample and real-data isolation

The first action opened `/demo` directly in a five-minute session. The populated
sample showed **Prompt 1 of 5**, the realistic question “What process do plants use
to convert light into energy?”, and the expected answer “Photosynthesis” after
reveal. Rating it advanced to prompt 2.

The label **Demo — sample data, nothing is saved** remained visible after answer
entry, reveal, rating, and reset. **Reset demo** returned to prompt 1 of 5. In each
fresh phone and desktop context, a real `fss:draft` sentinel remained unchanged and
all `demo:fss:*` keys were gone after **Start for real**. The dedicated claim also
proved that the demo IndexedDB database is removed on exit and that a later demo
starts fresh.

## Declared claims

Every exact command in `.factory/claims.json` was run separately from the clean
candidate checkout. All 19 passed. The full local and live suites also ran each tag.

| Claim | Result | Observable proof |
| --- | --- | --- |
| `demo-isolation` | PASS | Separate demo namespaces; reset and legal/direct exits clear sample data while preserving a real-data sentinel. |
| `input-limits` | PASS | Four and 31 pairs fail; five and 30 pass; only 5/10/20 minutes are offered. |
| `study-flow` | PASS | Enter and 1/2 complete all five prompts; recap remains after Library reload. |
| `offline-reload` | PASS | A dedicated context reloads the sample offline and can reveal the answer. |
| `local-privacy` | PASS | Typed response, reveal, and rating send no request to another origin. |
| `no-advertising-scripts` | PASS | Request/resource logs and built assets contain no trackers, remote fonts, or third-party runtime scripts. |
| `json-backup` | PASS | Session and saved prompt set export, clear, restore, and load again. |
| `free-core` | PASS | An unlicensed real workspace completes, exports, clears, and restores without a license request. |
| `scope-limits` | PASS | Supplied prompts and self-rating only; no teaching, grading, generation, streaks, feeds, rewards, or nudges. |
| `accessible-layout` | PASS | First action and controls fit at 390 px and 1440 px with 44 px targets. |
| `display-preferences` | PASS | Explicit light/dark Axe scans pass; reduced motion removes computed movement. |
| `contour-price` | PASS | $12 once enables reusable sets and exactly the latest 20 of 21 records. |
| `billing-destination` | PASS | Checkout uses the product-scoped Sociobot URL; verification sends only the license query value. |
| `session-timing` | PASS | Pause holds time; resume and expiry produce the timed recap. |
| `installable-shell` | PASS | Standalone manifest, required icons, and controlling service worker are active. |
| `free-history-limit` | PASS | The unlicensed Library displays exactly the latest 3 of 21 records. |
| `history-overflow-export` | PASS | JSON still contains all 21 records while the free view shows 3. |
| `free-accessibility` | PASS | Keyboard study flow, accessibility scan, and export remain free. |
| `invalid-license-lock` | PASS | Invalid, expired, revoked, and wrong-product fixtures each remove paid access. |

The landing page, demo, Library, About, Privacy, Terms, conditional license states,
README, manifest, and offline page were reviewed against the registry. No public
promise was missing, incomplete, false, or untested. Removed claims remain absent.

## Functional and recovery coverage

`npm run test:release` passed from the clean checkout:

- 26/26 Vitest unit and deployment checks
- 33/33 local production-build browser checks
- TypeScript and Vite production build with `dist/index.html`
- Live $12 catalog registration and hosted-checkout redirect contract

The same 33/33 browser checks passed against the live HTTPS product. Together with
the fresh manual contexts, they cover the normal five-prompt journey, 4/5/30/31 input
boundaries, malformed prompt text, malformed and deeply nested backups, poisoned
older storage, malformed and in-progress session recovery, pause/time expiry,
complete/empty/limited history, export/import, valid and four invalid license states,
browser Back, route focus, keyboard-only completion, dialog focus, 200% text, light
and dark themes, reduced motion, first service-worker control, offline reload, and
the update path.

A disposable local production build changed service-worker cache version 13 to 14.
The app displayed **An app update is ready**, the update action reloaded exactly
once, cache 14 replaced cache 13, and no console error occurred.

## Accessibility, privacy, routes, and performance

`/opt/fleet/lib/verify-url.sh` passed the live root: HTTP 200, useful title,
`lang="en"`, one h1, one main, complete image alternatives, labelled buttons, and no
console errors. Live Playwright Axe checks reported no serious or critical issues on
app states, legal pages, offline, and 404. The tests also prove the first-focus skip
link, route-heading focus, trapped-dialog avoidance, Escape close, 44 px targets,
200% text layout, and zero motion under reduced-motion preference.

The study flow's request log is same-origin only. The broader root → demo → Privacy
log has no third-party request. Built HTML, CSS, JavaScript, and service-worker files
have no tracker, advertising, remote-font, or remote-script integration. The only
allowed cross-origin runtime path is an explicit license check to the Sociobot
billing API; its test proves a token-only query.

All public routes returned the intended content and route title. `/does-not-exist`
returned deliberate HTTP 404 with a styled page, one h1, one main, complete social
metadata, standard navigation/footer, and ways back to Start or Demo. This expected
404 is not a defect. The sitemap includes all six public app routes, and internal
links exercised by the suite resolve. Privacy and Terms are direct-loadable pages.

Live response headers include restrictive CSP with header-only
`frame-ancestors 'none'`, HSTS, `nosniff`, referrer policy, and permissions policy.
Hashed assets use one-year immutable caching; the manifest has
`application/manifest+json`. Fresh mobile Lighthouse results were:

| Measure | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1.21 s |
| Total blocking time | 0 ms |
| CLS | 0 |

The application JavaScript is 35.34 kB raw / 11.56 kB gzip. CSS is 24.82 kB raw /
5.88 kB gzip. No fonts ship. These are within the PWA budgets.

## Earlier finding disposition

All earlier review, verification, and polish reports were inspected, including low
and previously non-blocking items. Current regressions establish these dispositions:

| Earlier finding | Current proof | Disposition |
| --- | --- | --- |
| Initial checkout registration | The required live contract finds the $12 catalog entry and a hosted redirect. | Closed |
| Initial 44 px targets | Phone/desktop target measurements and the session Pause control pass. | Closed |
| Initial immutable caching | Live fingerprinted JavaScript returns `max-age=31536000, immutable`. | Closed |
| Initial CSP, permissions, framing, and manifest MIME | Live headers and manifest response satisfy each item without console errors. | Closed |
| V4 malformed nested import | Local and live regression rejects it without replacing saved data or blanking the app. | Closed |
| V5 missing claim registry | Nineteen registered commands pass separately; tag uniqueness is unit-tested. | Closed |
| V5 missing isolated demo and unclear first screen | Both fresh viewports pass the one-click sentinel flow and cold-read check. | Closed |
| V5 first service-worker reload race | First control keeps one load; update simulation reloads once only after user action. | Closed |
| V5 history/title/Back behavior | Live route-title, focus, `pushState`, Back, and persisted-history checks pass. | Closed |
| V5 offline CSP | External offline CSS renders under production CSP with no console error. | Closed |
| V5 transient theme contrast | Explicit light and dark Axe scans pass after each selection. | Closed |
| V5 metadata, sections, footer, and 404 | Live metadata, standard sections, shared shell, sitemap, and designed 404 pass. | Closed |
| V6 incomplete paid/backup/timing/install proofs | Dedicated outcome tests pass locally, separately, and live. | Closed |
| V8-1 paid history called complete | Copy says latest 20; a 21-record fixture displays exactly 20. | Closed |
| V9-1 malformed active session | The exact poisoned state is removed and setup recovery remains usable. | Closed |
| F-1-1 navigation/footer | The shared navigation and footer pass on app, demo, legal, offline, and 404 pages. | Closed |
| F-1-2 sitemap omissions | All six public product routes are listed and live. | Closed |
| F-1-3 headline jargon | The current seven-word h1 directly names the job. | Closed |
| F-1-4 competing sprint/session terms | Public task copy consistently uses **study session**. | Closed |
| F-1-5 vague limits heading | The live heading is **This app does not check answers**. | Closed |
| F-1-6 untested artwork promise | The visitor claim remains absent; provenance stays in the design record. | Closed |
| F-1-7 long README sentences | Current copy audit and source review retain the 22-word cap. | Closed |
| F-2-1 malformed active-state crash | Current local and live recovery regression passes without an error. | Closed |
| F-2-2 unlisted free claim | `free-core` and `free-accessibility` pass without a license request. | Closed |
| F-2-3 unlisted scope claim | `scope-limits` proves every stated exclusion. | Closed |
| F-2-4 missing 404 social metadata | The real HTTP 404 has complete Open Graph and Twitter metadata. | Closed |
| F-2-5–F-2-7 README jargon | Purchase, billing, and direct-link wording remains concrete. | Closed |
| F-3-1 legal-page demo exit | Demo keys/database clear and real data remains unchanged through Privacy exit. | Closed |
| F-3-2 billing destination | The registered token-only billing claim passes. | Closed |
| F-3-3 no-private-key promise | The untestable sentence remains absent. | Closed |
| F-3-4–F-3-7 vague terms | Copy uses study session, usage reports, direct timing, and install wording. | Closed |
| F-4-1 incomplete boundaries | The claim proves 4/5/30/31 and every offered duration. | Closed |
| F-4-2 incomplete theme checks | Both explicit themes receive live Axe scans. | Closed |
| F-4-3 unclear token privacy | README and Privacy separate local records from token-only verification. | Closed |
| F-4-4 missing retention-mechanics scope | The test covers streaks, feeds, rewards, and return nudges across app states. | Closed |
| F-4-5 unproved payment side effect | The sentence remains absent. | Closed |
| F-4-6 subjective adjective | The removed marketing adjective remains absent from public copy. | Closed |
| F-4-7 unnamed saved-set action | The accessible action names the prompt set and result. | Closed |
| F-4-8 incomplete empty state | It explains how to create a recap and links to Start. | Closed |
| F-5-1 unlisted tracker/script promise | Its registered request/resource and built-artifact test passes locally and live. | Closed |
| F-6-1 offline navigation | Offline now has the standard header, four-link navigation, and footer. | Closed |
| F-6-2 offline metadata | Offline has its own title, canonical, icons, Open Graph, and Twitter data. | Closed |
| F-6-3 incomplete history-limit proof | Separate 3-of-21 display and 21-record export claims pass. | Closed |
| F-6-4 free accessibility and invalid-license promises | Keyboard/Axe/export and all four inactive-license reasons pass. | Closed |

The brief explicitly excludes generated lessons. The existing local JSON import and
export path covers portability, so this review found no missed AI, sync, or import
leverage that belongs in the stated product.

## Applicability and evidence

This is a static local-first PWA. It has no product backend, tenant store, shared
database, health endpoint, restart-persistent server state, or product-server rate
limit. Backend isolation, restart, health, and 429/Retry-After checks therefore do
not apply. No real purchase was made.

Runtime evidence is in `/work/.evidence/`:

- `review7-release.log`, `review7-claims.log`, `review7-live-e2e.log`
- `review7-live-manual.json`, phone and desktop first-screen screenshots
- `review7-live-hashes.tsv`, `review7-http.log`, `review7-routes.tsv`
- `review7-verify-url/verify.json`, `review7-lighthouse.json`
- `review7-sw-update.json`

## Findings

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Untested claims | 0 |

**Final verdict: PASS.**
