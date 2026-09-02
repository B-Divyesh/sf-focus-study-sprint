# Focus Study Sprint

A calm practice tool for students who want short sessions without streaks, feeds, or generated lessons.
Paste 5–30 `prompt :: answer` pairs. Choose 5, 10, or 20 minutes. Finish one study session.
Recaps and reusable sets stay in the browser.

Live product: <https://focus-study-sprint.sociobot.in>

Try the isolated sample session: <https://focus-study-sprint.sociobot.in/demo>

## What v1 includes

- Five to 30 prompt pairs, 5/10/20-minute sessions, pause, and time/completion endings.
- Keyboard answer practice (`Enter` to reveal and `1` / `2` to self-rate) with a private recap.
- Local session history plus JSON backup and restore.
- An installable app shell that works offline after the first online visit.
- System, light, and dark themes with reduced motion and a tested 390px layout.
- Optional $12 one-time Contour license: reusable saved prompt sets and extended
  on-device history. Checkout and verification use only the Sociobot billing API.
- Plain-language `/privacy/` and `/terms/` pages.

The **Try it with sample data** action opens `/demo`. Demo data uses `demo:` storage
only. Resetting or leaving the demo clears that sample workspace without changing
real study data.

The app supports practice organization; it does not teach content, verify correctness,
or claim learning outcomes.

## Run locally

Requires Node.js 20+ and npm.

```sh
npm ci
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

The release gate checks the live billing contract. The catalog must list this $12 product and return URL.
Checkout must redirect to Sociobot/Dodo. This check fails when factory billing registration is missing.
It never starts a payment.

## Data and privacy

Prompts, responses, recaps, saved sets, display preference, and any license token are
local to the browser. No analytics or advertising scripts ship. License verification
contacts only the Sociobot billing API. Clearing site data can remove records; use
Library → Export JSON for a portable backup.

## Deployment

Deploy the contents of `dist/` as a static site with clean-directory URLs enabled.
Do not configure infrastructure, DNS, or billing from this repository. The Param Factory registers the product and checkout return URL separately.
The release gate must pass before deployment.

## Project notes

- Product research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and asset provenance: [`.factory/design.md`](.factory/design.md)
- Demo sandbox: [`.factory/demo.md`](.factory/demo.md)
- Tested product claims: [`.factory/claims.json`](.factory/claims.json)
- Verification and handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
