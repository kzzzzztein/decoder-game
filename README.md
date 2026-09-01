# DECODE — The Quote Cipher Game

A mobile-friendly puzzle game: every quote is scrambled into a cipher, and you
answer 5 trivia clues to decode it, letter by letter, live as you type.

**5 categories, 4 puzzles each right now (20 total)** — the data file is built
so you (or I, in a follow-up) can expand every category up to 50 without
touching any game code. See "Adding more puzzles" below.

No ads, no accounts, no backend. It's a single static site — 4 files.

---

## 1. Try it locally

Just open `index.html` in a browser, or run a tiny local server (recommended,
since some browsers restrict local file access for scripts):

```bash
cd decoder-game
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## 2. Deploy free on GitHub Pages

1. Create a new GitHub repo (e.g. `decode-game`).
2. Push these files to the repo root (or a `/docs` folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DECODE puzzle game"
   git branch -M main
   git remote add origin https://github.com/<your-username>/decode-game.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source** → select
   `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
4. After a minute, your game is live at:
   `https://<your-username>.github.io/decode-game/`

That link works on any phone browser already — you can share it directly.

---

## 3. Turn it into a real Android APK

The easiest path is **Capacitor**, which wraps a web app into a native
Android project you build in Android Studio.

```bash
# from inside the decoder-game folder
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "DECODE" "com.yourname.decode" --web-dir "."
npx cap add android
npx cap copy
npx cap open android
```

That last command opens Android Studio. From there:
`Build → Build Bundle(s)/APK(s) → Build APK(s)`. The `.apk` shows up under
`android/app/build/outputs/apk/debug/`. Install it on a phone (enable
"install unknown apps") or upload the signed release build to the Play
Store later.

Requirements: Node.js, Android Studio with an SDK installed. Capacitor's own
docs (capacitor.dev) have screenshots if any step looks different on your
version.

---

## 4. How the puzzle mechanic works

- `data.js` holds every puzzle as `{ id, source, quote, questions }`.
- `questions` is always an array of exactly 5 `{ q, a }` pairs — `a` must be
  spelled exactly as it appears in `quote` (matching is case-insensitive and
  ignores punctuation except apostrophes).
- The game engine (`app.js`) scans the quote word by word. Any word that
  matches one of the 5 answers becomes a blank; everything else stays
  visible as a connector word (like "the", "is", "a").
- Typing in a clue's input box fills that word's blank letters live, one
  keystroke at a time — no need to press submit to see it happen.
- Each letter also shows a small number underneath it — a fixed
  substitution cipher (A–Z shuffled, e.g. P = 7) purely for the
  "decoder" visual flavor.
- Pressing **Check answers** grades all 5 clues at once. Get all 5 right and
  the full quote is revealed along with its source, progress saves to the
  phone's local storage, and a star rating pops up (3 stars if you solved it
  on the first check).

## 5. Adding more puzzles (scaling up to 50 per category)

Just append more objects to the right array in `data.js`:

```js
movies: [
  // ...existing puzzles...
  {
    id: "movies_05",
    source: "Movie Title (Year)",
    quote: "YOUR QUOTE WRITTEN IN CAPS SEPARATED BY SPACES",
    questions: [
      { q: "Clue for word 1", a: "WORD1" },
      { q: "Clue for word 2", a: "WORD2" },
      { q: "Clue for word 3", a: "WORD3" },
      { q: "Clue for word 4", a: "WORD4" },
      { q: "Clue for word 5", a: "WORD5" }
    ]
  }
]
```

Nothing else needs to change — the picker screen, progress tracker, and
score counter all read the array length automatically.

**One content note:** the Music category uses short *spoken* quotes from
musicians (interviews, sayings) rather than song lyrics. Reproducing actual
lyrics isn't something that belongs in an app you're distributing, even a
private one — copyright holders can and do issue takedowns on exactly this
kind of use. Sticking to spoken quotes and music trivia keeps the category
totally safe.

## 6. File structure

```
decoder-game/
├── index.html      the app shell (all screens)
├── style.css        the visual theme
├── app.js           game engine + interactions
├── data.js          all puzzle content — edit this to add puzzles
├── manifest.json    lets phones "install" it as an app icon
└── README.md        this file
```
