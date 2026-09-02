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

  // ---------------- pet shop catalogs (exported for pet.js to render) ----------------
  const FOOD_CATALOG = [
    { id: "berry",    name: "Berry",    emoji: "🍓", cost: 5,  restore: 15 },
    { id: "sandwich", name: "Sandwich", emoji: "🥪", cost: 12, restore: 35 },
    { id: "feast",    name: "Feast",    emoji: "🍱", cost: 25, restore: 70 }
  ];
  const ACCESSORY_CATALOG = [
    { id: "bowtie",     name: "Bow Tie",     emoji: "🎀" , cost: 20 },
    { id: "partyhat",   name: "Party Hat",   emoji: "🎉", cost: 20 },
    { id: "sunglasses", name: "Sunglasses",  emoji: "🕶️", cost: 25 },
    { id: "scarf",      name: "Scarf",       emoji: "🧣", cost: 25 }
  ];
  const PET_DECAY_PER_HOUR = 2;   // each stat drops this much per real hour
  const CLEAN_GAIN = 25;
  const MAX_STAT = 100;

  let useFirebase = false;
  let db = null;
  let uid = null;
  let playerData = null;
  const listeners = [];

  const PET_COLORS = ["#FFD9E8", "#D8F5D0", "#DCE4FF", "#FFF3B0", "#E4D4FF", "#C9F2EC"];

  function defaultPet() {
    return {
      name: "Blob",
      nameSet: false,
      color: PET_COLORS[0],
      hunger: 100,
      hygiene: 100,
      happiness: 100,
      lastUpdate: Date.now(),
      inventory: {},        // { berry: 2, sandwich: 1, ... }
      owned: [],            // accessory ids purchased
      equipped: null         // accessory id currently worn, or null
    };
  }

  function defaultPlayerData() {
    // Builds the solved-categories map from whatever categories exist in
    // PUZZLE_DATA (data.js loads before this is ever called), so adding a
    // new category there never requires touching backend.js.
    const categories = (typeof PUZZLE_DATA !== "undefined")
      ? Object.keys(PUZZLE_DATA)
      : ["movies", "series", "history", "animals", "music"]; // fallback
    const solved = {};
    categories.forEach(cat => { solved[cat] = []; });
    return {
      hearts: 0,
      solved,
      lastDailyClaim: null,
      streak: 0,
      pet: defaultPet()
    };
  }

  function hydrate(saved) {
    const base = defaultPlayerData();
    const merged = Object.assign({}, base, saved || {});
    merged.pet = Object.assign({}, base.pet, (saved && saved.pet) || {});
    merged.solved = Object.assign({}, base.solved, (saved && saved.solved) || {});
    return merged;
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
      return raw ? hydrate(JSON.parse(raw)) : defaultPlayerData();
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
      playerData = hydrate(snap.data());
    } else {
      playerData = defaultPlayerData();
      await ref.set(playerData);
    }
    ref.onSnapshot(s => {
      if (s.exists) {
        playerData = hydrate(s.data());
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

  // ---------------- pet care ----------------

  // Applies real-time decay since the pet was last checked on, then
  // persists the new stat values + timestamp. Safe to call every time the
  // pet screen opens — if called again moments later, elapsed time is
  // ~0 so nothing changes.
  async function applyPetDecay() {
    if (!playerData) return;
    const pet = playerData.pet;
    const now = Date.now();
    const hoursElapsed = Math.max(0, (now - (pet.lastUpdate || now)) / 3600000);
    if (hoursElapsed > 0) {
      const drop = hoursElapsed * PET_DECAY_PER_HOUR;
      pet.hunger = Math.max(0, pet.hunger - drop);
      pet.hygiene = Math.max(0, pet.hygiene - drop);
      pet.happiness = Math.max(0, pet.happiness - drop);
      pet.lastUpdate = now;
      await persist();
    }
  }

  function getPetMood() {
    const pet = getPlayerData().pet;
    const avg = (pet.hunger + pet.hygiene + pet.happiness) / 3;
    if (avg >= 70) return "happy";
    if (avg >= 40) return "neutral";
    if (avg >= 20) return "sad";
    return "sick";
  }

  async function spendHearts(amount) {
    if (!playerData || (playerData.hearts || 0) < amount) return false;
    playerData.hearts -= amount;
    await persist();
    return true;
  }

  // Feeds using one unit of the given food from inventory. Returns
  // { success, reason? }.
  async function feedPet(foodId) {
    if (!playerData) return { success: false, reason: "not-ready" };
    const food = FOOD_CATALOG.find(f => f.id === foodId);
    if (!food) return { success: false, reason: "unknown-food" };
    const have = playerData.pet.inventory[foodId] || 0;
    if (have <= 0) return { success: false, reason: "out-of-stock" };
    playerData.pet.inventory[foodId] = have - 1;
    playerData.pet.hunger = Math.min(MAX_STAT, playerData.pet.hunger + food.restore);
    await persist();
    return { success: true };
  }

  async function addHygiene(amount) {
    if (!playerData || amount <= 0) return;
    playerData.pet.hygiene = Math.min(MAX_STAT, playerData.pet.hygiene + amount);
    await persist();
  }

  async function cleanPet() {
    await addHygiene(CLEAN_GAIN);
  }

  async function setPetName(name) {
    if (!playerData) return;
    const trimmed = (name || "").trim().slice(0, 16);
    if (!trimmed) return;
    playerData.pet.name = trimmed;
    playerData.pet.nameSet = true;
    await persist();
  }

  async function setPetColor(hex) {
    if (!playerData) return;
    playerData.pet.color = hex;
    await persist();
  }

  // Called when the mini-game ends. Adds happiness (capped) and a small
  // hearts bonus based on score.
  async function applyPlayResult(happinessGain, heartsBonus) {
    if (!playerData) return;
    playerData.pet.happiness = Math.min(MAX_STAT, playerData.pet.happiness + happinessGain);
    playerData.hearts = (playerData.hearts || 0) + (heartsBonus || 0);
    await persist();
  }

  async function buyFood(foodId) {
    const food = FOOD_CATALOG.find(f => f.id === foodId);
    if (!food) return { success: false, reason: "unknown-item" };
    const ok = await spendHearts(food.cost);
    if (!ok) return { success: false, reason: "not-enough-hearts" };
    playerData.pet.inventory[foodId] = (playerData.pet.inventory[foodId] || 0) + 1;
    await persist();
    return { success: true };
  }

  async function buyAccessory(accessoryId) {
    const item = ACCESSORY_CATALOG.find(a => a.id === accessoryId);
    if (!item) return { success: false, reason: "unknown-item" };
    if (playerData.pet.owned.includes(accessoryId)) return { success: false, reason: "already-owned" };
    const ok = await spendHearts(item.cost);
    if (!ok) return { success: false, reason: "not-enough-hearts" };
    playerData.pet.owned.push(accessoryId);
    await persist();
    return { success: true };
  }

  async function equipAccessory(accessoryId) {
    if (!playerData) return;
    if (accessoryId !== null && !playerData.pet.owned.includes(accessoryId)) return;
    playerData.pet.equipped = playerData.pet.equipped === accessoryId ? null : accessoryId;
    await persist();
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
    onPlayerDataChange,
    FOOD_CATALOG,
    ACCESSORY_CATALOG,
    PET_COLORS,
    applyPetDecay,
    getPetMood,
    spendHearts,
    feedPet,
    cleanPet,
    addHygiene,
    applyPlayResult,
    buyFood,
    buyAccessory,
    equipAccessory,
    setPetName,
    setPetColor
  };
})();
