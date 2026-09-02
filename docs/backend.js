/*
  DECODE — Backend (accounts, hearts, daily reward)
  =====================================================================
  Exposes window.Backend with a small API that app.js calls into.
  Two modes, same API either way:

  1. FIREBASE MODE — if firebase-config.js has real keys, this signs the
     player in anonymously (no login screen, just happens automatically)
     and syncs their hearts + solved puzzles + daily reward state to a
     Firestore document at players/{uid}. Progress follows them if they
     ever reinstall on the same device (auth persists), and this is the
     foundation for adding real sign-in later if you want cross-device
     sync.

  2. LOCAL-ONLY MODE — if firebase-config.js still has placeholder keys
     (or the Firebase SDK fails to load/init for any reason), everything
     falls back to localStorage automatically. Same features, just
     saved on-device only. The game never breaks either way.
*/

const Backend = (() => {
  const LOCAL_KEY = "decode_player_v1";
  const SOLVE_REWARD = { 3: 15, 2: 10, 1: 5 };
  const DAILY_BASE = 20;
  const DAILY_STREAK_BONUS_PER_DAY = 5;
  const DAILY_STREAK_CAP_DAYS = 5;

  let useFirebase = false;
  let db = null;
  let uid = null;
  let playerData = null;
  const listeners = [];

  function defaultPlayerData() {
    return {
      hearts: 0,
      solved: { movies: [], series: [], history: [], animals: [], music: [] },
      lastDailyClaim: null,
      streak: 0
    };
  }

  function todayStr(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function notify() {
    listeners.forEach(fn => { try { fn(playerData); } catch (e) {} });
  }

  function onPlayerDataChange(fn) {
    listeners.push(fn);
    if (playerData) fn(playerData);
  }

  // ---------------- local-only mode ----------------
  function loadLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? Object.assign(defaultPlayerData(), JSON.parse(raw)) : defaultPlayerData();
    } catch (e) { return defaultPlayerData(); }
  }
  function saveLocal() {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(playerData)); } catch (e) {}
  }

  // ---------------- firebase mode ----------------
  function isFirebaseConfigured() {
    return typeof FIREBASE_CONFIG !== "undefined" &&
      FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" &&
      typeof firebase !== "undefined";
  }

  function initFirebase() {
    return new Promise((resolve, reject) => {
      try {
        firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        const auth = firebase.auth();
        auth.onAuthStateChanged(user => {
          if (user) {
            uid = user.uid;
            resolve();
          } else {
            auth.signInAnonymously().catch(reject);
          }
        }, reject);
      } catch (e) { reject(e); }
    });
  }

  async function loadOrCreateRemoteDoc() {
    const ref = db.collection("players").doc(uid);
    const snap = await ref.get();
    if (snap.exists) {
      playerData = Object.assign(defaultPlayerData(), snap.data());
    } else {
      playerData = defaultPlayerData();
      await ref.set(playerData);
    }
    ref.onSnapshot(s => {
      if (s.exists) {
        playerData = Object.assign(defaultPlayerData(), s.data());
        notify();
      }
    });
  }

  async function persist() {
    if (useFirebase && db && uid) {
      try {
        await db.collection("players").doc(uid).set(playerData);
      } catch (e) {
        console.warn("DECODE: Firestore write failed, saving locally instead.", e);
        saveLocal();
      }
    } else {
      saveLocal();
    }
    notify();
  }

  async function initBackend() {
    useFirebase = isFirebaseConfigured();
    if (useFirebase) {
      try {
        await initFirebase();
        await loadOrCreateRemoteDoc();
      } catch (e) {
        console.warn("DECODE: Firebase unavailable, running in local-only mode.", e);
        useFirebase = false;
      }
    }
    if (!useFirebase) {
      playerData = loadLocal();
    }
    notify();
  }

  // ---------------- public API ----------------
  function getPlayerData() { return playerData || defaultPlayerData(); }

  function isBackendRemote() { return useFirebase; }

  function isPuzzleSolved(category, puzzleId) {
    const p = getPlayerData();
    return !!(p.solved[category] && p.solved[category].includes(puzzleId));
  }

  function totalSolvedCount() {
    return Object.values(getPlayerData().solved).reduce((sum, arr) => sum + arr.length, 0);
  }

  // Records a first-time solve and awards hearts. Returns the hearts
  // earned (0 if this puzzle was already solved before — no farming).
  async function recordSolve(category, puzzleId, stars) {
    if (!playerData) return 0;
    if (!playerData.solved[category]) playerData.solved[category] = [];
    if (playerData.solved[category].includes(puzzleId)) return 0;
    playerData.solved[category].push(puzzleId);
    const reward = SOLVE_REWARD[stars] || SOLVE_REWARD[1];
    playerData.hearts = (playerData.hearts || 0) + reward;
    await persist();
    return reward;
  }

  function canClaimDaily() {
    const p = getPlayerData();
    return p.lastDailyClaim !== todayStr();
  }

  // Awards the daily reward (base + streak bonus) if not already
  // claimed today. Returns { reward, streak } or null if already claimed.
  async function claimDailyReward() {
    if (!playerData || !canClaimDaily()) return null;
    const today = todayStr();
    const yesterday = todayStr(new Date(Date.now() - 86400000));
    playerData.streak = playerData.lastDailyClaim === yesterday ? (playerData.streak || 0) + 1 : 1;
    const bonus = Math.min(playerData.streak, DAILY_STREAK_CAP_DAYS) * DAILY_STREAK_BONUS_PER_DAY;
    const reward = DAILY_BASE + bonus;
    playerData.hearts = (playerData.hearts || 0) + reward;
    playerData.lastDailyClaim = today;
    await persist();
    return { reward, streak: playerData.streak };
  }

  return {
    initBackend,
    getPlayerData,
    isBackendRemote,
    isPuzzleSolved,
    totalSolvedCount,
    recordSolve,
    canClaimDaily,
    claimDailyReward,
    onPlayerDataChange
  };
})();
