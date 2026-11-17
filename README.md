# Coy — Discover tab

A small standalone version of a swipe-to-match "Discover" tab. React (built with Vite) on the front, Node.js + Express on the back, data in a JSON file.

## Run it

```bash
npm install   # install
npm start     # build the frontend and start the server on http://localhost:3000
npm test      # run the matching and privacy tests
```

Open http://localhost:3000 (use your browser's phone view for the mobile layout).
To reset the demo, delete `data/swipes.json` and restart.

Demo tip: Diya, Vihaan, Meera, Aditya, Myra, Aisha, Riya and Sneha have already liked you, so liking any of them shows "It's a match!".

## API

| Method | Path | What it does |
|---|---|---|
| GET | `/feed` | Profiles you have not swiped on yet |
| POST | `/swipe` | Body `{ "profileId": "2", "action": "like" \| "pass" }`. Returns `{ "match": true }` or `{ "match": false }` |
| GET | `/matches` | Profiles where both sides liked each other |

## Design choices

- **Small and plain.** Three backend files, three React components, no state library, no database server. The only dependencies are Express, React and Vite.
- **Profiles are fixed seed data** (`server/profiles.js`, 30 people). Each has a server-only `likedYou` flag that stands in for "this person already swiped right on you".
- **Only swipes are stored** (`data/swipes.json`, e.g. `{"2":"like","5":"pass"}`). Matches are not stored separately. They are worked out from the swipes plus `likedYou`, so they can never get out of sync. Because the swipes are on disk, both the swipes and the matches survive reloads and restarts.
- **Privacy is enforced on the server.** Every profile goes through `publicProfile()` before it leaves the server, and that function copies only the public fields, so `likedYou` can never be sent. The only time the server says someone liked you is in the `/swipe` reply or `/matches`, and only when you have liked them too (a mutual match).
- **The feed order is fixed** (seed order), and the people who liked you are spread through it, so their position doesn't give anything away.
- **Swipe UI.** Pointer events handle both touch and mouse dragging. The card follows your finger and tilts. A LIKE/NOPE stamp fades in as you drag. Past 100px the card flies off, otherwise it snaps back. The Like/Pass buttons run the same animation for desktop.
- **Express serves the built React app**, so one command starts everything on one port, with no CORS setup.

## Edge cases handled

- A swiped profile never comes back: `/feed` filters it out, and a second swipe on it returns `409 Already swiped`.
- Unknown profile id → `404`. Action other than `like`/`pass` → `400`.
- Passing on someone who liked you gives `{ "match": false }`, the same reply as passing on anyone else, so nothing leaks.
- Liking someone who hasn't liked you is not a match and doesn't show up in `/matches`.
- No profiles left → a clear "You've seen everyone for now" message, which also shows after a reload.
- No matches yet → "No matches yet. Keep swiping!"
- Buttons are disabled while a card is flying off, so a double click can't send two swipes.
- `touch-action: none` on the card stops the page from scrolling while you drag on mobile.

## Tests

`test/api.test.js` (Node's built-in test runner, a fresh data file per test) checks:
mutual like = match, one-sided like = no match, pass on a liker = no match and no leak,
the feed never includes `likedYou`, swiped profiles leave the feed and can't be swiped again, bad input is rejected, and data survives a restart.

## Part A: Feature suggestions

TO BE FILLED IN BY ME
