# DECODE — The Quote Cipher Game

A mobile-friendly puzzle game: every quote is scrambled into a cipher, and you
answer 5 simple clues to decode it — live, letter by letter, no submit button.
It's a real cryptogram: every letter on screen shares a cipher number with
every other instance of that letter, so solving one box instantly reveals
every matching box across the whole puzzle.

Solving puzzles earns **hearts** (the in-game currency), there's a **daily
reward** with a streak bonus and a flying-hearts claim animation, and
progress can sync to an account via Firebase — or just run entirely
on-device with zero setup.

**7 categories, 17–25 puzzles each right now (159 total)** — working
toward 50 each (350 total). The data file is built so more can be
appended without touching any game code. See "Adding more puzzles" below.

Categories are picked from a swipeable horizontal carousel (not a list) —
built for one-thumb phone use. There's no intro/developer-note screen
anymore either — it opens straight into the app.

No ads, no accounts required, packaged as a native Android app.

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

## 2. Turn it into a real Android APK

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

## 3. Accounts, hearts, and daily rewards

The game now has a small progression economy:

- **Hearts** are the currency. Solving a puzzle for the first time earns
  hearts — more for a clean 3-star solve (no wrong letters), less for 1–2
  stars. Re-solving an already-solved puzzle earns nothing (no farming).
- **Daily reward** — a card on the home screen gives free hearts once every
  24 hours, with a small streak bonus that grows the more consecutive days
  you claim it (capped after 5 days).
- **Account progression** — this is powered by Firebase behind the scenes:
  a player is signed in anonymously (no login screen, it just happens), and
  their hearts + solved puzzles + daily-claim state sync to a small
  database document. This means progress survives reinstalling the app on
  the same device, and it's the foundation for adding real sign-in later if
  you ever want progress to follow someone across devices.

**You don't have to set any of this up.** If you skip the Firebase steps
below, `backend.js` automatically falls back to local-only mode — hearts,
solved puzzles, and daily rewards all still work exactly the same, just
saved on that one device instead of synced to the cloud. Nothing breaks
either way.

### Setting up Firebase (optional, free)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and create a new project (the free "Spark" plan is plenty for this).
2. In the left sidebar: **Build → Authentication → Get started**. Under
   "Sign-in method", enable **Anonymous**.
3. In the left sidebar: **Build → Firestore Database → Create database**.
   Start in production mode (we'll set rules below).
4. Go to **Project settings** (the gear icon) → scroll to "Your apps" →
   click the **</>** (web) icon to register a web app. Copy the config
   object it gives you.
5. Paste those values into `firebase-config.js`, replacing the placeholder
   strings.
6. In Firestore, go to the **Rules** tab and replace the default rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /players/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
   This makes sure each player can only ever read or write their own data.
7. Reload the game. Open your browser's dev console — if you see no
   Firebase errors, it's connected. Progress will now appear as a document
   under `players/<some-id>` in the Firestore console.

## 4. Your pet (v1)

A kawaii blob companion lives on its own screen (tap "Visit your pet" on
the home screen). It's a real Tamagotchi-style system:

- **Naming & color** — the first time you visit, it asks you to name your
  blob and pick its color from 6 swatches. Tap the pencil icon next to its
  name anytime to change either later.
- **3 stats** — Hunger, Hygiene, Happiness (0–100), each decaying by 2
  points per real hour since you last checked in. Neglect it and its
  face changes: happy → neutral → sad → sick, with a little idle
  breathing animation that changes pace with mood.
- **Touch it** — tapping the blob directly makes it squish and pop off a
  little burst of sparkles, just for fun (no stat effect — it's purely a
  "you're here, I noticed" reaction).
- **Brush it** — tapping Brush puts a sponge under your finger. Drag it
  across the blob's body and hygiene rises in real time while it wiggles
  happily; tap Done when you're finished.
- **Feed it** — pick a food from your inventory (bought in the shop), then
  drag it onto the blob's body. It leans in as you get close, then does a
  little chomp animation and the food disappears when you release on
  target. Missing the blob just cancels the feed, no food wasted.
- **Play** — opens a 20-second "Catch the Hearts" mini-game. Your score
  converts into happiness gained and a small hearts bonus.
- **Shop** — spend hearts on food (consumable) or accessories (permanent,
  equip/unequip anytime — bow tie, party hat, sunglasses, scarf so far).

This is intentionally v1 of a "deep" system: 3 stats, 3 foods, 4
accessories, 1 mini-game, 6 colors. Everything is catalog-driven in
`backend.js` (`FOOD_CATALOG`, `ACCESSORY_CATALOG`, `PET_COLORS`) and
`pet.js` (`FACES`, `ACCESSORY_SVG`), so adding a new food, outfit, color,
or a second mini-game doesn't require restructuring anything.

## 5. How the puzzle mechanic works

- `data.js` holds every puzzle as `{ id, source, quote, questions }`.
- `questions` is always an array of exactly 5 `{ q, a }` pairs — `a` must be
  spelled exactly as it appears in `quote` (matching is case-insensitive and
  ignores punctuation except apostrophes).
- The game engine (`app.js`) scans the quote word by word. Any word that
  matches one of the 5 answers becomes a row of individual letter boxes;
  everything else stays visible as a connector word (like "the", "is", "a").
- Each clue also gets its own row of letter boxes to type the answer into —
  one letter per box, auto-advancing as you type.
- Every letter, in both the quote and the answer boxes, shows a small
  cipher number underneath it (A–Z shuffled, e.g. P = 7). That number is
  the real mechanic: type a letter correctly in **any** box, and every
  other box sharing that same letter — in the quote, and in every other
  clue's answer row — reveals instantly. No submit button needed.
- Type a wrong letter and just that box flashes red so you know to try
  again; nothing else is affected.
- The puzzle auto-completes the moment every letter is solved: the full
  quote and its source reveal, progress saves to the phone's local
  storage, and a star rating pops up (3 stars for zero mistakes).

## 6. Adding more puzzles (scaling up to 50 per category)

Just append more objects to the right array in `data.js`:

```js
movies: [
  // ...existing puzzles...
  {
    id: "movies_09",
    source: "Movie Title (Year)",
    quote: "YOUR QUOTE WRITTEN IN CAPS SEPARATED BY SPACES",
    questions: [
      { q: "Simple, casual clue for word 1", a: "WORD1" },
      { q: "Simple, casual clue for word 2", a: "WORD2" },
      { q: "Simple, casual clue for word 3", a: "WORD3" },
      { q: "Simple, casual clue for word 4", a: "WORD4" },
      { q: "Simple, casual clue for word 5", a: "WORD5" }
    ]
  }
]
```

Keep clues casual, like you're explaining a word to a friend — "a type of
living thing" for ANIMAL, not a dictionary definition. Nothing else needs
to change — the picker screen, progress tracker, and score counter all
read the array length automatically.

**One content note:** the Music category uses short *spoken* quotes from
musicians (interviews, sayings) rather than song lyrics. Reproducing actual
lyrics isn't something that belongs in an app you're distributing, even a
private one — copyright holders can and do issue takedowns on exactly this
kind of use. Sticking to spoken quotes and music trivia keeps the category
totally safe.

## 7. File structure

```
decoder-game/
├── package.json
├── capacitor.config.json
├── .github/
│   └── workflows/
│       └── build-apk.yml
├── README.md            this file
└── docs/
    ├── index.html         the app shell (all screens)
    ├── style.css          the visual theme
    ├── app.js             puzzle game engine + interactions
    ├── data.js            all puzzle content — edit this to add puzzles
    ├── backend.js         accounts, hearts, daily reward, pet economy
    ├── pet.js             the virtual pet screen, shop, and mini-game
    ├── firebase-config.js your Firebase project keys (already filled in)
    └── manifest.json      lets phones "install" it as an app icon
```
