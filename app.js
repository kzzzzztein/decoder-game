/* DECODE — Game Engine */

const STORAGE_KEY = "decode_progress_v1";

let state = {
  category: null,
  puzzleIndex: 0,
  blankRegistry: {},   // qIndex -> { letterEls: [HTMLElement], answer: "WORD" }
  checkCount: 0,
  solvedThisRound: false
};

// ---------------- Progress persistence ----------------
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function saveProgress(progress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch (e) { /* storage unavailable, fail silently */ }
}
function markSolved(category, puzzleId) {
  const progress = loadProgress();
  if (!progress[category]) progress[category] = [];
  if (!progress[category].includes(puzzleId)) progress[category].push(puzzleId);
  saveProgress(progress);
}
function isSolved(category, puzzleId) {
  const progress = loadProgress();
  return !!(progress[category] && progress[category].includes(puzzleId));
}
function totalSolvedCount() {
  const progress = loadProgress();
  return Object.values(progress).reduce((sum, arr) => sum + arr.length, 0);
}
function totalPuzzleCount() {
  return Object.values(PUZZLE_DATA).reduce((sum, arr) => sum + arr.length, 0);
}
function updateScorePill() {
  document.getElementById("scorePill").textContent =
    `★ ${totalSolvedCount()} / ${totalPuzzleCount()}`;
}

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
    const progress = loadProgress();
    const solvedCount = (progress[catKey] || []).length;
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

  if (!puzzles.length) {
    grid.innerHTML = `<div class="empty-note" style="grid-column:1/-1;">This category is empty. Add puzzle objects to PUZZLE_DATA.${catKey} in data.js to fill it up to 50.</div>`;
  } else {
    puzzles.forEach((p, i) => {
      const chip = document.createElement("button");
      const solved = isSolved(catKey, p.id);
      chip.className = "chip" + (solved ? " solved" : "");
      chip.textContent = i + 1;
      chip.addEventListener("click", () => openPuzzle(catKey, i));
      grid.appendChild(chip);
    });
  }
  updateScorePill();
  showScreen("screen-picker");
}

// ---------------- Game engine ----------------
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
    if (match) {
      match.used = true;
      return { blank: true, word, qIndex: match.qIndex };
    }
    return { blank: false, word };
  });
}

function openPuzzle(catKey, index) {
  state.category = catKey;
  state.puzzleIndex = index;
  state.checkCount = 0;
  state.solvedThisRound = false;
  state.blankRegistry = {};

  const meta = CATEGORY_META[catKey];
  const puzzle = PUZZLE_DATA[catKey][index];
  document.getElementById("gameCatLabel").textContent = meta.label.toUpperCase();
  document.getElementById("sourceReveal").classList.remove("show");

  const tokens = buildTokens(puzzle);
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
    const letterEls = [];
    for (const ch of token.word) {
      if (/[a-zA-Z]/.test(ch)) {
        const cell = document.createElement("span");
        cell.className = "letter-cell";
        const slot = document.createElement("span");
        slot.className = "slot";
        slot.textContent = "_";
        const num = document.createElement("span");
        num.className = "cipher-num";
        num.textContent = CIPHER_MAP[ch.toUpperCase()] || "";
        cell.appendChild(slot);
        cell.appendChild(num);
        wrap.appendChild(cell);
        letterEls.push(cell);
      } else {
        const punct = document.createElement("span");
        punct.className = "word";
        punct.style.opacity = "0.4";
        punct.textContent = ch;
        wrap.appendChild(punct);
      }
    }
    quoteLine.appendChild(wrap);
    state.blankRegistry[token.qIndex] = {
      letterEls,
      answer: puzzle.questions[token.qIndex].a
    };
  });

  const qList = document.getElementById("questionsList");
  qList.innerHTML = "";
  puzzle.questions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.id = `qcard-${i}`;
    card.innerHTML = `
      <span class="qnum">CLUE ${i + 1} / ${puzzle.questions.length}</span>
      <p class="qtext">${q.q}</p>
      <input type="text" id="qinput-${i}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Type your answer...">
    `;
    qList.appendChild(card);

    const input = card.querySelector("input");
    input.addEventListener("input", () => liveFill(i, input.value));
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("checkBtn").click();
    });
  });

  showScreen("screen-game");
}

function liveFill(qIndex, rawValue) {
  const reg = state.blankRegistry[qIndex];
  if (!reg) return;
  const typedLetters = rawValue.toUpperCase().replace(/[^A-Z]/g, "").split("");
  reg.letterEls.forEach((cell, i) => {
    const slot = cell.querySelector(".slot");
    const letter = typedLetters[i];
    if (letter) {
      const wasEmpty = slot.textContent === "_";
      slot.textContent = letter;
      cell.classList.remove("correct");
      cell.classList.add("filled");
      if (wasEmpty) {
        cell.classList.remove("filled");
        void cell.offsetWidth; // restart animation
        cell.classList.add("filled");
      }
    } else {
      slot.textContent = "_";
      cell.classList.remove("filled", "correct");
    }
  });
}

function normalizeAnswer(str) {
  return str.toUpperCase().replace(/[^A-Z]/g, "");
}

document.getElementById("checkBtn").addEventListener("click", () => {
  const puzzle = PUZZLE_DATA[state.category][state.puzzleIndex];
  state.checkCount++;
  let allCorrect = true;

  puzzle.questions.forEach((q, i) => {
    const input = document.getElementById(`qinput-${i}`);
    const card = document.getElementById(`qcard-${i}`);
    const correct = normalizeAnswer(input.value) === normalizeAnswer(q.a);
    card.classList.toggle("answered", correct);
    if (correct) {
      const reg = state.blankRegistry[i];
      if (reg) reg.letterEls.forEach(cell => cell.classList.add("correct"));
    } else {
      allCorrect = false;
    }
  });

  if (allCorrect) {
    handleWin(puzzle);
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  const puzzle = PUZZLE_DATA[state.category][state.puzzleIndex];
  puzzle.questions.forEach((q, i) => {
    const input = document.getElementById(`qinput-${i}`);
    input.value = "";
    liveFill(i, "");
    document.getElementById(`qcard-${i}`).classList.remove("answered");
  });
});

function handleWin(puzzle) {
  if (state.solvedThisRound) return;
  state.solvedThisRound = true;

  markSolved(state.category, puzzle.id);
  document.getElementById("sourceText").textContent = puzzle.source;
  document.getElementById("sourceReveal").classList.add("show");
  updateScorePill();

  const stars = state.checkCount <= 1 ? 3 : state.checkCount === 2 ? 2 : 1;
  document.getElementById("winStars").textContent = "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars);
  document.getElementById("winQuote").textContent = puzzle.quote;
  document.getElementById("winSource").textContent = "— " + puzzle.source;
  document.getElementById("winOverlay").style.display = "flex";
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
document.getElementById("startGameBtn").addEventListener("click", () => {
  document.getElementById("devNoteModal").style.display = "none";
  renderHome();
});

// Kick things off — dev note shows first via CSS default display,
// home renders underneath so it's ready the instant the note closes.
renderHome();
