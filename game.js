let currentLevel = 0;
let xp = 0;
let combo = 0;

let PiUser = null;

window.setPiUser = function(user){
    PiUser = user;
};

const board = document.getElementById("board");
const startBtn = document.getElementById("startBtn");

const levelText = document.getElementById("level");
const xpText = document.getElementById("xp");
const comboText = document.getElementById("combo");
const levelTitle = document.getElementById("levelTitle");

startBtn.onclick = startGame;

function startGame(){
    if(!PiUser){
        alert("Please login with Pi 🔐");
        return;
    }

    startBtn.style.display="none";

    currentLevel=0;
    xp=0;
    combo=0;

    updateUI();
    loadLevel(currentLevel);
}

function loadLevel(i){
    board.innerHTML="";
    const level=LEVELS[i];
    levelTitle.innerText=level.name;

    let cards=[];

    level.words.forEach(w=>{
        cards.push(makeCard("image",w));
        cards.push(makeCard("word",w));
    });

    shuffle(cards);

    cards.forEach(c=>board.appendChild(c));
}

function makeCard(type,item){
    const div=document.createElement("div");
    div.className="card";

    div.dataset.pair=item.word;
    div.dataset.word=item.word;

    div.innerHTML = type==="image"
    ? `<div>${item.img}</div><div>${item.cn}</div>`
    : `<div>${item.word}</div>`;

    div.onclick=()=>select(div);

    return div;
}

let first=null,second=null,lock=false;

function select(card){
    if(lock) return;
    if(card===first) return;

    card.classList.add("selected");

    speak(card.dataset.word);

    if(!first){
        first=card;
        return;
    }

    second=card;
    check();
}

function check(){
    lock=true;

    const ok=first.dataset.pair===second.dataset.pair;

    if(ok){
        xp+=10;
        combo++;

        first.classList.add("matched");
        second.classList.add("matched");

        sendScore();

        reset();
        checkWin();
    }else{
        combo=0;
        setTimeout(()=>{
            first.classList.remove("selected");
            second.classList.remove("selected");
            reset();
        },600);
    }

    updateUI();
}

function checkWin(){
    if(document.querySelectorAll(".card:not(.matched)").length===0){
        xp+=50;
        currentLevel++;

        setTimeout(()=>{
            if(currentLevel>=LEVELS.length){
                alert("Champion 🏆");
                return;
            }
            loadLevel(currentLevel);
        },800);
    }
}

function sendScore(){
    if(!PiUser) return;

    fetch("/api/score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            user:PiUser.username,
            score:xp
        })
    });
}

function updateUI(){
    levelText.innerText=currentLevel+1;
    xpText.innerText=xp;
    comboText.innerText=combo;
}

function reset(){
    first=null;
    second=null;
    lock=false;
}

function shuffle(a){
    for(let i=a.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [a[i],a[j]]=[a[j],a[i]];
    }
}

function speak(t){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(t);
    u.lang="en-US";
    speechSynthesis.speak(u);
}