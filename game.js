let currentLevel = 0;
let xp = 0;
let combo = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

const board = document.getElementById("board");
const startBtn = document.getElementById("startBtn");

const levelText = document.getElementById("level");
const xpText = document.getElementById("xp");
const comboText = document.getElementById("combo");

const levelTitle = document.getElementById("levelTitle");

const successSound =
document.getElementById("successSound");

const failSound =
document.getElementById("failSound");

startBtn.addEventListener(
    "click",
    startGame
);

function startGame(){

    startBtn.style.display = "none";

    currentLevel = 0;
    xp = 0;
    combo = 0;

    xpText.innerText = xp;
    comboText.innerText = combo;

    loadLevel(currentLevel);

}

/* =========================
   加载关卡
========================= */

function loadLevel(levelIndex){

    board.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const level =
    LEVELS[levelIndex];

    levelTitle.innerText =
    level.name;

    levelText.innerText =
    level.id;

    let cards = [];

    level.words.forEach(item=>{

        cards.push({

            type:"image",

            pair:item.word,

            value:item.img,

            word:item.word,

            cn:item.cn

        });

        cards.push({

            type:"word",

            pair:item.word,

            value:item.word,

            word:item.word,

            cn:item.cn

        });

    });

    shuffle(cards);

    cards.forEach(cardData=>{

        const card =
        document.createElement("div");

        card.className = "card";

        card.dataset.pair =
        cardData.pair;

        card.dataset.word =
        cardData.word;

        if(cardData.type === "image"){

            card.innerHTML = `
                <div class="emoji">
                    ${cardData.value}
                </div>

                <div class="cn">
                    ${cardData.cn}
                </div>
            `;

        }else{

            card.innerHTML = `
                <div class="word">
                    ${cardData.value}
                </div>
            `;
        }

        card.addEventListener(
            "click",
            ()=>selectCard(card)
        );

        board.appendChild(card);

    });

}

/* =========================
   选择卡片
========================= */

function selectCard(card){

    if(lockBoard) return;

    if(card === firstCard) return;

    if(card.classList.contains("matched"))
        return;

    card.classList.add("selected");

    speakWord(
        card.dataset.word
    );

    if(!firstCard){

        firstCard = card;
        return;

    }

    secondCard = card;

    checkMatch();

}

/* =========================
   检查配对
========================= */

function checkMatch(){

    lockBoard = true;

    const match =

    firstCard.dataset.pair ===
    secondCard.dataset.pair;

    if(match){

        successSound.currentTime = 0;
        successSound.play();

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );

        xp += 10;

        combo++;

        xpText.innerText = xp;
        comboText.innerText = combo;

        resetSelection();

        checkWin();

    }else{

        failSound.currentTime = 0;
        failSound.play();

        combo = 0;

        comboText.innerText =
        combo;

        setTimeout(()=>{

            firstCard.classList.remove(
                "selected"
            );

            secondCard.classList.remove(
                "selected"
            );

            resetSelection();

        },800);

    }

}

/* =========================
   重置
========================= */

function resetSelection(){

    firstCard = null;
    secondCard = null;
    lockBoard = false;

}

/* =========================
   通关检测
========================= */

function checkWin(){

    const remaining =

    document.querySelectorAll(
        ".card:not(.matched)"
    );

    if(remaining.length === 0){

        xp += 50;

        xpText.innerText = xp;

        setTimeout(()=>{

            currentLevel++;

            if(
                currentLevel >=
                LEVELS.length
            ){

                alert(
                    "🏆 Congratulations!\n\nYou completed all levels!"
                );

                board.innerHTML = "";

                levelTitle.innerText =
                "🌟 Champion!";

                startBtn.style.display =
                "inline-block";

                startBtn.innerText =
                "🔄 Play Again";

                return;
            }

            loadLevel(currentLevel);

        },1200);

    }

}

/* =========================
   英语发音
========================= */

function speakWord(word){

    speechSynthesis.cancel();

    const utterance =

    new SpeechSynthesisUtterance(
        word
    );

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    speechSynthesis.speak(
        utterance
    );

}

/* =========================
   洗牌
========================= */

function shuffle(array){

    for(

        let i=array.length-1;

        i>0;

        i--

    ){

        const j =

        Math.floor(
            Math.random()*(i+1)
        );

        [
            array[i],
            array[j]
        ] =

        [
            array[j],
            array[i]
        ];

    }

}

/* =========================
   星空背景
========================= */

function createStars(){

    for(let i=0;i<40;i++){

        const star =

        document.createElement(
            "div"
        );

        star.className = "star";

        star.style.left =
        Math.random()*100+"vw";

        star.style.top =
        Math.random()*100+"vh";

        star.style.animationDelay =
        Math.random()*3+"s";

        document.body.appendChild(
            star
        );

    }

}

createStars();