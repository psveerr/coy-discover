# Coy — Discover tab

A small standalone version of a swipe-to-match "Discover" tab. React (built with Vite) on the front, Node.js + Express on the back, data in a JSON file.

## Run it

Needs Node.js 20.19 or newer.

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
- **Profiles are fixed seed data** (`server/profiles.js`, 30 people, ages 20–24). Each has a server-only `likedYou` flag that stands in for "this person already swiped right on you".
- **Placeholder photos are illustrated avatars**, not photos of real people. A dating app should not put real strangers' faces on fake profiles. Each avatar was picked to match the profile (gender, adult look) and is stored in `public/photos`, so the app works offline and does not depend on another website. Made with [DiceBear](https://www.dicebear.com) using the [Avataaars](https://avataaars.com) design by Pablo Stanley (free for personal and commercial use).
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

Coy's core promise is that nobody finds out you like them unless they like you back. Every suggestion below is built around keeping that promise.

### 1. "Someone likes you" counter that can't leak
- **What:** Show "3 people on your campus like you" without saying who.
- **Why:** Curiosity brings people back and makes them swipe more (daily active users, swipes per session).
- **Privacy:** A naive counter leaks. If it goes up right after one person joins or swipes, you can guess who it was. So show it only once the count is 3 or more, update it once a day instead of live, and round it ("3+", "10+").

### 2. Daily like limit ("crush budget")
- **What:** A fixed number of likes per day, for example 10.
- **Why:** When likes are scarce, people stop liking everyone just to see who likes them back. A like means more, matches are better, and popular users get fewer junk likes.
- **Measure:** Matches per like, and how many matches turn into conversations.
- **Effort:** Small. One counter per user per day, checked on the server.

### 3. Matches that expire, with an icebreaker
- **What:** A match disappears after 48 hours unless someone sends a message. Coy suggests a first line based on shared interests ("You both like trekking. Best trek you've done?").
- **Why:** On a double-blind app both people are often too shy to text first. A deadline plus a ready-made opener gets more matches talking.
- **Measure:** Share of matches with a first message within 48 hours.

### 4. Undo the last pass
- **What:** A rewind button for an accidental left swipe.
- **Why:** Passing on your real crush by mistake is the most painful error in this app.
- **Privacy:** Safe, because a pass is never shown to anyone. Only passes can be undone. A like that already made a match cannot be taken back, or people could "unlike" after seeing the match screen.
- **Effort:** Tiny. Delete that one swipe on the server.

### 5. College verification, plus block and report
- **What:** Sign up with a college email so every profile is a real student. Add block and report.
- **Why:** Trust matters most when the app is about real crushes on real classmates. Fake profiles could also be used to fish for who likes whom.
- **Privacy:** Blocking hides both people from each other's feeds for good, and the blocked person is never told.
