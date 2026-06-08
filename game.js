/* ═══════════════════════════════════════════════════════
   game.js  –  Word Match Hero
   依赖：words.js（LEVELS）必须在本文件之前加载
   ═══════════════════════════════════════════════════════ */

"use strict";

// ─── 游戏状态 ───────────────────────────────────────────
let currentLevel = 0;
let xp           = 0;
let combo        = 0;
let selected     = [];    // 当前选中的卡片 [{el, type, id}]
let locked       = false; // 翻牌动画期间锁定点击

// ─── DOM 快捷引用 ────────────────────────────────────────
const board      = document.getElementById("board");
const startBtn   = document.getElementById("startBtn");
const resultModal= document.getElementById("resultModal");
const levelTitle = document.getElementById("levelTitle");

// ─── UI 更新 ─────────────────────────────────────────────
function updateUI() {
    const lvlData = LEVELS[currentLevel];
    if (levelTitle && lvlData) levelTitle.textContent = `第 ${lvlData.id} 关 · ${lvlData.name}`;
    const xpEl    = document.getElementById("xpVal");
    const comboEl = document.getElementById("comboVal");
    const lvlEl   = document.getElementById("lvlVal");
    if (xpEl)    xpEl.textContent    = xp;
    if (comboEl) comboEl.textContent = combo;
    if (lvlEl)   lvlEl.textContent   = currentLevel + 1;
}

// ─── 开始游戏（由 index.html 在用户登录后调用）────────────
function startGame() {
    if (startBtn) startBtn.style.display = "none";
    currentLevel = 0;
    xp           = 0;
    combo        = 0;
    updateUI();
    loadLevel(currentLevel);
    syncProgress();   // 先从服务器拉上次进度
}

// ─── 关卡加载 ─────────────────────────────────────────────
function loadLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= LEVELS.length) return;

    currentLevel = levelIndex;
    selected     = [];
    locked       = false;
    board.innerHTML = "";
    updateUI();

    const lvl = LEVELS[levelIndex];

    // 每张单词生成两张卡片：emoji 卡 + 文字卡
    const cards = [];
    lvl.words.forEach((item, idx) => {
        cards.push({ type: "img",  id: idx, img: item.img,  word: item.word, cn: item.cn });
        cards.push({ type: "word", id: idx, img: item.img,  word: item.word, cn: item.cn });
    });

    shuffle(cards).forEach(card => board.appendChild(createCard(card)));
}

// ─── 卡片元素工厂 ────────────────────────────────────────
function createCard(data) {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.id   = data.id;
    el.dataset.type = data.type;

    if (data.type === "img") {
        el.innerHTML = `
            <div class="emoji">${data.img}</div>
        `;
    } else {
        el.innerHTML = `
            <div class="word">${data.word}</div>
            <div class="cn">${data.cn}</div>
        `;
    }

    el.addEventListener("click", () => onCardClick(el, data));
    return el;
}

// ─── 点击处理 ────────────────────────────────────────────
function onCardClick(el, data) {
    if (locked) return;
    if (el.classList.contains("matched")) return;
    if (el.classList.contains("selected")) {
        // 取消选中
        el.classList.remove("selected");
        selected = selected.filter(s => s.el !== el);
        return;
    }

    // 不允许选两张同类型（两张都是 img 或都是 word）
    if (selected.length === 1 && selected[0].type === data.type) return;

    el.classList.add("selected");
    selected.push({ el, ...data });

    if (selected.length === 2) checkMatch();
}

// ─── 配对检测 ────────────────────────────────────────────
function checkMatch() {
    locked = true;
    const [a, b] = selected;

    if (a.id === b.id) {
        // ✅ 配对成功
        combo++;
        xp += 10 * combo;
        updateUI();

        setTimeout(() => {
            a.el.classList.add("matched");
            b.el.classList.add("matched");
            selected = [];
            locked   = false;
            checkLevelComplete();
        }, 300);

    } else {
        // ❌ 配对失败
        combo = 0;
        updateUI();

        setTimeout(() => {
            a.el.classList.remove("selected");
            b.el.classList.remove("selected");
            selected = [];
            locked   = false;
        }, 700);
    }
}

// ─── 关卡完成检测 ─────────────────────────────────────────
function checkLevelComplete() {
    const remaining = board.querySelectorAll(".card:not(.matched)");
    if (remaining.length > 0) return;

    // 保存进度
    saveProgress();

    // 显示结果弹窗
    showResult();
}

// ─── 结果弹窗 ─────────────────────────────────────────────
function showResult() {
    if (!resultModal) return;
    const isLast = currentLevel >= LEVELS.length - 1;

    const xpEl   = resultModal.querySelector("#resultXP");
    const nextBtn= resultModal.querySelector("#nextBtn");
    const titleEl= resultModal.querySelector("#resultTitle");

    if (xpEl)   xpEl.textContent   = xp;
    if (titleEl) titleEl.textContent = isLast ? "🎉 全部通关！" : "🎉 过关！";

    if (nextBtn) {
        if (isLast) {
            nextBtn.textContent  = "重新开始";
            nextBtn.onclick      = () => { hideResult(); startGame(); };
        } else {
            nextBtn.textContent  = "下一关";
            nextBtn.onclick      = () => { hideResult(); loadLevel(currentLevel + 1); };
        }
    }

    resultModal.classList.remove("hidden");
}

function hideResult() {
    if (resultModal) resultModal.classList.add("hidden");
}

// ─── 进度同步 ─────────────────────────────────────────────

/**
 * 从服务器拉取上次进度
 * 若拉取成功且服务器进度 > 本地，跳到对应关卡
 */
async function syncProgress() {
    try {
        const res  = await fetch("/api/progress");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.progress.level > currentLevel) {
            currentLevel = data.progress.level;
            xp           = data.progress.xp;
            loadLevel(currentLevel);
            updateUI();
        }
    } catch (e) {
        console.warn("[Progress] 拉取失败（离线模式）:", e.message);
    }
}

/**
 * 把当前进度上报服务器
 */
async function saveProgress() {
    try {
        await fetch("/api/progress", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ level: currentLevel, xp })
        });
    } catch (e) {
        console.warn("[Progress] 保存失败（离线模式）:", e.message);
    }
}

// ─── 工具：Fisher-Yates 洗牌 ──────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
