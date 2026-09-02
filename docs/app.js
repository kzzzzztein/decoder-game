/* DECODE — Game Engine v3
   Letter-box answers, live per-keystroke validation, cipher cross-reveal,
   and account progression (hearts + daily reward) via backend.js. */

let state = {
  category: null,
  puzzleIndex: 0,
  slotsByLetter: {},     // "Y" -> [slot, slot, ...] across the whole puzzle
  totalLetters: 0,       // total distinct letter positions to solve
  solvedLetters: 0,
  mistakes: 0,
  solvedThisRound: false
};

// ---------------- Progress / hearts (via Backend) ----------------
function isSolved(category, puzzleId) {
  return Backend.isPuzzleSolved(category, puzzleId);
}
function totalSolvedCount() {
  return Backend.totalSolvedCount();
}
function totalPuzzleCount() {
  return Object.values(PUZZLE_DATA).reduce((s, a) => s + a.length, 0);
}
function updateScorePill() {
  document.getElementById("scorePill").textContent =
    `★ ${totalSolvedCount()} / ${totalPuzzleCount()}`;
}
function updateHeartsPill() {
  const hearts = Backend.getPlayerData().hearts || 0;
  document.getElementById("heartsPill").textContent = `♥ ${hearts}`;
}
Backend.onPlayerDataChange(() => {
  updateHeartsPill();
  updateScorePill();
  const homeActive = document.getElementById("screen-home").classList.contains("active");
  if (homeActive) renderHome();
});

// ---------------- Daily reward ----------------
function renderDailyCard() {
  const btn = document.getElementById("dailyBtn");
  const sub = document.getElementById("dailySub");
  const player = Backend.getPlayerData();

  if (Backend.canClaimDaily()) {
    btn.disabled = false;
    btn.textContent = "Claim";
    sub.textContent = player.streak > 0
      ? `${player.streak} day streak — come back for more.`
      : "Come back every day for free hearts.";
  } else {
    btn.disabled = true;
    btn.textContent = "Claimed";
    sub.textContent = `Claimed today · ${player.streak} day streak. Come back tomorrow!`;
  }
}

document.getElementById("dailyBtn").addEventListener("click", async () => {
  const btn = document.getElementById("dailyBtn");
  btn.disabled = true;
  const result = await Backend.claimDailyReward();
  if (result) {
    document.getElementById("dailySub").textContent =
      `+${result.reward} ♥ claimed! ${result.streak} day streak.`;
    updateHeartsPill();
  }
  renderDailyCard();
});

// ---------------- Screen navigation ----------------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
document.querySelectorAll("[data-nav]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-nav");
    if (target === "home") renderHome();
    if (target === "picker") renderPicker(state.category);
  });
});

// ---------------- Home screen ----------------
function renderHome() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  Object.keys(PUZZLE_DATA).forEach(catKey => {
    const meta = CATEGORY_META[catKey];
    const puzzles = PUZZLE_DATA[catKey];
    const solvedCount = (Backend.getPlayerData().solved[catKey] || []).length;
    const pct = puzzles.length ? Math.round((solvedCount / puzzles.length) * 100) : 0;

    const tile = document.createElement("button");
    tile.className = "category-tile";
    tile.style.setProperty("--accent", meta.color);
    tile.innerHTML = `
      <div class="icon">${meta.icon}</div>
      <div class="info">
        <h3>${meta.label}</h3>
        <div class="meta">${solvedCount} / ${puzzles.length} cracked</div>
      </div>
      <div class="chev">›</div>
      <div class="progress-track" style="width:${pct}%"></div>
    `;
    tile.addEventListener("click", () => renderPicker(catKey));
    list.appendChild(tile);
  });
  updateScorePill();
  renderDailyCard();
  showScreen("screen-home");
}

// ---------------- Puzzle picker ----------------
function renderPicker(catKey) {
  state.category = catKey;
  const meta = CATEGORY_META[catKey];
  const puzzles = PUZZLE_DATA[catKey];

  document.getElementById("pickerTitle").textContent = `${meta.icon} ${meta.label}`;
  document.getElementById("pickerSub").textContent =
    puzzles.length ? "Pick a case to crack." : "No puzzles yet — add some to data.js!";

  const grid = document.getElementById("chipGrid");
  grid.innerHTML = "";
  puzzles.forEach((p, i) => {
    const chip = document.createElement("button");
    const solved = isSolved(catKey, p.id);
    chip.className = "chip" + (solved ? " solved" : "");
    chip.textContent = i + 1;
    chip.addEventListener("click", () => openPuzzle(catKey, i));
    grid.appendChild(chip);
  });
  updateScorePill();
  showScreen("screen-picker");
}

// ---------------- Tokenizing the quote ----------------
function buildTokens(puzzle) {
  const words = puzzle.quote.split(" ");
  const pool = puzzle.questions.map((q, i) => ({
    text: q.a.toUpperCase().replace(/[^A-Z']/g, ""),
    qIndex: i,
    used: false
  }));
  return words.map(word => {
    const clean = word.replace(/[^A-Za-z']/g, "").toUpperCase();
    const match = pool.find(p => !p.used && p.text === clean);
    if (match) { match.used = true; return { blank: true, word, qIndex: match.qIndex }; }
    return { blank: false, word };
  });
}

// ---------------- Slot registry helpers ----------------
function registerSlot(letter, slot) {
  if (!state.slotsByLetter[letter]) state.slotsByLetter[letter] = [];
  state.slotsByLetter[letter].push(slot);
  state.totalLetters++;
}

function revealLetter(letter) {
  const slots = state.slotsByLetter[letter];
  if (!slots) return;
  slots.forEach(slot => {
    if (slot.solved) return;
    slot.solved = true;
    state.solvedLetters++;
    if (slot.type === "quote") {
      slot.el.textContent = letter;
      slot.cellEl.classList.remove("filled", "wrong");
      slot.cellEl.classList.add("correct");
    } else {
      slot.el.value = letter;
      slot.el.classList.remove("wrong");
      slot.el.classList.add("correct");
      slot.el.disabled = true;
    }
  });
  checkForWin();
}

function checkForWin() {
  if (state.solvedThisRound) return;
  if (state.totalLetters > 0 && state.solvedLetters >= state.totalLetters) {
    const puzzle = PUZZLE_DATA[state.category][state.puzzleIndex];
    handleWin(puzzle);
  }
}

// ---------------- Building the quote panel ----------------
function renderQuotePanel(tokens, puzzle) {
  const quoteLine = document.getElementById("quoteLine");
  quoteLine.innerHTML = "";

  tokens.forEach(token => {
    if (!token.blank) {
      const span = document.createElement("span");
      span.className = "word plain";
      span.textContent = token.word;
      quoteLine.appendChild(span);
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "blank-word";
    let pos = 0;
    for (const ch of token.word) {
      if (/[a-zA-Z]/.test(ch)) {
        const upper = ch.toUpperCase();
        const cell = document.createElement("span");
        cell.className = "letter-cell";
        const slotSpan = document.createElement("span");
        slotSpan.className = "slot";
        slotSpan.textContent = "_";
        const num = document.createElement("span");
        num.className = "cipher-num";
        num.textContent = CIPHER_MAP[upper] || "";
        cell.appendChild(slotSpan);
        cell.appendChild(num);
        wrap.appendChild(cell);

        registerSlot(upper, { type: "quote", el: slotSpan, cellEl: cell, solved: false });
        pos++;
      } else {
        const punct = document.createElement("span");
        punct.className = "word";
        punct.style.opacity = "0.4";
        punct.textContent = ch;
        wrap.appendChild(punct);
      }
    }
    quoteLine.appendChild(wrap);
  });
}

// ---------------- Building question cards with letter boxes ----------------
function renderQuestions(puzzle) {
  const qList = document.getElementById("questionsList");
  qList.innerHTML = "";

  puzzle.questions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.id = `qcard-${i}`;

    const head = document.createElement("div");
    head.innerHTML = `<span class="qnum">CLUE ${i + 1} / ${puzzle.questions.length}</span><p class="qtext">${q.q}</p>`;
    card.appendChild(head);

    const row = document.createElement("div");
    row.className = "answer-row";

    const boxes = []; // ordered letter-box input elements for this word

    for (const ch of q.a) {
      if (/[a-zA-Z]/.test(ch)) {
        const upper = ch.toUpperCase();
        const boxWrap = document.createElement("span");
        boxWrap.className = "answer-box";

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.autocomplete = "off";
        input.autocapitalize = "characters";
        input.spellcheck = false;
        input.className = "answer-input";

        const num = document.createElement("span");
        num.className = "cipher-num";
        num.textContent = CIPHER_MAP[upper] || "";

        boxWrap.appendChild(input);
        boxWrap.appendChild(num);
        row.appendChild(boxWrap);

        const slot = { type: "answer", el: input, solved: false };
        registerSlot(upper, slot);
        boxes.push({ input, target: upper, slot });
      } else {
        const punct = document.createElement("span");
        punct.className = "answer-punct";
        punct.textContent = ch;
        row.appendChild(punct);
      }
    }

    card.appendChild(row);
    qList.appendChild(card);

    // wire up interactions for this word's boxes
    boxes.forEach((box, idx) => {
      box.input.addEventListener("focus", () => box.input.select());
      box.input.addEventListener("input", () => {
        const typed = box.input.value.toUpperCase().replace(/[^A-Z]/g, "");
        box.input.value = typed;
        if (!typed) return;

        if (typed === box.target) {
          revealLetter(box.target); // fills this + every matching box, sets card state
          maybeMarkCardAnswered(card, boxes);
        } else {
          box.input.classList.remove("correct");
          box.input.classList.add("wrong");
          state.mistakes++;
        }

        // advance focus to next editable box
        for (let j = idx + 1; j < boxes.length; j++) {
          if (!boxes[j].slot.solved) { boxes[j].input.focus(); break; }
        }
      });
      box.input.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !box.input.value) {
          for (let j = idx - 1; j >= 0; j--) {
            if (!boxes[j].slot.solved) { boxes[j].input.focus(); break; }
          }
        }
      });
    });
  });
}

function maybeMarkCardAnswered(card, boxes) {
  const allSolved = boxes.every(b => b.slot.solved);
  card.classList.toggle("answered", allSolved);
}

// ---------------- Opening a puzzle ----------------
function openPuzzle(catKey, index) {
  state.category = catKey;
  state.puzzleIndex = index;
  state.slotsByLetter = {};
  state.totalLetters = 0;
  state.solvedLetters = 0;
  state.mistakes = 0;
  state.solvedThisRound = false;

  const meta = CATEGORY_META[catKey];
  const puzzle = PUZZLE_DATA[catKey][index];
  document.getElementById("gameCatLabel").textContent = meta.label.toUpperCase();
  document.getElementById("sourceReveal").classList.remove("show");

  const tokens = buildTokens(puzzle);
  renderQuotePanel(tokens, puzzle);
  renderQuestions(puzzle);

  showScreen("screen-game");
}

document.getElementById("clearBtn").addEventListener("click", () => {
  openPuzzle(state.category, state.puzzleIndex);
});

// ---------------- Win handling ----------------
async function handleWin(puzzle) {
  if (state.solvedThisRound) return;
  state.solvedThisRound = true;

  const stars = state.mistakes === 0 ? 3 : state.mistakes <= 3 ? 2 : 1;
  const reward = await Backend.recordSolve(state.category, puzzle.id, stars);

  document.getElementById("sourceText").textContent = puzzle.source;
  document.getElementById("sourceReveal").classList.add("show");
  updateScorePill();
  updateHeartsPill();

  document.getElementById("winStars").textContent = "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars);
  document.getElementById("winQuote").textContent = puzzle.quote;
  document.getElementById("winSource").textContent = "— " + puzzle.source;
  document.getElementById("heartsEarned").textContent =
    reward > 0 ? `+${reward} ♥ earned` : "Already solved — no bonus hearts";

  setTimeout(() => {
    document.getElementById("winOverlay").style.display = "flex";
  }, 350);
}

document.getElementById("winPickerBtn").addEventListener("click", () => {
  document.getElementById("winOverlay").style.display = "none";
  renderPicker(state.category);
});
document.getElementById("winNextBtn").addEventListener("click", () => {
  document.getElementById("winOverlay").style.display = "none";
  const puzzles = PUZZLE_DATA[state.category];
  const nextIndex = (state.puzzleIndex + 1) % puzzles.length;
  openPuzzle(state.category, nextIndex);
});

// ---------------- Developer note / boot ----------------
const backendReady = Backend.initBackend();

document.getElementById("startGameBtn").addEventListener("click", async () => {
  document.getElementById("devNoteModal").style.display = "none";
  await backendReady;
  renderHome();
});

renderHome(); // snappy first paint behind the modal; refreshes once Backend resolves
