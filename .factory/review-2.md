# Adversarial first-read review 2 — Focus Study Sprint

**Reviewed:** 2026-09-02 UTC  
**Live URL:** <https://focus-study-sprint.sociobot.in>  
**Repository revision:** `4dfccccdabf3b40b059aeef828ebf0dd431461ba`  
**Verdict: FAIL.** One earlier defensive-storage defect remains live and removes the application after a reload. Public claims and copy/metadata findings also remain. The required verdict cannot be PASS while any finding remains.

## First 30 seconds

Fresh 390×844 and 1440×1000 browser contexts opened `/` before interaction. On the first mobile screen, the visitor can answer all three questions:

- **What it does:** “Practice recalling answers in a short session.”
- **For whom:** “For students and self-learners who want focused practice without streaks, feeds, or generated lessons.”
- **What to click first:** “Try it with sample data,” with “Opens a five-prompt practice session.” beside it.

The primary action is fully visible at 390 px (50.8 px high; its lower edge is at 518 px). The desktop first screen gives the same answer. This first-read check passes.

## Findings

### Blocking

#### F-2-1 — Reopened V9-1: malformed active-session data can blank the application

**Location / exact evidence:** The prior handoff and `.factory/verification-9.md` record this as **V9-1**. It is still present in `src/app.ts` in `restoreActive()`, which accepts any nonempty `prompts` array and assigns `snapshot.current` without checking its range or the nested prompt shape.

In a fresh live browser context, I seeded `fss:active-session` before loading `/` with one valid-looking prompt and `current: 1`. The live response was HTTP 200, but the page raised **“Cannot read properties of undefined (reading 'question')”**. It then had **0** `main` landmarks, **0** `h1` elements, and displayed only **“Skip to main content”**.

**Why this matters:** A stale or corrupted local browser record leaves the visitor without the product or recovery controls. This is an unfixed earlier finding, so the supplied review rule makes it blocking even though normal UI and import flows do not create the record.

**Concrete fix:** Validate the complete active snapshot before assigning it: validate every prompt and response, require an integer `current` in `0..prompts.length - 1`, validate duration/remaining/end time/flags, and remove or quarantine `fss:active-session` when invalid. Add a browser regression test that seeds the exact out-of-range snapshot, reloads, verifies a visible setup or recovery state, and asserts no page error.

### Medium

#### F-2-2 — The “free” hero claim has no matching claim entry and sandbox proof

**Location / exact quote:** Landing fact: **“Core study and JSON backup are free.”**

**Why this matters:** This is a visitor-facing price/entitlement claim. No `.factory/claims.json` entry names it or lists the hero fact in `where`. `json-backup` runs only in the demo, where `DEMO_MODE` sets `unlocked: true`; `contour-price` proves the paid unlock and latest-20 limit, not that a fresh non-paying real workspace can start, finish, export, and restore data. The claim is therefore unlisted under the stated claim rule.

**Concrete fix:** Add a `free-core` claim with `where` including the hero fact and a tagged test in a fresh non-demo, unlicensed browser context. The test must complete a five-prompt session and export/restore JSON without a license request. Alternatively, remove the hero sentence.

#### F-2-3 — The product-scope promise is unlisted

**Location / exact quote:** Landing scope section: **“The app does not teach content, check correctness, or promise learning results.”**

**Why this matters:** This is a useful promise a visitor can rely on, but it has no matching `claims.json` entry or test. It is especially material because the brief promises practice support rather than generated lessons or assessment.

**Concrete fix:** Add a scope claim and a deterministic test of the demo flow that verifies it only presents user/sample prompt pairs, has no answer-correctness outcome, and makes no content-generation request. Keep the sentence only once that observable contract is registered; otherwise remove it.

### Low

#### F-2-4 — The designed 404 lacks required Open Graph and Twitter metadata

**Location / exact evidence:** Live `/does-not-exist` returns the designed 404 with title, description, canonical, and favicon, but has no `meta[property="og:title"]`, `meta[property="og:image"]`, or `meta[name="twitter:card"]`. The omission is also present in `404.html`.

**Why this matters:** The route is designed and public, yet shared 404 links lack the product’s social identity. This fails the route metadata check.

**Concrete fix:** Add route-specific Open Graph title, description, URL, the existing 1200×630 social image, and matching Twitter-card metadata to `404.html`; add an automated 404 metadata assertion.

#### F-2-5 — README uses undefined release-process jargon

**Location / exact quote:** **“The release gate checks the live billing contract.”**

**Why this matters:** “Release gate” and “billing contract” do not tell a reader what will happen. The plain-words rule applies to README copy.

**Concrete fix:** Rewrite as **“Before release, run this check to confirm that the $12 Contour purchase is registered.”**

#### F-2-6 — README uses endpoint jargon instead of explaining the result

**Location / exact quote:** **“The production billing endpoint is intentionally public and contains no product secret.”**

**Why this matters:** “Endpoint” and “product secret” are implementation terms without a reader-facing result.

**Concrete fix:** Rewrite as **“The payment link is public and contains no private key.”**

#### F-2-7 — README deployment instruction uses unexplained hosting jargon

**Location / exact quote:** **“Deploy the contents of `dist/` as a static site with clean-directory URLs enabled.”**

**Why this matters:** “Static site” and “clean-directory URLs” are not explained; the latter is the important behavior, not a usable instruction for a distracted reader.

**Concrete fix:** Rewrite as **“Deploy the files in `dist/` to hosting that opens direct links such as `/demo` and `/privacy/`.”**

## Copy audit

Word counts treat hyphenated terms, paths, and numbers as one word; punctuation-only `::` is not a word. Headings and controls are audited separately. No landing or README sentence exceeds 22 words. F-2-5 through F-2-7 are the jargon flags; F-2-2 and F-2-3 are the landing claim flags.

### Landing-page sentences

| Words | Sentence |
| ---: | --- |
| 7 | Practice recalling answers in a short session. |
| 14 | For students and self-learners who want focused practice without streaks, feeds, or generated lessons. |
| 5 | Opens a five-prompt practice session. |
| 6 | Works offline after your first visit. |
| 6 | Study data stays in this browser. |
| 7 | Core study and JSON backup are free. |
| 11 | One prompt and answer per line, separated by `::` or a tab. |
| 3 | Use 5–30 pairs. |
| 3 | Nothing is uploaded. |
| 10 | Keyboard ready: press Tab to move, then Enter to begin. |
| 3 | Paste 5–30 pairs. |
| 9 | Put one prompt and answer on each line. |
| 3 | Recall each answer. |
| 8 | Reveal it, then choose Recalled or Keep practicing. |
| 3 | Review your recap. |
| 9 | Export a JSON backup whenever you want one. |
| 9 | Prompts, responses, ratings, and recaps remain in this browser. |
| 6 | The app sends no behavioral analytics. |
| 12 | The app does not teach content, check correctness, or promise learning results. |
| 11 | Contour adds saved prompt sets and your latest 20 session records. |
| 7 | Study sessions and JSON backup remain free. |
| 7 | Short answer-practice sessions for students and self-learners. |

### README sentences

| Words | Sentence |
| ---: | --- |
| 16 | A calm practice tool for students who want short sessions without streaks, feeds, or generated lessons. |
| 5 | Paste 5–30 `prompt :: answer` pairs. |
| 6 | Choose 5, 10, or 20 minutes. |
| 4 | Finish one study session. |
| 8 | Recaps and reusable sets stay in the browser. |
| 11 | Five to 30 prompt pairs, 5/10/20-minute sessions, pause, and time/completion endings. |
| 16 | Keyboard answer practice (`Enter` to reveal and `1` / `2` to self-rate) with a private recap. |
| 8 | Local session history plus JSON backup and restore. |
| 12 | An installable app shell that works offline after the first online visit. |
| 13 | System, light, and dark themes with reduced motion and a tested 390px layout. |
| 16 | Optional $12 one-time Contour license: reusable saved prompt sets and the latest 20 on-device session records. |
| 9 | Checkout and verification use only the Sociobot billing API. |
| 5 | Plain-language `/privacy/` and `/terms/` pages. |
| 9 | The **Try it with sample data** action opens `/demo`. |
| 6 | Demo data uses `demo:` storage only. |
| 14 | Resetting or leaving the demo clears that sample workspace without changing real study data. |
| 16 | The app supports practice organization; it does not teach content, verify correctness, or claim learning outcomes. |
| 5 | Requires Node.js 20+ and npm. |
| 5 | Open the printed local URL. |
| 11 | No environment variables or backend are required for the free experience. |
| 12 | The production billing endpoint is intentionally public and contains no product secret. |
| 6 | The exact production build command is: |
| 14 | It type-checks and writes the static deployment to `dist/`, with `dist/index.html` at the root. |
| 10 | Run all unit, mobile browser, accessibility, persistence, and offline tests: |
| 8 | Preview the built result with `npm run preview`. |
| 14 | The Playwright suite starts its own preview server when one is not already running. |
| 9 | Before a production release, run the complete release gate: |
| 8 | The release gate checks the live billing contract. |
| 10 | The catalog must list this $12 product and return URL. |
| 5 | Checkout must redirect to Sociobot/Dodo. |
| 9 | This check fails when factory billing registration is missing. |
| 5 | It never starts a payment. |
| 16 | Prompts, responses, recaps, saved sets, display preference, and any license token are local to the browser. |
| 6 | No analytics or advertising scripts ship. |
| 8 | License verification contacts only the Sociobot billing API. |
| 14 | Clearing site data can remove records; use Library → Export JSON for a portable backup. |
| 13 | Deploy the contents of `dist/` as a static site with clean-directory URLs enabled. |
| 10 | Do not configure infrastructure, DNS, or billing from this repository. |
| 11 | The Param Factory registers the product and checkout return URL separately. |
| 7 | The release gate must pass before deployment. |

The landing headings are descriptive: **Add your prompts**, **Complete a study session in three steps**, **Your study material stays local**, **This app does not check answers**, and **Keep reusable prompt sets for $12**. The landing buttons name their result: **Try it with sample data**, **Load sample into my draft**, **Start study session**, **Read the privacy policy**, and **Buy Contour once for $12**. No heading/button finding was observed.

## Demo, claims, privacy, and quality gates

One click on **Try it with sample data** opened `/demo` directly at prompt 1 of 5 with a 05:00 timer, a realistic biology prompt, answer field, and reveal action. The persistent banner read **“Demo — sample data, nothing is saved”** and supplied **Reset demo** and **Start for real**. The claim test demonstrated a real-data sentinel survives demo entry/reset/exit; demo keys use `demo:fss:*` and demo IndexedDB is `demo:focus-study-sprint`.

All eleven exact commands in `.factory/claims.json` passed from clean clone `/tmp/focus-study-sprint-review-2-clean.OjVPzm`:

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `input-limits` | PASS |
| `study-flow` | PASS |
| `offline-reload` | PASS |
| `local-privacy` | PASS |
| `json-backup` | PASS |
| `accessible-layout` | PASS |
| `display-preferences` | PASS |
| `contour-price` | PASS |
| `session-timing` | PASS |
| `installable-shell` | PASS |

`npm test` passed in the same clone (18 Vitest tests and 24 Playwright tests). `npm run build` passed and wrote `dist/`. `npm run test:live-contract` passed. The live demo request log contained only `https://focus-study-sprint.sociobot.in`; typed study content did not produce another-origin traffic. Offline reload is covered by the passing dedicated-context claim test.

## Structure, routes, and accessibility

- `/`, `/demo`, `/library`, `/about`, `/privacy/`, and `/terms/` returned 200. Each had a route-appropriate title, one `h1`, one `main`, description, canonical, favicon, Open Graph image, Twitter card, and no normal-load page/console error.
- `/does-not-exist` returned a styled HTTP 404 with a clear way back, one `h1`, and one `main`; F-2-4 records its missing social metadata. Its expected HTTP 404 document load produces Chromium’s failed-resource console message.
- The header/footer sets are consistent across the app, demo, legal pages, and 404. The sitemap lists all six public routes. Internal links returned 200; the optional purchase link returned 303 to the hosted Sociobot/Dodo checkout. `mailto:` links were explicit.
- Browser history, focus transfer to route `h1`, keyboard study controls, the skip link, mobile fit, reduced motion, service worker, and serious/critical axe checks are covered by the passing suite. The warm-paper topographic field-notebook artwork and typography follow `.factory/design.md` and do not resemble a generic SaaS template.

No AI feature is missing: the brief explicitly excludes generated content, and no decorative/provider-key AI integration was found.

## Earlier-review/history verification

I read `.factory/review-1.md`, `.factory/polish-1.md`, the previous handoff, and `.factory/verification-9.md`.

| Earlier item | Live/code verification |
| --- | --- |
| F-1-1 | Fixed: matching `Start / Library / Demo / Privacy` header and matching footer appear on app, demo, legal, and 404 routes. |
| F-1-2 | Fixed: live sitemap lists `/library` and `/about`. |
| F-1-3 | Fixed: the h1 says “Practice recalling answers in a short session.” and public `active-recall` copy is absent. |
| F-1-4 | Fixed: primary flow consistently uses “study session.” |
| F-1-5 | Fixed: the limits heading says “This app does not check answers.” |
| F-1-6 | Fixed: the untested artwork-provenance footer promise is absent. |
| F-1-7 | Fixed: README has no sentence over 22 words and no public `active-recall` wording. |
| V9-1 / handoff known gap | **Unfixed:** reopened as blocking F-2-1 with a live reproduction above. |

## What would make this perfect

Validate and recover from every malformed active-session snapshot; register and prove the two remaining public price/scope claims; complete the 404 social metadata; and replace the three README implementation-jargon sentences. Then rerun the cold mobile/desktop read, all eleven claim commands, full test/build/release checks, live demo storage/request checks, route crawl, and the corrupt-snapshot regression test. Only a review with no remaining findings should be marked PASS.
