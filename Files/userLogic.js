import * as Modules from './gameField.js'

const userObject = JSON.parse(localStorage.getItem('BoronGameData')) || {
    gameLevels:[{level:1,canPlay:true},{level:2,canPlay:false},{level:3,canPlay:false}]
};

const playerObject = {
    playerPoints: 0,
    playerLife: 100,
    playerScoreColor: 'white',
    batteryStatus: 'rgb(1, 220, 1)'
};

let speed = 3.5;
const bigGameLevelIndex = 2;
const gameInterface = document.getElementById('gameInterface');
const gameChaptersTitle = document.querySelector('#gameChaptersTitle');
const gameChaptersDescription = document.querySelector('dialog');
const closeGameDescription = document.getElementById('closeModal');
const playLevel1 = document.getElementById('playLevel1');
const playLevel2 = document.getElementById('playLevel2');
const playLevel3 = document.getElementById('playLevel3');
const resetGame = document.getElementById('resetGame');
const playLevelBtns = document.querySelectorAll('.playBtn');
const gameShortCutsTitle = document.getElementById('gameShortCutsTitle');
const gameShortCuts = document.getElementById('gameShortCuts');
const soundBtn = document.getElementById('soundBtn');
const song = document.querySelector('audio');
const loading = document.getElementById('loading');

function checkIfUserCanPlayTheLevel (level) {
    let i = 0;
    for (const userLevel of userObject.gameLevels) {
        if (userLevel.level === level && !userLevel.canPlay) {
            denyForUserToPlayTheLevel();
            break;
        }
        else if (userLevel.level === level && userLevel.canPlay) {
            setTheUserToStartTheGame (level);
            break;
        }
    }
}

function setTheUserToStartTheGame (level) {
    setTheLevelToPlay(level);
    removeTheStartingPage();
}

function setTheLevelToPlay (level) {
    playerObject.playerPoints = 0;
    playerObject.playerLife = 100;
    playerObject.playerLevel = level;
    playerObject.totalScore = randomTotalScore();
}

function removeTheStartingPage () {
    gameInterface.style.display = 'none';
    Modules.toogleTheGameState();
    Modules.animate();
}

function addBackTheStartingPage () {
    gameInterface.style.display = 'block';
}

function randomTotalScore () {
    const score = [120,170,220];
    return score[Math.floor(Math.random() * score.length)];
}

function denyForUserToPlayTheLevel () {
    alert ('You have to win the level before to unlock this level');
}

function checkIfUserWonOrLooseTheLevel (hasUserWon) {
    if (hasUserWon) {
        updateUserObjectToTheNextLevel();
        updateDOM();
        updateLocalStorage();
    }
    addBackTheStartingPage();
}

function updateUserObjectToTheNextLevel () {
    if (playerObject.playerLevel <= bigGameLevelIndex) {
        userObject.gameLevels[playerObject.playerLevel].canPlay = true;
    }
}

function updateDOM () {
    if (playerObject.playerLevel <= bigGameLevelIndex) {
        playLevelBtns[playerObject.playerLevel].innerText = 'Play';
    }
}

function resetGameFn () {
    for (let i = userObject.gameLevels.length - 1; i >= 1; i--) {
        userObject.gameLevels[i].canPlay = false;
        playLevelBtns[i].innerText = 'Locked';
    }
    updateLocalStorage();
}

function updateLocalStorage () {
    let data = JSON.stringify(userObject);
    localStorage.setItem('BoronGameData',data);
}

function toogleTheSound () {
    if (soundBtn.value === 'onPause') {
        song.play();
        soundBtn.value = 'onPlay';
        soundBtn.innerText = 'SOUND OFF';
    }
    else {
        song.pause();
        soundBtn.value = 'onPause';
        soundBtn.innerText = 'SOUND ON';
    }
}

gameShortCutsTitle.addEventListener('click',() => {
    gameShortCuts.classList.toggle('invisible');
})

gameChaptersTitle.addEventListener('click',() => {
    gameChaptersDescription.showModal(); 
})

soundBtn.addEventListener('click',toogleTheSound);

document.addEventListener ('keyup', e => {
    if ((e.key === 'S' || e.key === 's') && e.altKey) {
        toogleTheSound();
    }
})

closeGameDescription.addEventListener('click',() => {
    gameChaptersDescription.close(); 
})

playLevel1.addEventListener('click',e => {
    checkIfUserCanPlayTheLevel(Number(e.target.value));
})

playLevel2.addEventListener('click',e => {
    checkIfUserCanPlayTheLevel(Number(e.target.value));
})

playLevel3.addEventListener('click',e => {
    checkIfUserCanPlayTheLevel(Number(e.target.value));
})

resetGame.addEventListener('click',resetGameFn);

window.addEventListener('resize',() => {
    if (Modules.gameRunning) {
        alert('Please refresh the browser to keep the game field smooth!');
    }
})

document.addEventListener('keyup',e => {
    if ((e.key === 'r' || e.key === 'R') && e.altKey) {
        Modules.backToTheStartingPage();
    }
})

playLevel1.addEventListener('touchstart',() => {
    alert("Hi! this application is based on keyBoard events we're still working on mobile touch events.")
})

playLevel2.addEventListener('touchstart',() => {
    alert("Hi! this application is based on keyBoard events we're still working on mobile touch events.")
})

playLevel3.addEventListener('touchstart',() => {
    alert("Hi! this application is based on keyBoard events we're still working on mobile touch events.")
})

window.addEventListener('load',() => {
    loading.style.display = 'none';
    gameInterface.style.display = 'block';
})

function updatePageAccordingToLocalStorage () {
    for (let i = 0; i < playLevelBtns.length; i++) {
        if (userObject.gameLevels[i].canPlay) {
            playLevelBtns[i].innerText = 'Play';
        }
        else {
            playLevelBtns[i].innerText = 'Locked';
        }
    }
}
updatePageAccordingToLocalStorage();

export {speed,playerObject,checkIfUserWonOrLooseTheLevel}