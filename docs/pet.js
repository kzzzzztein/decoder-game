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

  function draw(reactionOverride) {
    const pet = Backend.getPlayerData().pet;
    const mood = Backend.getPetMood();
    document.getElementById("petStage").innerHTML = buildBlobSVG(mood, pet.equipped, pet.color, pet.equippedSuit, reactionOverride);
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
  // Layer order matters: shadow → cape (suit back) → ears → gradient body →
  // suit body-overlay (emblem/jacket/pattern) → shine → blush → face →
  // accessory → suit front (mask/helmet/nightcap).
  // `reactionOverride` swaps the mood face for a special one (touch zone,
  // being brushed, or eye-tracking-while-feeding) without changing mood.
  function buildBlobSVG(mood, equippedId, bodyColor, suitId, reactionOverride) {
    const uid = "g" + Math.random().toString(36).slice(2, 8);
    const lightColor = shadeColor(bodyColor, 26);
    const bodyStroke = shadeColor(bodyColor, -30);
    const face = reactionOverride ? (REACTION_FACES[reactionOverride] || FACES[mood]) : (FACES[mood] || FACES.neutral);
    const accessory = ACCESSORY_SVG[equippedId] || "";
    const suit = SUIT_SVG[suitId] || { back: "", bodyOverlay: "", front: "" };
    const cheekBoost = reactionOverride === "cheek";
    const blushR = cheekBoost ? [16, 11] : [12, 8];
    const blushOpacity = cheekBoost ? 1 : 0.65;

    return `
      <svg viewBox="0 0 200 200" class="pet-blob pet-mood-${mood}">
        <defs>
          <radialGradient id="bodyGrad-${uid}" cx="36%" cy="28%" r="78%">
            <stop offset="0%" stop-color="${lightColor}"/>
            <stop offset="100%" stop-color="${bodyColor}"/>
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="180" rx="54" ry="9" fill="rgba(67,41,58,0.14)"/>
        ${suit.back}
        <ellipse class="pet-ear pet-ear-left" cx="68" cy="53" rx="15" ry="18" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="3"/>
        <ellipse class="pet-ear pet-ear-right" cx="132" cy="53" rx="15" ry="18" fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="3"/>
        <ellipse cx="100" cy="115" rx="72" ry="66" fill="url(#bodyGrad-${uid})" stroke="${bodyStroke}" stroke-width="3"/>
        ${suit.bodyOverlay}
        <ellipse cx="70" cy="76" rx="24" ry="15" fill="#FFFFFF" opacity="0.32"/>
        <ellipse cx="72" cy="120" rx="${blushR[0]}" ry="${blushR[1]}" fill="#FFB6D2" opacity="${blushOpacity}"/>
        <ellipse cx="128" cy="120" rx="${blushR[0]}" ry="${blushR[1]}" fill="#FFB6D2" opacity="${blushOpacity}"/>
        ${face}
        ${accessory}
        ${suit.front}
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

  // Temporary faces shown during a specific interaction (touch zone,
  // brushing, or feeding), swapped back to the real mood face afterward.
  const REACTION_FACES = {
    // head/ears touched — content, eyes closed upward (like a head pat)
    head: `
      <path d="M 71 100 Q 78 92 85 100" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 115 100 Q 122 92 129 100" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 82 128 Q 100 140 118 128" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
    `,
    // cheek touched — happy squint, big warm smile (blush is boosted separately)
    cheek: `
      <path d="M 71 100 Q 78 94 85 100" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 115 100 Q 122 94 129 100" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 78 126 Q 100 144 122 126" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
    `,
    // belly touched — ticklish, eyes squeezed shut laughing, open-mouth grin
    belly: `
      <path d="M 72 96 L 84 108 M 84 96 L 72 108" stroke="#43293A" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 116 96 L 128 108 M 128 96 L 116 108" stroke="#43293A" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="100" cy="134" rx="13" ry="9" fill="#43293A"/>
    `,
    // tail/bottom touched — surprised, wide eyes, small "o" mouth
    tail: `
      <circle cx="78" cy="102" r="9" fill="#43293A"/>
      <circle cx="122" cy="102" r="9" fill="#43293A"/>
      <circle cx="80" cy="99" r="2.5" fill="#fff"/>
      <circle cx="124" cy="99" r="2.5" fill="#fff"/>
      <ellipse cx="100" cy="132" rx="6" ry="8" fill="#43293A"/>
    `,
    // actively being brushed — relaxed, eyes closed downward, tiny smile
    brushed: `
      <path d="M 70 100 Q 78 108 86 100" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 114 100 Q 122 108 130 100" stroke="#43293A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 85 128 Q 100 135 115 128" stroke="#43293A" stroke-width="3" fill="none" stroke-linecap="round"/>
    `,
    // feeding gesture in progress — googly eyes that track the food, plus
    // a mouth and drool droplet that JS updates/animates directly by id.
    tracking: `
      <circle cx="78" cy="102" r="9" fill="#FFFFFF" stroke="#43293A" stroke-width="1.5"/>
      <circle cx="122" cy="102" r="9" fill="#FFFFFF" stroke="#43293A" stroke-width="1.5"/>
      <circle id="petPupilLeft" cx="78" cy="102" r="4.5" fill="#43293A"/>
      <circle id="petPupilRight" cx="122" cy="102" r="4.5" fill="#43293A"/>
      <ellipse id="petMouth" cx="100" cy="128" rx="7" ry="5" fill="#43293A"/>
      <path id="petDrool" class="pet-drool" d="M 96 133 Q 96 146 100 149 Q 104 146 104 133 Z" fill="#BFE8F5"/>
    `
  };

  const ACCESSORY_SVG = {
    bowtie: `<path d="M 88 148 L 100 140 L 88 132 Z M 112 148 L 100 140 L 112 132 Z" fill="#E8578D" stroke="#C23570" stroke-width="2"/><circle cx="100" cy="140" r="4" fill="#C23570"/>`,
    partyhat: `<path d="M 100 30 L 82 68 L 118 68 Z" fill="#F2A93B" stroke="#D9891B" stroke-width="2"/><circle cx="100" cy="30" r="5" fill="#E8455C"/>`,
    sunglasses: `<rect x="65" y="94" width="26" height="14" rx="6" fill="#43293A"/><rect x="109" y="94" width="26" height="14" rx="6" fill="#43293A"/><rect x="91" y="98" width="18" height="4" fill="#43293A"/>`,
    scarf: `<path d="M 60 140 Q 100 158 140 140 L 140 152 Q 100 168 60 152 Z" fill="#2FB8AE" stroke="#22897F" stroke-width="2"/>`,
    crown: `<path d="M 76 58 L 84 36 L 100 52 L 116 36 L 124 58 Z" fill="#FFD34D" stroke="#D9891B" stroke-width="2"/><circle cx="100" cy="48" r="3.5" fill="#E8455C"/><circle cx="84" cy="52" r="2.5" fill="#2FB8AE"/><circle cx="116" cy="52" r="2.5" fill="#2FB8AE"/>`,
    headphones: `<path d="M 38 88 Q 100 26 162 88" fill="none" stroke="#43293A" stroke-width="6" stroke-linecap="round"/><circle cx="38" cy="94" r="14" fill="#43293A"/><circle cx="162" cy="94" r="14" fill="#43293A"/><circle cx="38" cy="94" r="6.5" fill="#8A6A7B"/><circle cx="162" cy="94" r="6.5" fill="#8A6A7B"/>`,
    flower: `<g transform="translate(148,78)"><circle cx="0" cy="-7" r="6" fill="#FF8FB3"/><circle cx="7" cy="0" r="6" fill="#FF8FB3"/><circle cx="0" cy="7" r="6" fill="#FF8FB3"/><circle cx="-7" cy="0" r="6" fill="#FF8FB3"/><circle cx="0" cy="0" r="4.5" fill="#FFD34D"/></g>`,
    backpack: `<rect x="140" y="118" width="26" height="32" rx="8" fill="#2FB8AE" stroke="#22897F" stroke-width="2"/><rect x="147" y="110" width="12" height="13" rx="4" fill="#2FB8AE" stroke="#22897F" stroke-width="2"/>`
  };

  // Suits are full-body outfits: `back` renders behind the body (capes),
  // `bodyOverlay` renders just after the body fill (emblems, jackets,
  // patterns), and `front` renders after the face (masks, helmets, caps).
  const SUIT_SVG = {
    hero: {
      back: `<path d="M 58 108 Q 18 158 42 196 Q 68 176 76 138 Z M 142 108 Q 182 158 158 196 Q 132 176 124 138 Z" fill="#E8455C" opacity="0.88"/>`,
      bodyOverlay: `<path d="M 100 88 L 107 106 L 126 108 L 111 120 L 116 139 L 100 128 L 84 139 L 89 120 L 74 108 L 93 106 Z" fill="#FFD34D" stroke="#D9891B" stroke-width="1.5"/>`,
      front: ``
    },
    ninja: {
      back: ``,
      bodyOverlay: `<path d="M 40 100 Q 100 82 160 100 L 160 118 Q 100 100 40 118 Z" fill="#2B2B36"/>`,
      front: `<rect x="60" y="93" width="80" height="18" rx="7" fill="#2B2B36"/><ellipse cx="80" cy="102" rx="6" ry="4" fill="#DCE4FF" opacity="0.85"/><ellipse cx="120" cy="102" rx="6" ry="4" fill="#DCE4FF" opacity="0.85"/>`
    },
    astronaut: {
      back: ``,
      bodyOverlay: `<rect x="40" y="150" width="120" height="26" rx="10" fill="#DADFE6" stroke="#AEB6C0" stroke-width="2"/>`,
      front: `<circle cx="100" cy="90" r="58" fill="#DCEFFF" opacity="0.28" stroke="#FFFFFF" stroke-width="3"/><path d="M 55 60 Q 100 30 145 60" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.6"/><rect x="94" y="18" width="12" height="16" rx="3" fill="#DADFE6" stroke="#AEB6C0" stroke-width="1.5"/>`
    },
    pajama: {
      back: ``,
      bodyOverlay: `<circle cx="82" cy="150" r="4" fill="#FFFFFF" opacity="0.7"/><circle cx="118" cy="158" r="3" fill="#FFFFFF" opacity="0.7"/><path d="M 130 148 a4 4 0 1 0 0.1 0 Z" fill="#FFF3B0" opacity="0.8"/><circle cx="70" cy="165" r="2.5" fill="#FFFFFF" opacity="0.7"/>`,
      front: `<path d="M 92 34 Q 100 14 118 26 Q 108 32 108 46 Q 98 40 92 34 Z" fill="#E4D4FF" stroke="#C3A8E8" stroke-width="2"/><circle cx="118" cy="26" r="4" fill="#FFFFFF"/>`
    },
    tuxedo: {
      back: ``,
      bodyOverlay: `<path d="M 44 130 Q 100 118 156 130 L 156 176 Q 100 190 44 176 Z" fill="#2B2B36"/><path d="M 88 130 L 100 150 L 112 130 Z" fill="#FFFFFF"/><path d="M 92 140 L 100 148 L 108 140 L 100 133 Z" fill="#2B2B36"/>`,
      front: ``
    }
  };

  // ---------------- touch reaction ----------------
  function bindTouchReaction() {
    const blob = document.querySelector("#petStage .pet-blob");
    if (!blob) return;
    blob.addEventListener("pointerdown", handleBlobTouch);
  }

  // Maps a click into the blob's own 200x200 viewBox space, regardless of
  // how large the SVG is actually rendered on screen.
  function getBlobLocalPoint(evt, blobEl) {
    const rect = blobEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 100, y: 115 };
    const scaleX = 200 / rect.width;
    const scaleY = 200 / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  function dist(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }

  // Which part of the pet did this point land on?
  function classifyTouchZone(x, y) {
    if (dist(x, y, 68, 53) < 24 || dist(x, y, 132, 53) < 24) return "ears";
    if (y < 90) return "head";
    if (y >= 90 && y < 142 && (x < 78 || x > 122)) return "cheek";
    if (y >= 150) return "tail";
    return "belly";
  }

  const TOUCH_REACTION_FACE = { ears: "head", head: "head", cheek: "cheek", belly: "belly", tail: "tail" };
  const TOUCH_REACTION_ANIM = {
    ears: "pet-earwiggle", head: "pet-headpat-anim", cheek: "pet-nuzzle",
    belly: "pet-tickle-anim", tail: "pet-surprise-anim"
  };

  let touchReactionTimer = null;

  function handleBlobTouch(e) {
    const blobEl = e.currentTarget;
    const pt = getBlobLocalPoint(e, blobEl);
    const zone = classifyTouchZone(pt.x, pt.y);

    const stage = document.getElementById("petStage");
    const stageRect = stage.getBoundingClientRect();
    const clickX = e.clientX - stageRect.left;
    const clickY = e.clientY - stageRect.top;

    // rebuild with the zone's reaction face — this also rebinds the tap
    // listener onto the freshly-created <svg>, since draw() calls
    // bindTouchReaction() itself
    draw(TOUCH_REACTION_FACE[zone]);

    const freshBlob = document.querySelector("#petStage .pet-blob");
    if (freshBlob) {
      freshBlob.classList.add(TOUCH_REACTION_ANIM[zone] || "pet-squish");
      if (zone === "ears") {
        const side = pt.x < 100 ? "left" : "right";
        const ear = freshBlob.querySelector(`.pet-ear-${side}`);
        if (ear) ear.classList.add("pet-ear-flick");
      }
    }

    spawnSparkles(stage, clickX, clickY, zone);

    clearTimeout(touchReactionTimer);
    touchReactionTimer = setTimeout(() => draw(), 850);
  }

  function spawnSparkles(container, x, y, zone) {
    const excited = zone === "belly" || zone === "tail";
    const symbols = excited ? ["✦", "!", "✨"] : ["✦", "♥", "✨"];
    const count = excited ? 5 : 4;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "pet-sparkle";
      s.textContent = symbols[i % symbols.length];
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const spread = excited ? 42 : 30;
      const dist = spread + Math.random() * 20;
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

    let gained = 0;
    let lastX = null, lastY = null;
    let pointerDown = false;
    let isBrushingNow = false;

    // Swaps to/from the relaxed "being brushed" face only on state changes
    // (not every pointermove tick) — cheap, and rebinds the tap listener
    // onto the fresh <svg> each time since draw() calls bindTouchReaction().
    function setBrushingState(active) {
      if (active === isBrushingNow) return;
      isBrushingNow = active;
      draw(active ? "brushed" : undefined);
      const freshBlob = document.querySelector("#petStage .pet-blob");
      if (freshBlob) freshBlob.classList.toggle("pet-being-brushed", active);
    }

    function onMove(e) {
      const rect = layer.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.opacity = "1";

      const overBlobNow = pointerDown && isOverBlob(x, y, hit);
      setBrushingState(overBlobNow);

      if (overBlobNow) {
        if (lastX !== null) {
          const dist = Math.hypot(x - lastX, y - lastY);
          const add = Math.min(dist / 40, 100 - (Backend.getPlayerData().pet.hygiene + gained));
          if (add > 0) {
            gained += add;
            setBar("hygiene", Math.min(100, Backend.getPlayerData().pet.hygiene + gained));
          }
        }
        lastX = x; lastY = y;
      } else {
        lastX = null; lastY = null;
      }
    }
    function onDown(e) { pointerDown = true; onMove(e); }
    function onUp() { pointerDown = false; lastX = null; lastY = null; setBrushingState(false); }

    layer.addEventListener("pointerdown", onDown);
    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerup", onUp);
    layer.addEventListener("pointercancel", onUp);

    banner.querySelector(".interaction-done-btn").addEventListener("click", async () => {
      setBrushingState(false);
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

    // switch to the eye-tracking face for the whole gesture, so the pupils
    // and drool can be updated directly by id as the food moves
    draw("tracking");
    const blob = document.querySelector("#petStage .pet-blob");
    let lastX = 0, lastY = 0;
    let finished = false;

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    function updateEyeTracking(layerX, layerY) {
      if (!blob) return;
      const blobRect = blob.getBoundingClientRect();
      if (!blobRect.width) return;
      const layerRect = layer.getBoundingClientRect();
      const absX = layerRect.left + layerX;
      const absY = layerRect.top + layerY;
      const localX = ((absX - blobRect.left) / blobRect.width) * 200;
      const localY = ((absY - blobRect.top) / blobRect.height) * 200;

      [{ id: "petPupilLeft", baseX: 78 }, { id: "petPupilRight", baseX: 122 }].forEach(eye => {
        const pupil = document.getElementById(eye.id);
        if (!pupil) return;
        pupil.setAttribute("cx", eye.baseX + clamp(localX - eye.baseX, -4, 4));
        pupil.setAttribute("cy", 102 + clamp(localY - 102, -3, 3));
      });
    }

    function onMove(e) {
      const rect = layer.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      cursor.style.left = `${lastX}px`;
      cursor.style.top = `${lastY}px`;
      cursor.style.opacity = "1";

      updateEyeTracking(lastX, lastY);

      const overBlob = isOverBlob(lastX, lastY, hit);
      if (blob) blob.classList.toggle("pet-anticipating", overBlob);
      const drool = document.getElementById("petDrool");
      if (drool) drool.classList.toggle("drool-visible", overBlob);
    }

    async function onUp() {
      if (finished) return;
      if (isOverBlob(lastX, lastY, hit)) {
        finished = true;
        const drool = document.getElementById("petDrool");
        if (blob) {
          blob.classList.remove("pet-anticipating");
          blob.classList.remove("pet-eating");
          void blob.offsetWidth;
          blob.classList.add("pet-eating");
        }
        if (drool) drool.classList.remove("drool-visible");
        const mouth = document.getElementById("petMouth");
        if (mouth) {
          mouth.classList.remove("pet-mouth-chomp");
          void mouth.offsetWidth;
          mouth.classList.add("pet-mouth-chomp");
        }
        cursor.classList.add("cursor-eaten");
        const res = await Backend.feedPet(foodId);
        setTimeout(() => {
          layer.remove();
          draw();
        }, 650);
        if (!res.success) { /* ran out mid-gesture; UI still refreshes harmlessly */ }
      }
    }

    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerdown", onMove);
    layer.addEventListener("pointerup", onUp);

    banner.querySelector(".interaction-cancel-btn").addEventListener("click", () => {
      layer.remove();
      draw(); // revert the tracking face back to the real mood
    });
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
    const suitWrap = document.getElementById("shopSuits");
    foodWrap.innerHTML = "";
    accWrap.innerHTML = "";
    suitWrap.innerHTML = "";

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

    buildEquippableRows(accWrap, Backend.ACCESSORY_CATALOG, pet.owned, pet.equipped,
      Backend.buyAccessory, Backend.equipAccessory);
    buildEquippableRows(suitWrap, Backend.SUIT_CATALOG, pet.ownedSuits, pet.equippedSuit,
      Backend.buySuit, Backend.equipSuit);

    document.getElementById("shopOverlay").style.display = "flex";
  }

  // Shared row-builder for anything that's bought once then toggled
  // equipped/unequipped (accessories and suits both work this way).
  function buildEquippableRows(wrap, catalog, ownedList, equippedId, buyFn, equipFn) {
    catalog.forEach(item => {
      const owned = ownedList.includes(item.id);
      const equipped = equippedId === item.id;
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
          await equipFn(item.id);
        } else {
          const res = await buyFn(item.id);
          if (!res.success) return;
        }
        openShop();
        draw();
      });
      wrap.appendChild(row);
    });
  }

  // ---------------- mini-game: catch the hearts ----------------
  function openMiniGame() {
    gameScore = 0;
    document.getElementById("gameTitleLabel").textContent = "Catch the Hearts!";
    document.getElementById("gameScoreLabel").textContent = "Score: 0";
    document.getElementById("gameTimeLabel").textContent = `${GAME_DURATION_MS / 1000}s`;
    document.getElementById("gameResult").style.display = "none";
    const field = document.getElementById("gameField");
    field.innerHTML = "";
    field.classList.remove("bubble-field", "memory-field");
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
    gameSpawner = null;
    gameTimer = null;
    memoryState = null;
    document.getElementById("gameField").classList.remove("bubble-field", "memory-field");
    document.getElementById("gameOverlay").style.display = "none";
  }

  // ---------------- mini-game: bubble pop ----------------
  function openBubbleGame() {
    gameScore = 0;
    document.getElementById("gameTitleLabel").textContent = "Bubble Pop!";
    document.getElementById("gameScoreLabel").textContent = "Score: 0";
    document.getElementById("gameTimeLabel").textContent = `${GAME_DURATION_MS / 1000}s`;
    document.getElementById("gameResult").style.display = "none";
    const field = document.getElementById("gameField");
    field.innerHTML = "";
    field.classList.remove("memory-field");
    field.classList.add("bubble-field");
    document.getElementById("gameOverlay").style.display = "flex";

    const endAt = Date.now() + GAME_DURATION_MS;
    updateGameTimer(endAt);
    gameSpawner = setInterval(spawnBubble, 480);
    gameTimer = setInterval(() => {
      const msLeft = endAt - Date.now();
      updateGameTimer(endAt);
      if (msLeft <= 0) endBubbleGame();
    }, 100);
  }

  function spawnBubble() {
    const field = document.getElementById("gameField");
    if (!field) return;
    const bubble = document.createElement("div");
    bubble.className = "rising-bubble";
    const fieldWidth = field.clientWidth || 300;
    const size = 22 + Math.random() * 18;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * (fieldWidth - size)}px`;
    bubble.style.animationDuration = `${2000 + Math.random() * 1100}ms`;
    bubble.addEventListener("click", () => {
      gameScore++;
      document.getElementById("gameScoreLabel").textContent = `Score: ${gameScore}`;
      bubble.classList.add("bubble-popped");
      setTimeout(() => bubble.remove(), 160);
    });
    bubble.addEventListener("animationend", () => bubble.remove());
    field.appendChild(bubble);
  }

  async function endBubbleGame() {
    clearInterval(gameSpawner);
    clearInterval(gameTimer);
    gameSpawner = null;
    gameTimer = null;

    const happinessGain = Math.min(30, gameScore * 3);
    const heartsBonus = Math.floor(gameScore / 3);
    await Backend.applyPlayResult(happinessGain, heartsBonus);

    const field = document.getElementById("gameField");
    field.innerHTML = "";
    field.classList.remove("bubble-field");
    document.getElementById("gameResult").style.display = "block";
    document.getElementById("gameResultText").textContent =
      `Popped ${gameScore}! +${happinessGain} happiness, +${heartsBonus} ♥`;
    draw();
  }

  // ---------------- mini-game: memory match ----------------
  let memoryState = null;
  const MEMORY_EMOJIS = ["🍎", "🍌", "🍇", "🍒", "🍉", "🥝"];

  function openMemoryGame() {
    const deck = shuffle([...MEMORY_EMOJIS, ...MEMORY_EMOJIS]);
    memoryState = { deck, flipped: [], matched: [], moves: 0, lock: false };

    document.getElementById("gameTitleLabel").textContent = "Memory Match!";
    document.getElementById("gameScoreLabel").textContent = "Moves: 0";
    document.getElementById("gameTimeLabel").textContent = "";
    document.getElementById("gameResult").style.display = "none";

    const field = document.getElementById("gameField");
    field.innerHTML = "";
    field.classList.remove("bubble-field");
    field.classList.add("memory-field");

    deck.forEach((emoji, idx) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = idx;
      card.innerHTML = `<div class="memory-card-inner"><div class="memory-card-back">?</div><div class="memory-card-front">${emoji}</div></div>`;
      card.addEventListener("click", () => flipMemoryCard(idx));
      field.appendChild(card);
    });

    document.getElementById("gameOverlay").style.display = "flex";
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function flipMemoryCard(idx) {
    if (!memoryState || memoryState.lock) return;
    if (memoryState.flipped.includes(idx) || memoryState.matched.includes(idx)) return;

    const field = document.getElementById("gameField");
    const cardEl = field.querySelector(`[data-index="${idx}"]`);
    cardEl.classList.add("flipped");
    memoryState.flipped.push(idx);

    if (memoryState.flipped.length === 2) {
      memoryState.moves++;
      document.getElementById("gameScoreLabel").textContent = `Moves: ${memoryState.moves}`;
      const [i1, i2] = memoryState.flipped;

      if (memoryState.deck[i1] === memoryState.deck[i2]) {
        memoryState.matched.push(i1, i2);
        memoryState.flipped = [];
        if (memoryState.matched.length === memoryState.deck.length) {
          setTimeout(endMemoryGame, 500);
        }
      } else {
        memoryState.lock = true;
        setTimeout(() => {
          [i1, i2].forEach(i => {
            const el = field.querySelector(`[data-index="${i}"]`);
            if (el) el.classList.remove("flipped");
          });
          memoryState.flipped = [];
          memoryState.lock = false;
        }, 700);
      }
    }
  }

  async function endMemoryGame() {
    const moves = memoryState.moves;
    const happinessGain = Math.max(10, Math.min(30, 30 - (moves - 6) * 2));
    const heartsBonus = moves <= 8 ? 5 : moves <= 12 ? 3 : 1;
    await Backend.applyPlayResult(happinessGain, heartsBonus);

    const field = document.getElementById("gameField");
    field.classList.remove("memory-field");
    field.innerHTML = "";
    document.getElementById("gameResult").style.display = "block";
    document.getElementById("gameResultText").textContent =
      `Matched in ${moves} moves! +${happinessGain} happiness, +${heartsBonus} ♥`;
    memoryState = null;
    draw();
  }

  // ---------------- mini-game picker ----------------
  function openGamePicker() {
    document.getElementById("gamePickerOverlay").style.display = "flex";
  }

  // ---------------- wire up static buttons once ----------------
  function bindOnce() {
    document.getElementById("petFeedBtn").addEventListener("click", openFeedList);
    document.getElementById("petCleanBtn").addEventListener("click", openBrushMode);
    document.getElementById("petPlayBtn").addEventListener("click", openGamePicker);
    document.getElementById("petShopBtn").addEventListener("click", openShop);

    document.getElementById("feedCloseBtn").addEventListener("click", () => {
      document.getElementById("feedOverlay").style.display = "none";
    });
    document.getElementById("shopCloseBtn").addEventListener("click", () => {
      document.getElementById("shopOverlay").style.display = "none";
    });
    document.getElementById("gameCloseBtn").addEventListener("click", closeMiniGame);

    document.getElementById("pickHeartsBtn").addEventListener("click", () => {
      document.getElementById("gamePickerOverlay").style.display = "none";
      openMiniGame();
    });
    document.getElementById("pickBubblesBtn").addEventListener("click", () => {
      document.getElementById("gamePickerOverlay").style.display = "none";
      openBubbleGame();
    });
    document.getElementById("pickMemoryBtn").addEventListener("click", () => {
      document.getElementById("gamePickerOverlay").style.display = "none";
      openMemoryGame();
    });
    document.getElementById("gamePickerCloseBtn").addEventListener("click", () => {
      document.getElementById("gamePickerOverlay").style.display = "none";
    });

    document.getElementById("petNameEditBtn").addEventListener("click", openCustomize);
    document.getElementById("customizeSaveBtn").addEventListener("click", saveCustomize);
    document.getElementById("customizeCancelBtn").addEventListener("click", () => {
      document.getElementById("customizeOverlay").style.display = "none";
    });
  }

  // Returns the current pet's blob SVG markup, for reuse outside the pet
  // screen (e.g. the walking transition between puzzles).
  function getBlobMarkup() {
    const pet = Backend.getPlayerData().pet;
    const mood = Backend.getPetMood();
    return buildBlobSVG(mood, pet.equipped, pet.color);
  }

  document.addEventListener("DOMContentLoaded", bindOnce);
  // in case this script runs after DOMContentLoaded already fired
  if (document.readyState !== "loading") bindOnce();

  return { renderPet, getBlobMarkup };
})();
