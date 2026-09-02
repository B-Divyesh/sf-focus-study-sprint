# Focus Study Sprint

A calm practice tool for students who want short sessions without streaks, feeds, or generated lessons.
Paste 5–30 `prompt :: answer` pairs. Choose 5, 10, or 20 minutes. Finish one study session.
Recaps and reusable sets stay in the browser.

Live product: <https://focus-study-sprint.sociobot.in>

Try the isolated sample session: <https://focus-study-sprint.sociobot.in/demo>

## What v1 includes

- Five to 30 prompt pairs and 5/10/20-minute sessions.
- Sessions can pause. They end when time runs out or after the last prompt.
- Keyboard answer practice (`Enter` to reveal and `1` / `2` to self-rate) with a private recap.
- Local session history plus JSON backup and restore.
- Install the app and use it offline after your first online visit.
- System, light, and dark themes with reduced motion and a tested 390px layout.
- Optional $12 one-time Contour license: reusable saved prompt sets and the latest
  20 on-device session records. Checkout and license checks use the Sociobot billing API.
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
free experience.

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

Before release, run this check to confirm that the $12 Contour purchase is registered:

```sh
npm run test:release
```

The catalog must list this $12 product and its return URL. Checkout must redirect to Sociobot/Dodo.
This check fails when purchase setup is missing. It never starts a payment.

## Data and privacy

Prompts, responses, recaps, saved sets, display preference, and any license token are
local to the browser. No analytics or advertising scripts ship. License checks contact
only the Sociobot billing API. Clearing site data can remove records; use
Library → Export JSON for a portable backup.

## Deployment

Deploy the files in `dist/` to hosting that opens direct links such as `/demo` and `/privacy/`.
Do not configure infrastructure, DNS, or billing from this repository. The Param Factory registers the product and checkout return URL separately.
The purchase check must pass before deployment.

## Project notes

- Product research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and asset provenance: [`.factory/design.md`](.factory/design.md)
- Demo sandbox: [`.factory/demo.md`](.factory/demo.md)
- Tested product claims: [`.factory/claims.json`](.factory/claims.json)
- Verification and handoff: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
