# Submission

Repo: https://github.com/psveerr/coy-discover

## Part A answers: Feature suggestions

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
