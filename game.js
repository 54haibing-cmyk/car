let currentLevel = 0;
let xp = 0;
let combo = 0;

let selectedCards = [];
let isChecking = false;

const board = document.getElementById("board");

/* ================= 启动 ================= */
function startGame() {
    console.log("game start");

    if (!board) {
        alert("board不存在");
        return;
    }

    currentLevel = 0;
    xp = 0;
    combo = 0;

    updateHUD();
    loadLevel(currentLevel);
}

/* ================= 关卡 ================= */
function loadLevel(i) {
    if (i >= LEVELS.length) {
        showResult("🎉 全部通关！", xp);
        return;
    }

    const level = LEVELS[i];
    board.innerHTML = "";
    selectedCards = [];
    isChecking = false;

    // 更新关卡显示
    document.getElementById("lvlVal").textContent = i + 1;

    const cards = [];
    level.words.forEach((w, idx) => {
        cards.push({ type: "img",  id: idx, ...w });
        cards.push({ type: "word", id: idx, ...w });
    });

    shuffle(cards).forEach(c => {
        const el = document.createElement("div");
        el.className = "card";
        el.dataset.id = c.id;
        el.dataset.type = c.type;

        el.innerHTML = c.type === "img"
            ? `<div class="emoji">${c.img}</div>`
            : `<div class="word">${c.word}</div><div class="cn">${c.cn}</div>`;

        el.onclick = () => handleCardClick(el);
        board.appendChild(el);
    });
}

/* ================= 点击处理 ================= */
function handleCardClick(el) {
    // 已匹配、正在判断、已选中 的牌不能再点
    if (isChecking) return;
    if (el.classList.contains("matched")) return;
    if (el.classList.contains("selected")) {
        // 取消选中
        el.classList.remove("selected");
        selectedCards = selectedCards.filter(c => c !== el);
        return;
    }

    el.classList.add("selected");
    selectedCards.push(el);

    if (selectedCards.length === 2) {
        isChecking = true;
        checkMatch();
    }
}

/* ================= 匹配判断 ================= */
function checkMatch() {
    const [a, b] = selectedCards;

    const sameId   = a.dataset.id === b.dataset.id;
    const diffType = a.dataset.type !== b.dataset.type; // 必须一张emoji一张单词

    if (sameId && diffType) {
        // ✅ 匹配成功
        combo++;
        const earned = 10 + (combo - 1) * 5; // combo 加成
        xp += earned;
        updateHUD();

        // 短暂延迟后隐藏
        setTimeout(() => {
            a.classList.add("matched");
            b.classList.add("matched");
            selectedCards = [];
            isChecking = false;
            checkLevelComplete();
        }, 400);

    } else {
        // ❌ 不匹配
        combo = 0;
        updateHUD();

        setTimeout(() => {
            a.classList.remove("selected");
            b.classList.remove("selected");
            selectedCards = [];
            isChecking = false;
        }, 700);
    }
}

/* ================= 关卡完成检查 ================= */
function checkLevelComplete() {
    const remaining = board.querySelectorAll(".card:not(.matched)");
    if (remaining.length === 0) {
        const bonus = 50;
        xp += bonus;
        updateHUD();
        setTimeout(() => showResult(`✅ 第 ${currentLevel + 1} 关完成！`, bonus), 300);
    }
}

/* ================= 结果弹窗 ================= */
function showResult(title, earnedXP) {
    document.getElementById("resultTitle").textContent = title;
    document.getElementById("resultXP").textContent = earnedXP;
    document.getElementById("resultModal").classList.remove("hidden");
}

/* ================= 下一关 ================= */
function nextLevel() {
    document.getElementById("resultModal").classList.add("hidden");
    currentLevel++;
    combo = 0;
    loadLevel(currentLevel);
}

/* ================= HUD 更新 ================= */
function updateHUD() {
    document.getElementById("xpVal").textContent   = xp;
    document.getElementById("comboVal").textContent = combo;
    document.getElementById("lvlVal").textContent   = currentLevel + 1;
}

/* ================= 工具 ================= */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
