# Product copy audit

Audited from the rendered `/` page and current README on 2026-09-02. Hyphenated
terms and numbers count as one word. Interface labels are listed separately from
complete sentences.

## Complete sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Practice recalling answers in a short session. | 7 | Pass |
| For students and self-learners who want focused practice without streaks, feeds, or generated lessons. | 14 | Pass |
| Opens a five-prompt practice session. | 5 | Pass |
| Works offline after your first visit. | 6 | Pass |
| Study data stays in this browser. | 6 | Pass |
| Study sessions and JSON backup are free. | 7 | Pass |
| One prompt and answer per line, separated by `::` or a tab. | 11 | Pass |
| Use 5–30 pairs. | 3 | Pass |
| Nothing is uploaded. | 3 | Pass |
| Keyboard ready: press Tab to move, then Enter to begin. | 10 | Pass |
| Paste 5–30 pairs. | 3 | Pass |
| Put one prompt and answer on each line. | 9 | Pass |
| Recall each answer. | 3 | Pass |
| Reveal it, then choose Recalled or Keep practicing. | 8 | Pass |
| Review your recap. | 3 | Pass |
| Export a JSON backup whenever you want one. | 9 | Pass |
| Prompts, responses, ratings, and recaps remain in this browser. | 9 | Pass |
| The app does not send usage reports. | 7 | Pass |
| The app does not teach content, check correctness, or promise learning results. | 12 | Pass |
| Contour adds saved prompt sets and your latest 20 session records. | 11 | Pass |
| Study sessions and JSON backup remain free. | 7 | Pass |
| Short answer-practice sessions for students and self-learners. | 7 | Pass |

No sentence exceeds 22 words. No sentence contains a banned marketing word.

## README sentences added or changed through round 5

| Copy | Words | Result |
| --- | ---: | --- |
| A practice tool for students who want short sessions without streaks, feeds, or generated lessons. | 15 | Pass; no subjective adjective. |
| This check fails when purchase setup is missing. | 8 | Pass; no untestable payment-side-effect promise. |
| The browser stores prompts, responses, recaps, saved sets, display preference, and your license token. | 14 | Pass; storage is stated separately. |
| A license check sends only the token to the Sociobot billing API. | 13 | Pass; the outbound verification path is explicit. |
| No analytics, advertising trackers, or third-party fonts and scripts ship. | 9 | Pass; registered as `no-advertising-scripts`. |
| Complete a study session to add its private recap here. | 10 | Pass; history empty state names the next step. |

The README contains no sentence over 22 words and no banned marketing word. Its
opening names the user and job in 15 words. The license explanation distinguishes
browser storage from the one token sent for verification. The no-tracking sentence
now has its own registered request-log and production-artifact test.

## Headings, actions, and labels

| Copy | Words | Purpose |
| --- | ---: | --- |
| Focus Study Sprint | 3 | Product name |
| Try it with sample data | 6 | Primary action |
| Add your prompts | 3 | Product setup heading |
| Load sample into my draft | 6 | Real-workspace sample action |
| Choose the session length | 5 | Duration legend |
| Start study session | 3 | Start action |
| Complete a study session in three steps | 7 | Process heading |
| Your study material stays local | 6 | Privacy heading |
| This app does not check answers | 6 | Product-limit heading |
| Keep reusable prompt sets for $12 | 6 | Price heading |
| Buy Contour once for $12 | 5 | Purchase action |
| Load this prompt set | 4 | Saved-set action |
| Start a study session | 4 | Session-history empty-state action |

The headline is seven words. The next sentence names students and self-learners. The
sample-data action and its result appear together in the first 520 vertical pixels at
390×844, so the first screen can be read aloud in one breath.

## Terminology

| Concept | One term used |
| --- | --- |
| A timed practice run | study session |
| One question plus expected response | prompt pair |
| Post-session record | recap |
| Isolated sample workspace | demo |
| Portable data file | JSON backup |
| Reusable group of prompts | prompt set |
| One-time paid entitlement | Contour license |
