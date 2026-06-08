let currentLevel = 0;
let xp = 0;
let combo = 0;

const board = document.getElementById("board");

/* ================= 启动 ================= */
function startGame() {
    console.log("game start");

    if (!board) {
        alert("board不存在");
        return;
    }

    board.style.display = "grid";

    currentLevel = 0;
    xp = 0;
    combo = 0;

    loadLevel(currentLevel);
}

/* ================= 关卡 ================= */
function loadLevel(i) {
    const level = LEVELS[i];

    board.innerHTML = "";

    const cards = [];

    level.words.forEach((w, idx) => {
        cards.push({type:"img", id:idx, ...w});
        cards.push({type:"word", id:idx, ...w});
    });

    shuffle(cards).forEach(c => {
        const el = document.createElement("div");
        el.className = "card";
        el.dataset.id = c.id;

        el.innerHTML = c.type === "img"
            ? `<div class="emoji">${c.img}</div>`
            : `<div class="word">${c.word}</div><div class="cn">${c.cn}</div>`;

        el.onclick = () => el.classList.toggle("selected");

        board.appendChild(el);
    });
}

/* ================= 工具 ================= */
function shuffle(a) {
    return a.sort(() => Math.random() - 0.5);
}