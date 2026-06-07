let currentLevel = 0;

let xp = 0;

let combo = 0;

let firstCard = null;

let secondCard = null;

let lockBoard = false;

const board = document.getElementById("board");

const startBtn =
document.getElementById("startBtn");

const levelText =
document.getElementById("level");

const xpText =
document.getElementById("xp");

const comboText =
document.getElementById("combo");

const levelTitle =
document.getElementById("levelTitle");

const successSound =
document.getElementById("successSound");

const failSound =
document.getElementById("failSound");

startBtn.addEventListener(
    "click",
    startGame
);

function startGame(){

    loadLevel(currentLevel);

}

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

        card.className =
        "card";

        card.dataset.pair =
        cardData.pair;

        card.dataset.type =
        cardData.type;

        card.dataset.word =
        cardData.word;

        if(cardData.type==="image"){

            card.innerHTML = `
            <div class="emoji">
            ${cardData.value}
            </div>

            <div class="cn">
            ${cardData.cn}
            </div>
            `;
        }
        else{

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