# Focus Study Sprint

A calm, installable active-recall utility for students and self-learners who want a
short practice session without streaks, rewards, feeds, reminders, or generated
content. Paste 5–30 `prompt :: answer` pairs, choose 5/10/20 minutes, and work through
one finite route. Recaps and reusable sets stay in the browser.

Live product: <https://focus-study-sprint.sociobot.in>

## What v1 includes

- Keyboard-first recall loop (`Enter` to reveal, `1` / `2` to self-rate), pause, and
  time/completion endings.
- Private recaps and recent session history in IndexedDB.
- JSON export/import, available to everyone.
- Installable PWA with cached app shell, offline sessions, and an update notice.
- System/light/dark themes, reduced-motion support, responsive 390px layout, and
  screen-reader announcements.
- Optional $12 one-time Contour license: reusable saved prompt sets and extended
  on-device history. Checkout and verification use only the Sociobot billing API.
- Plain-language `/privacy/` and `/terms/` pages.

The app supports practice organization; it does not teach content, verify correctness,
or claim learning outcomes.

## Run locally

Requires Node.js 20+ and npm.

```sh
npm install
npm run dev
```

Open the printed local URL. No environment variables or backend are required for the
free experience. The production billing endpoint is intentionally public and contains
no product secret.

## Test and build

The exact production build command is:

```sh
npm run build
```

It type-checks and writes the static deployment to `dist/`, with `dist/index.html` at
the root. Run all unit, mobile browser, accessibility, persistence, and offline tests:

```sh
npx playwright install chromium   # first machine only
npm test
```

Preview the built result with `npm run preview`. The Playwright suite starts its own
preview server when one is not already running.

Before a production release, run the complete release gate:

```sh
npm run test:release
```

It includes the live Sociobot billing contract: the production catalog must contain
this exact $12 product, its return URL, and a checkout that redirects to the hosted
Sociobot/Dodo flow. This check intentionally fails when factory billing registration
is missing; it never starts a payment.

## Data and privacy

Prompts, responses, recaps, saved sets, display preference, and any license token are
local to the browser. No analytics or advertising scripts ship. Clearing site data can
remove records; use Library → Export JSON for a portable backup.

## Deployment

Deploy the contents of `dist/` as a static site with clean-directory URLs enabled.
Do not configure infrastructure, DNS, or billing from this repository. The Param
Factory registers the Sociobot product and checkout return URL separately, and the
release gate above must pass before deployment is considered releasable.

## Project notes

- Product research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and asset provenance: [`.factory/design.md`](.factory/design.md)
- Verification and handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
