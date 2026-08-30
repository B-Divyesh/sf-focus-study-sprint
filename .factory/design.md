# Focus Study Sprint — visual thesis

## Direction: a quiet topographic field notebook

The session is a finite route across a small terrain, not a treadmill. Sparse contour
lines make progress spatial and legible: the learner sees one prompt, one answer, and
the remaining route. The interface borrows the restraint of a field notebook—warm
paper, ink, coordinate labels, and a single survey-orange marker—without imitating a
map app or turning completion into a reward loop.

## Palette

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| paper / background | `#F4F0E6` | `#17201D` | quiet page field |
| raised surface | `#FFFDF7` | `#202C28` | active working plane |
| ink / text | `#1B2924` | `#F2F0E8` | primary type |
| muted ink | `#52625B` | `#B8C2BC` | secondary type (AA) |
| contour | `#C8C4B7` | `#3F514A` | explanatory linework |
| route / accent | `#B94727` | `#FF8D68` | actions and current position |
| accent contrast | `#FFFFFF` | `#17201D` | action labels |
| success | `#2D6A4F` | `#7DD6A8` | recalled, with text/icon |
| warning | `#8A5A13` | `#F5C66B` | paused/offline, with text/icon |
| danger | `#A0382E` | `#FF938A` | destructive/error, with text/icon |

The light treatment is the primary daylight notebook. Dark mode is a deliberate night
survey treatment selected from system preference and optionally overridden in-app.
Every semantic state also uses wording or a symbol; color is never the sole signal.

## Typography

The product uses no downloaded font files: `Georgia` for human, editorial headings and
the system sans stack for controls/body. This avoids a network dependency and keeps the
app below its font budget. Type scale: 14, 16, 18, 24, 34, and fluid 48–64px. Body text
is at least 16px with 1.55 leading; timers and route coordinates use tabular figures.
Measures stay between 45–70 characters.

## Space, shape, and hierarchy

An 8px base rhythm (4px only for tight optical correction). Content maxes at 1120px;
the study plane maxes at 760px. Corners are clipped/soft (`2–16px`) like paper rather
than pill-heavy. Lines and proximity establish groups before boxes. All targets are at
least 44×44px with 8px separation. At 390px, the decorative map crop and secondary
copy recede; setup becomes one column and the session controls stay reachable above
the safe area.

## Interaction grammar

- The primary path is linear: chart prompts → choose a duration → begin → reveal →
  mark `Recalled` or `Keep practicing` → recap.
- `Enter` reveals; `1` marks keep practicing; `2` marks recalled. Buttons retain full
  text labels and shortcuts are shown only in the session.
- A thin route line and `Prompt n of N` convey finite progress. There are no points,
  streaks, celebrations, confetti, daily goals, or return nudges.
- Destructive actions name their scope and require confirmation. Import is validated
  before replacing data. Status and errors are announced in a polite live region.

## Motion policy

Only state continuity moves: active cards enter 8px from the route direction and fade
over 180ms; the route indicator progresses over 240ms; notices fade over 180ms.
Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling
are removed and changes are immediate opacity/state swaps. Timer numerals never pulse.

## Asset plan and provenance

The hero uses one original generated raster illustration, paired with authored SVG PWA
icons. The illustration clarifies the product metaphor: a small finite contour route
ending at a quiet survey marker beside a blank study card. It contains no people, text,
logos, or claims.

**Prompt sheet**

- Use case: stylized-concept; asset: responsive landing hero.
- Subject/world: an abstract topographic terrain folded from tactile warm paper; one
  short burnt-orange route with five subtle waypoints ending at a brass survey pin;
  one blank cream index card resting into the landscape.
- Materials/light/lens: embossed paper fibers, fine ink contour lines, dry pigment,
  soft raking morning light, near-isometric editorial crop, generous negative space.
- Palette words: warm limestone, forest ink, oxidized orange, muted sage, brass.
- Negative list: no text, letters, numerals, logos, watermark, people, hands, devices,
  photoreal mountains, gamification symbols, trophies, badges, coins, neon gradients.

Generated with the factory Azure image deployment via `/opt/fleet/lib/gen-image.sh`,
2026-08-27. The selected result and its prompt sidecar are stored under `assets/src/`;
the optimized WebP ships in `public/assets/`. Generated specifically for this product;
no third-party stock assets are used. Icons are original SVG linework authored in-repo.
The 1200×630 `public/assets/social-card.jpg` is a center crop of that same original
source image; it introduces no third-party or newly generated material.
