let PiUser = null;

window.addEventListener("PI_USER_READY", (e)=>{
    PiUser = e.detail;
});

window.__PI_USER__ = window.__PI_USER__ || null;

function getUser(){
    return PiUser || window.__PI_USER__;
}

function startGame(){

    // ❌ 删除所有登录限制

    startBtn.style.display = "none";

    currentLevel = 0;
    xp = 0;
    combo = 0;

    updateUI();
    loadLevel(currentLevel);
}