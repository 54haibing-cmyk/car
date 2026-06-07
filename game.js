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

const successSound = document.getElementById("successSound");
const failSound = document.getElementById("failSound");

const resultModal =
document.getElementById("resultModal");

const finalXp =
document.getElementById("finalXp");

const nextBtn =
document.getElementById("nextBtn");

startBtn.addEventListener("click", startGame);

nextBtn.addEventListener("click", () => {

    resultModal.classList.add("hidden");

    currentLevel++;

    if(currentLevel >= LEVELS.length){

        alert("🎉 所有关卡完成！");
        currentLevel = 0;
    }

    loadLevel(currentLevel);

});

function startGame(){

    startBtn.style.display = "none";

    loadLevel(currentLevel);

}

function loadLevel(levelIndex){

    board.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const level = LEVELS[levelIndex];

    levelTitle.innerText = level.name;
    levelText.innerText = level.id;

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

        card.dataset.type =
        cardData.type;

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

                <div class="cn">
                ${cardData.cn}
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

function checkMatch(){

    lockBoard = true;

    const match =
    firstCard.dataset.pair ===
    secondCard.dataset.pair;

    if(match){

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

        failSound.play();

        combo = 0;

        comboText.innerText = combo;

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

function resetSelection(){

    firstCard = null;
    secondCard = null;

    lockBoard = false;

}

function checkWin(){

    const remaining =
    document.querySelectorAll(
        ".card:not(.matched)"
    );

    if(remaining.length === 0){

        finalXp.innerText = xp;

        setTimeout(()=>{

            resultModal.classList.remove(
                "hidden"
            );

        },500);

    }

}

function speakWord(word){

    speechSynthesis.cancel();

    const utterance =
    new SpeechSynthesisUtterance(word);

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    speechSynthesis.speak(
        utterance
    );

}

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

function createStars(){

    for(let i=0;i<100;i++){

        const star =
        document.createElement("div");

        star.className = "star";

        star.style.left =
        Math.random()*100+"vw";

        star.style.top =
        Math.random()*100+"vh";

        star.style.animationDelay =
        Math.random()*3+"s";

        document.body.appendChild(star);

    }

}

function createMeteor(){

    const meteor =
    document.createElement("div");

    meteor.className =
    "shooting-star";

    meteor.style.top =
    Math.random()*30+"vh";

    meteor.style.left =
    Math.random()*30+"vw";

    document.body.appendChild(
        meteor
    );

    setTimeout(()=>{

        meteor.remove();

    },4000);

}

createStars();

setInterval(
    createMeteor,
    3000
);