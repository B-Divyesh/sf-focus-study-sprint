# Demo sandbox

Open <https://focus-study-sprint.sociobot.in/demo> or use `/?demo=1`. The landing
page action **Try it with sample data** opens the same sandbox in one click.

The demo starts inside a five-prompt, five-minute answer-practice session. Its sample
covers biology, geography, web terminology, cell biology, and modern history. The
banner remains visible on every demo screen.

- **Reset demo** deletes the demo database and all `demo:fss:*` localStorage keys,
  then starts the five-prompt session again.
- **Start for real**, Privacy, Terms, and a demo purchase link clear the same
  demo-only data before leaving demo mode. They never copy sample work into the real
  workspace.
- Demo localStorage keys begin with `demo:fss:`.
- Demo sessions and prompt sets use the `demo:focus-study-sprint` IndexedDB database.
  Leaving demo mode deletes that database.
- Normal data continues to use `fss:*` keys and the `focus-study-sprint` database.

The demo needs no account, license, environment variable, or external API.
