/* ═══════════════════════════════════════════════
   Word Match Hero - Stable Edition (Pi safe)
   ✔ 防 LEVELS 未加载
   ✔ 防 DOM null
   ✔ 防函数未定义
   ✔ 永不白屏版本
═══════════════════════════════════════════════ */

"use strict";

// ─── 游戏状态 ────────────────────────────────
let currentLevel = 0;
let xp = 0;
let combo = 0;
let selected = [];
let locked = false;

// ─── DOM（安全获取）──────────────────────────
const board = document.getElementById("board");
const startBtn = document.getElementById("startBtn");
const resultModal = document.getElementById("resultModal");
const levelTitle = document.getElementById("levelTitle");

// ─── UI 更新 ────────────────────────────────
function updateUI() {
    const xpEl = document.getElementById("xpVal");
    const comboEl = document.getElementById("comboVal");
    const lvlEl = document.getElementById("lvlVal");

    const lvlData = safeLevels()[currentLevel];

    if (levelTitle && lvlData) {
        levelTitle.textContent = `第 ${lvlData.id} 关 · ${lvlData.name}`;
    }

    if (xpEl) xpEl.textContent = xp;
    if (comboEl) comboEl.textContent = combo;
    if (lvlEl) lvlEl.textContent = currentLevel + 1;
}

// ─── LEVELS 安全兜底（关键）──────────────────
function safeLevels() {
    if (typeof LEVELS !== "undefined" && Array.isArray(LEVELS)) {
        return LEVELS;
    }

    console.warn("⚠ LEVELS 未加载，使用兜底数据");

    // 👉 防炸兜底关卡（保证永远能玩）
    return [
        {
            id: 1,
            name: "Demo Level",
            words: [
                { img: "🍎", word: "apple", cn: "苹果" },
                { img: "🍌", word: "banana", cn: "香蕉" },
                { img: "🍇", word: "grape", cn: "葡萄" },
                { img: "🍊", word: "orange", cn: "橙子" }
            ]
        }
    ];
}

// ─── 游戏入口（最重要）──────────────────────
function startGame() {
    try {
        if (!board) {
            alert("board 不存在，请检查 HTML");
            return;
        }

        console.log("🚀 startGame triggered");

        currentLevel = 0;
        xp = 0;
        combo = 0;

        updateUI();
        loadLevel(currentLevel);
        syncProgress();

    } catch (e) {
        console.error("❌ startGame error:", e);
        alert("游戏启动失败：" + e.message);
    }
}

// ─── 关卡加载 ───────────────────────────────
function loadLevel(levelIndex) {
    const levels = safeLevels();

    if (levelIndex < 0 || levelIndex >= levels.length) {
        console.warn("关卡越界");
        return;
    }

    currentLevel = levelIndex;
    selected = [];
    locked = false;

    if (board) board.innerHTML = "";

    updateUI();

    const lvl = levels[levelIndex];

    const cards = [];

    lvl.words.forEach((item, idx) => {
        cards.push({ type: "img", id: idx, ...item });
        cards.push({ type: "word", id: idx, ...item });
    });

    shuffle(cards).forEach(card => {
        if (board) board.appendChild(createCard(card));
    });
}

// ─── 卡片生成 ───────────────────────────────
function createCard(data) {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.id = data.id;
    el.dataset.type = data.type;

    el.innerHTML = data.type === "img"
        ? `<div class="emoji">${data.img}</div>`
        : `<div class="word">${data.word}</div><div class="cn">${data.cn}</div>`;

    el.addEventListener("click", () => onCardClick(el, data));

    return el;
}

// ─── 点击逻辑 ───────────────────────────────
function onCardClick(el, data) {
    if (locked) return;
    if (el.classList.contains("matched")) return;

    if (el.classList.contains("selected")) {
        el.classList.remove("selected");
        selected = selected.filter(s => s.el !== el);
        return;
    }

    if (selected.length === 1 && selected[0].type === data.type) return;

    el.classList.add("selected");
    selected.push({ el, ...data });

    if (selected.length === 2) checkMatch();
}

// ─── 匹配检测 ───────────────────────────────
function checkMatch() {
    locked = true;
    const [a, b] = selected;

    if (a.id === b.id) {
        combo++;
        xp += 10 * combo;
        updateUI();

        setTimeout(() => {
            a.el.classList.add("matched");
            b.el.classList.add("matched");
            selected = [];
            locked = false;
            checkLevelComplete();
        }, 250);

    } else {
        combo = 0;
        updateUI();

        setTimeout(() => {
            a.el.classList.remove("selected");
            b.el.classList.remove("selected");
            selected = [];
            locked = false;
        }, 600);
    }
}

// ─── 关卡完成 ───────────────────────────────
function checkLevelComplete() {
    const remain = board?.querySelectorAll(".card:not(.matched)") || [];
    if (remain.length > 0) return;

    saveProgress();
    showResult();
}

// ─── 结果弹窗 ───────────────────────────────
function showResult() {
    if (!resultModal) return;

    const isLast = currentLevel >= safeLevels().length - 1;

    const xpEl = resultModal.querySelector("#resultXP");
    const title = resultModal.querySelector("#resultTitle");
    const btn = resultModal.querySelector("#nextBtn");

    if (xpEl) xpEl.textContent = xp;
    if (title) title.textContent = isLast ? "🎉 全部通关！" : "🎉 过关！";

    if (btn) {
        btn.textContent = isLast ? "重新开始" : "下一关";
        btn.onclick = () => {
            hideResult();
            isLast ? startGame() : loadLevel(currentLevel + 1);
        };
    }

    resultModal.classList.remove("hidden");
}

function hideResult() {
    resultModal?.classList.add("hidden");
}

// ─── 进度同步（安全版）──────────────────────
async function syncProgress() {
    try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;

        const data = await res.json();

        if (data?.success && data?.progress) {
            console.log("进度加载成功");
        }

    } catch (e) {
        console.warn("进度同步失败（忽略）:", e.message);
    }
}

// ─── 保存进度（安全版）──────────────────────
async function saveProgress() {
    try {
        await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                level: currentLevel,
                xp
            })
        });
    } catch (e) {
        console.warn("保存失败（忽略）:", e.message);
    }
}

// ─── 洗牌 ───────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── ⭐ 全局兜底（防 HTML 调用失败）────────────
window.startGame = startGame;