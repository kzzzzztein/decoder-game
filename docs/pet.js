/* DECODE — Virtual Pet
   =====================================================================
   A kawaii blob companion. Hunger/Hygiene/Happiness decay over real
   time (see Backend.applyPetDecay). Feed/Clean/Play restore them.
   Food and accessories are bought with hearts in the shop. Play opens
   a short "catch the hearts" mini-game that boosts happiness and pays
   out a small hearts bonus.

   This is v1 of the "deep" pet system: 3 stats, 3 foods, 4 accessories,
   1 mini-game. More foods/accessories/mini-games can be added to the
   catalogs in backend.js (FOOD_CATALOG / ACCESSORY_CATALOG) and to the
   MINI_GAMES list below without restructuring anything.
*/

const Pet = (() => {
  let gameTimer = null;
  let gameSpawner = null;
  let gameScore = 0;
  const GAME_DURATION_MS = 20000;

  // ---------------- entry point ----------------
  function renderPet() {
    Backend.applyPetDecay().then(() => {
      draw();
      showScreen("screen-pet");
      const pet = Backend.getPlayerData().pet;
      if (!pet.nameSet) openCustomize();
    });
  }

  function draw() {
    const pet = Backend.getPlayerData().pet;
    const mood = Backend.getPetMood();
    document.getElementById("petStage").innerHTML = buildBlobSVG(mood, pet.equipped, pet.color);
    document.getElementById("petName").textContent = pet.name;
    document.getElementById("petHeartsLabel").textContent = `♥ ${Backend.getPlayerData().hearts}`;
    setBar("hunger", pet.hunger);
    setBar("hygiene", pet.hygiene);
    setBar("happiness", pet.happiness);
    bindTouchReaction();
  }

  function setBar(key, value) {
    const fill = document.getElementById(`bar-${key}-fill`);
    const label = document.getElementById(`bar-${key}-label`);
    const pct = Math.round(value);
    fill.style.width = `${pct}%`;
    fill.classList.remove("bar-good", "bar-mid", "bar-low");
    fill.classList.add(pct >= 60 ? "bar-good" : pct >= 30 ? "bar-mid" : "bar-low");
    label.textContent = `${pct}%`;
  }

  // ---------------- blob SVG ----------------
  function buildBlobSVG(mood, equippedId, bodyColor) {
    const bodyStroke = shadeColor(bodyColor, -18);
    const face = FACES[mood] || FACES.neutral;
    const accessory = ACCESSORY_SVG[equippedId] || "";
    return `
      <svg viewBox="0 0 200 200" class="pet-blob pet-mood-${mood}">
        <ellipse cx="100" cy="115" rx="72" ry="66" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="3"/>
        <ellipse cx="72" cy="120" rx="12" ry="8" fill="#FFB6D2" opacity="0.7"/>
        <ellipse cx="128" cy="120" rx="12" ry="8" fill="#FFB6D2" opacity="0.7"/>
        ${face}
        ${accessory}
      </svg>
    `;
  }

  // Darkens/lightens a hex color by `percent` (negative = darker).
  function shadeColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  }

  const FACES = {
    happy: `
      <circle cx="78" cy="102" r="7" fill="#43293A"/>
      <circle cx="122" cy="102" r="7" fill="#43293A"/>
      <circle cx="80" cy="99" r="2" fill="#fff"/>
      <circle cx="124" cy="99" r="2" fill="#fff"/>
      <path d="M 80 128 Q 100 145 120 128" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
    `,
    neutral: `
      <circle cx="78" cy="102" r="6" fill="#43293A"/>
      <circle cx="122" cy="102" r="6" fill="#43293A"/>
      <circle cx="80" cy="100" r="1.6" fill="#fff"/>
      <circle cx="124" cy="100" r="1.6" fill="#fff"/>
      <path d="M 85 130 Q 100 136 115 130" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
    `,
    sad: `
      <path d="M 71 98 Q 78 92 85 98" stroke="#43293A" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 115 98 Q 122 92 129 98" stroke="#43293A" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="78" cy="106" r="6" fill="#43293A"/>
      <circle cx="122" cy="106" r="6" fill="#43293A"/>
      <path d="M 84 138 Q 100 126 116 138" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
    `,
    sick: `
      <path d="M 71 100 L 85 108 M 85 100 L 71 108" stroke="#43293A" stroke-width="3" stroke-linecap="round"/>
      <path d="M 115 100 L 129 108 M 129 100 L 115 108" stroke="#43293A" stroke-width="3" stroke-linecap="round"/>
      <path d="M 84 136 Q 100 128 116 136" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <text x="140" y="70" font-size="16" fill="#7BAFC4">z</text>
      <text x="150" y="58" font-size="12" fill="#7BAFC4">z</text>
    `
  };

  const ACCESSORY_SVG = {
    bowtie: `<path d="M 88 148 L 100 140 L 88 132 Z M 112 148 L 100 140 L 112 132 Z" fill="#E8578D" stroke="#C23570" stroke-width="2"/><circle cx="100" cy="140" r="4" fill="#C23570"/>`,
    partyhat: `<path d="M 100 30 L 82 68 L 118 68 Z" fill="#F2A93B" stroke="#D9891B" stroke-width="2"/><circle cx="100" cy="30" r="5" fill="#E8455C"/>`,
    sunglasses: `<rect x="65" y="94" width="26" height="14" rx="6" fill="#43293A"/><rect x="109" y="94" width="26" height="14" rx="6" fill="#43293A"/><rect x="91" y="98" width="18" height="4" fill="#43293A"/>`,
    scarf: `<path d="M 60 140 Q 100 158 140 140 L 140 152 Q 100 168 60 152 Z" fill="#2FB8AE" stroke="#22897F" stroke-width="2"/>`
  };

  // ---------------- touch reaction ----------------
  function bindTouchReaction() {
    const blob = document.querySelector("#petStage .pet-blob");
    if (!blob) return;
    blob.addEventListener("pointerdown", handleBlobTouch);
  }

  function handleBlobTouch(e) {
    const blob = e.currentTarget;
    blob.classList.remove("pet-squish");
    void blob.offsetWidth; // restart animation if tapped again quickly
    blob.classList.add("pet-squish");

    const stage = document.getElementById("petStage");
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY || rect.top + rect.height / 2) - rect.top;
    spawnSparkles(stage, x, y);
  }

  function spawnSparkles(container, x, y) {
    const symbols = ["✦", "♥", "✨"];
    for (let i = 0; i < 4; i++) {
      const s = document.createElement("span");
      s.className = "pet-sparkle";
      s.textContent = symbols[i % symbols.length];
      const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.6;
      const dist = 30 + Math.random() * 20;
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      s.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      container.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  // ---------------- customize (name + color) ----------------
  function openCustomize() {
    const pet = Backend.getPlayerData().pet;
    document.getElementById("customizeNameInput").value = pet.name;

    const swatchWrap = document.getElementById("customizeSwatches");
    swatchWrap.innerHTML = "";
    Backend.PET_COLORS.forEach(hex => {
      const sw = document.createElement("button");
      sw.className = "color-swatch" + (pet.color === hex ? " selected" : "");
      sw.style.background = hex;
      sw.dataset.hex = hex;
      sw.addEventListener("click", () => {
        swatchWrap.querySelectorAll(".color-swatch").forEach(el => el.classList.remove("selected"));
        sw.classList.add("selected");
      });
      swatchWrap.appendChild(sw);
    });

    document.getElementById("customizeOverlay").style.display = "flex";
  }

  async function saveCustomize() {
    const name = document.getElementById("customizeNameInput").value;
    const selected = document.querySelector("#customizeSwatches .color-swatch.selected");
    if (name.trim()) await Backend.setPetName(name);
    if (selected) await Backend.setPetColor(selected.dataset.hex);
    document.getElementById("customizeOverlay").style.display = "none";
    draw();
  }

  // ---------------- shared pointer-interaction layer ----------------
  // Used by both brush mode and feed mode: creates a fixed-position
  // transparent layer exactly over the pet stage, so dragging a finger
  // across it doesn't get interrupted by anything else on the page.
  function createInteractionLayer() {
    const stage = document.getElementById("petStage");
    const stageRect = stage.getBoundingClientRect();
    const blobEl = stage.querySelector(".pet-blob");
    const blobRect = (blobEl || stage).getBoundingClientRect();

    const layer = document.createElement("div");
    layer.className = "pet-interaction-layer";
    layer.style.left = `${stageRect.left}px`;
    layer.style.top = `${stageRect.top}px`;
    layer.style.width = `${stageRect.width}px`;
    layer.style.height = `${stageRect.height}px`;
    document.body.appendChild(layer);

    const hit = {
      cx: blobRect.left + blobRect.width / 2 - stageRect.left,
      cy: blobRect.top + blobRect.height * 0.575 - stageRect.top,
      r: Math.max(blobRect.width, blobRect.height) * 0.42
    };
    return { layer, hit };
  }

  function isOverBlob(x, y, hit) {
    const dx = x - hit.cx, dy = y - hit.cy;
    return Math.sqrt(dx * dx + dy * dy) <= hit.r;
  }

  // ---------------- brush mode ----------------
  function openBrushMode() {
    const { layer, hit } = createInteractionLayer();
    const cursor = document.createElement("div");
    cursor.className = "tool-cursor";
    cursor.textContent = "🧽";
    layer.appendChild(cursor);

    const banner = document.createElement("div");
    banner.className = "interaction-banner";
    banner.innerHTML = `<span>Drag over Blob to brush ✨</span><button class="btn btn-primary interaction-done-btn">Done</button>`;
    layer.appendChild(banner);

    const blob = document.querySelector("#petStage .pet-blob");
    let gained = 0;
    let lastX = null, lastY = null;
    let pointerDown = false;

    function onMove(e) {
      const rect = layer.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.opacity = "1";

      if (pointerDown && isOverBlob(x, y, hit)) {
        if (lastX !== null) {
          const dist = Math.hypot(x - lastX, y - lastY);
          const add = Math.min(dist / 40, 100 - (Backend.getPlayerData().pet.hygiene + gained));
          if (add > 0) {
            gained += add;
            setBar("hygiene", Math.min(100, Backend.getPlayerData().pet.hygiene + gained));
            if (blob) { blob.classList.remove("pet-enjoying"); void blob.offsetWidth; blob.classList.add("pet-enjoying"); }
          }
        }
        lastX = x; lastY = y;
      } else {
        lastX = null; lastY = null;
      }
    }
    function onDown(e) { pointerDown = true; onMove(e); }
    function onUp() { pointerDown = false; lastX = null; lastY = null; }

    layer.addEventListener("pointerdown", onDown);
    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerup", onUp);
    layer.addEventListener("pointercancel", onUp);

    banner.querySelector(".interaction-done-btn").addEventListener("click", async () => {
      layer.remove();
      if (gained > 0) await Backend.addHygiene(gained);
      draw();
    });
  }

  // ---------------- feed mode ----------------
  function openFeedMode(foodId, food) {
    const { layer, hit } = createInteractionLayer();
    const cursor = document.createElement("div");
    cursor.className = "tool-cursor";
    cursor.textContent = food.emoji;
    layer.appendChild(cursor);

    const banner = document.createElement("div");
    banner.className = "interaction-banner";
    banner.innerHTML = `<span>Drag onto Blob to feed 🍽️</span><button class="btn btn-ghost interaction-cancel-btn">Cancel</button>`;
    layer.appendChild(banner);

    const blob = document.querySelector("#petStage .pet-blob");
    let lastX = 0, lastY = 0;
    let finished = false;

    function onMove(e) {
      const rect = layer.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      cursor.style.left = `${lastX}px`;
      cursor.style.top = `${lastY}px`;
      cursor.style.opacity = "1";
      if (blob) blob.classList.toggle("pet-anticipating", isOverBlob(lastX, lastY, hit));
    }

    async function onUp() {
      if (finished) return;
      if (isOverBlob(lastX, lastY, hit)) {
        finished = true;
        if (blob) {
          blob.classList.remove("pet-anticipating");
          blob.classList.remove("pet-eating");
          void blob.offsetWidth;
          blob.classList.add("pet-eating");
        }
        cursor.classList.add("cursor-eaten");
        const res = await Backend.feedPet(foodId);
        setTimeout(() => {
          layer.remove();
          draw();
        }, 500);
        if (!res.success) { /* ran out mid-gesture; UI still refreshes harmlessly */ }
      }
    }

    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerdown", onMove);
    layer.addEventListener("pointerup", onUp);

    banner.querySelector(".interaction-cancel-btn").addEventListener("click", () => layer.remove());
  }
  function openFeedList() {
    const pet = Backend.getPlayerData().pet;
    const wrap = document.getElementById("feedList");
    wrap.innerHTML = "";
    Backend.FOOD_CATALOG.forEach(food => {
      const have = pet.inventory[food.id] || 0;
      const btn = document.createElement("button");
      btn.className = "feed-item" + (have <= 0 ? " disabled" : "");
      btn.disabled = have <= 0;
      btn.innerHTML = `<span class="feed-emoji">${food.emoji}</span><span class="feed-name">${food.name}</span><span class="feed-count">x${have}</span>`;
      btn.addEventListener("click", () => {
        document.getElementById("feedOverlay").style.display = "none";
        openFeedMode(food.id, food);
      });
      wrap.appendChild(btn);
    });
    document.getElementById("feedOverlay").style.display = "flex";
  }

  // ---------------- shop ----------------
  function openShop() {
    const pet = Backend.getPlayerData().pet;
    const foodWrap = document.getElementById("shopFood");
    const accWrap = document.getElementById("shopAccessories");
    foodWrap.innerHTML = "";
    accWrap.innerHTML = "";

    Backend.FOOD_CATALOG.forEach(food => {
      const have = pet.inventory[food.id] || 0;
      const row = document.createElement("div");
      row.className = "shop-row";
      row.innerHTML = `
        <span class="shop-emoji">${food.emoji}</span>
        <span class="shop-name">${food.name} <span class="shop-owned">(have ${have})</span></span>
        <button class="shop-buy-btn">${food.cost} ♥</button>
      `;
      row.querySelector(".shop-buy-btn").addEventListener("click", async () => {
        const res = await Backend.buyFood(food.id);
        if (res.success) { openShop(); draw(); }
      });
      foodWrap.appendChild(row);
    });

    Backend.ACCESSORY_CATALOG.forEach(item => {
      const owned = pet.owned.includes(item.id);
      const equipped = pet.equipped === item.id;
      const row = document.createElement("div");
      row.className = "shop-row";
      const btnLabel = owned ? (equipped ? "Unequip" : "Equip") : `${item.cost} ♥`;
      row.innerHTML = `
        <span class="shop-emoji">${item.emoji}</span>
        <span class="shop-name">${item.name}${equipped ? ' <span class="shop-owned">(worn)</span>' : ""}</span>
        <button class="shop-buy-btn ${owned ? "shop-equip-btn" : ""}">${btnLabel}</button>
      `;
      row.querySelector("button").addEventListener("click", async () => {
        if (owned) {
          await Backend.equipAccessory(item.id);
        } else {
          const res = await Backend.buyAccessory(item.id);
          if (!res.success) return;
        }
        openShop();
        draw();
      });
      accWrap.appendChild(row);
    });

    document.getElementById("shopOverlay").style.display = "flex";
  }

  // ---------------- mini-game: catch the hearts ----------------
  function openMiniGame() {
    gameScore = 0;
    document.getElementById("gameScoreLabel").textContent = "Score: 0";
    document.getElementById("gameResult").style.display = "none";
    document.getElementById("gameField").innerHTML = "";
    document.getElementById("gameOverlay").style.display = "flex";

    const endAt = Date.now() + GAME_DURATION_MS;
    updateGameTimer(endAt);

    gameSpawner = setInterval(spawnHeart, 550);
    gameTimer = setInterval(() => {
      const msLeft = endAt - Date.now();
      updateGameTimer(endAt);
      if (msLeft <= 0) endMiniGame();
    }, 100);
  }

  function updateGameTimer(endAt) {
    const secLeft = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    document.getElementById("gameTimeLabel").textContent = `${secLeft}s`;
  }

  function spawnHeart() {
    const field = document.getElementById("gameField");
    if (!field) return;
    const heart = document.createElement("div");
    heart.className = "falling-heart";
    heart.textContent = "♥";
    const fieldWidth = field.clientWidth || 300;
    heart.style.left = `${Math.random() * (fieldWidth - 30)}px`;
    heart.style.animationDuration = `${1800 + Math.random() * 900}ms`;
    heart.addEventListener("click", () => {
      gameScore++;
      document.getElementById("gameScoreLabel").textContent = `Score: ${gameScore}`;
      heart.remove();
    });
    heart.addEventListener("animationend", () => heart.remove());
    field.appendChild(heart);
  }

  async function endMiniGame() {
    clearInterval(gameSpawner);
    clearInterval(gameTimer);
    gameSpawner = null;
    gameTimer = null;

    const happinessGain = Math.min(30, gameScore * 3);
    const heartsBonus = Math.floor(gameScore / 3);
    await Backend.applyPlayResult(happinessGain, heartsBonus);

    document.getElementById("gameField").innerHTML = "";
    document.getElementById("gameResult").style.display = "block";
    document.getElementById("gameResultText").textContent =
      `Caught ${gameScore}! +${happinessGain} happiness, +${heartsBonus} ♥`;
    draw();
  }

  function closeMiniGame() {
    clearInterval(gameSpawner);
    clearInterval(gameTimer);
    document.getElementById("gameOverlay").style.display = "none";
  }

  // ---------------- wire up static buttons once ----------------
  function bindOnce() {
    document.getElementById("petFeedBtn").addEventListener("click", openFeedList);
    document.getElementById("petCleanBtn").addEventListener("click", openBrushMode);
    document.getElementById("petPlayBtn").addEventListener("click", openMiniGame);
    document.getElementById("petShopBtn").addEventListener("click", openShop);

    document.getElementById("feedCloseBtn").addEventListener("click", () => {
      document.getElementById("feedOverlay").style.display = "none";
    });
    document.getElementById("shopCloseBtn").addEventListener("click", () => {
      document.getElementById("shopOverlay").style.display = "none";
    });
    document.getElementById("gameCloseBtn").addEventListener("click", closeMiniGame);

    document.getElementById("petNameEditBtn").addEventListener("click", openCustomize);
    document.getElementById("customizeSaveBtn").addEventListener("click", saveCustomize);
    document.getElementById("customizeCancelBtn").addEventListener("click", () => {
      document.getElementById("customizeOverlay").style.display = "none";
    });
  }

  document.addEventListener("DOMContentLoaded", bindOnce);
  // in case this script runs after DOMContentLoaded already fired
  if (document.readyState !== "loading") bindOnce();

  return { renderPet };
})();
