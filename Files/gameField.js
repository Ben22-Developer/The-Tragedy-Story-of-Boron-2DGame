import * as modules from './userLogic.js';

/* Global Variables */

const canvas = document.querySelector('canvas');
const countingDownMsg = document.getElementById('nextRound');
const questionAnswer = document.getElementById('questionAnswer');
const ctx = canvas.getContext('2d');
let pageWidth = innerWidth;
let pageHeight = innerHeight;
let topBarHeight = 80;
const allBlocksArr = [];
const movingBlocksArr = [];
let randomMovingBlocksRowsArr = [0,1,2,3];
let ball,blockOfBall,canUserStillPlay,saviourBall,gunSetTimeoutRef1,gunSetTimeoutRef2,gunSetTimeoutRef3,gunSetTimeoutRef4,gunSetTimeoutRef5,ballSaviourTimeOutRef1,ballSaviourTimeOutRef2;
let endGame = false;
let countDown,setIntevalReference;
countDown = 2;
let gameRunning = 0;

function toogleTheGameState () {
    gameRunning = !gameRunning;
}





/* Page Resizing , topNavBar, all components of topNavBar*/





const pageUpdateFn = () => {
    pageWidth = innerWidth;
    pageHeight = innerHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
}

function topNavBackGround () {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,pageWidth,topBarHeight);
    ctx.closePath();
}

function userLifeBorder () {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeRect(25,(topBarHeight/2)-25,100,50);
    ctx.closePath();
}

function userLifeBattery (color,batteryLevel) {
    ctx.fillStyle = color;
    ctx.fillRect (25,(topBarHeight/2)-25,batteryLevel,50);
    ctx.closePath();
}

function userLifeInPercentage (batteryPecentage) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Verdana';
    ctx.fillText(`${batteryPecentage}%`,35,(topBarHeight/1.5));
}

function userCurrentScore (color,currentScore,totalScore) {
    ctx.fillStyle = color;
    ctx.font = '40px Verdana';
    ctx.fillText(`${currentScore}/${totalScore}`,(pageWidth/2)-50,(topBarHeight/2)+10);
}

function userCurrentLeveL (level) {
    ctx.fillStyle = 'orange';
    ctx.fillText(`Level ${level}`,(pageWidth) - 150,(topBarHeight/2)+10);
    ctx.closePath();
}
















/* Page Borders Nation*/





















class PageBorders {
    constructor (x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

function getHowToDrawHorizantalPageBorderProp (color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(this.x_axis,this.y_axis);
    ctx.lineTo(this.x_axis+18,this.y_axis+(35 * this.posOrNeg));
    ctx.lineTo(this.x_axis+36,this.y_axis);
    ctx.fill();    
}

function getHowToDrawVerticalPageBorderProp (color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(this.x_axis,this.y_axis);
    ctx.lineTo(this.x_axis+(35 * this.posOrNeg),this.y_axis+15);
    ctx.lineTo(this.x_axis,this.y_axis+30);
    ctx.fill();
}

function checkXorYDrawSpace (x_axis,y_axis,finalPt,verticalOrHorizontal) {
    if (verticalOrHorizontal === 'horizontal') {
        return x_axis < finalPt ? true : false;
    }
    else {
        return y_axis < finalPt ? true : false;
    }
}

function getPageBorderDecisionDrawXorY () {

    const startAndEndPtPageBorderArr = [
        {x_axis: 35,endingPt: pageWidth - 40,y_axis: topBarHeight,horizontalOrVertical:'horizontal',posOrNeg: 1},
        {x_axis: 0,endingPt: pageWidth,y_axis: pageHeight, horizontalOrVertical: 'horizontal',posOrNeg: -1},
        {x_axis: 0, endingPt: pageHeight - 40,y_axis: 120,horizontalOrVertical: 'vertical',posOrNeg: 1}
    ];

    let i = 0;

    while (i < startAndEndPtPageBorderArr.length) {
        const space_available = checkXorYDrawSpace(startAndEndPtPageBorderArr[i].x_axis,startAndEndPtPageBorderArr[i].y_axis,startAndEndPtPageBorderArr[i].endingPt,startAndEndPtPageBorderArr[i].horizontalOrVertical);
        if (space_available) {
            createAPageBorder (startAndEndPtPageBorderArr[i].x_axis,startAndEndPtPageBorderArr[i].y_axis,startAndEndPtPageBorderArr[i].horizontalOrVertical,startAndEndPtPageBorderArr[i].posOrNeg,startAndEndPtPageBorderArr);          
        }
        else {
            i++;
        }
    } 
}

function createAPageBorder (x_axis,y_axis,horizontalOrVertical,posOrNeg,startAndEndPtPageBorderArr) {
    const newPageBorder = {
        x_axis: x_axis,
        y_axis: y_axis,
        horizontalOrVertical: horizontalOrVertical,
        posOrNeg:posOrNeg
    }
    if (newPageBorder.horizontalOrVertical === 'horizontal') {
        newPageBorder.drawing = getHowToDrawHorizantalPageBorderProp;
    }
    else {
        newPageBorder.drawing = getHowToDrawVerticalPageBorderProp;
    }
    drawingPageBorders(newPageBorder,startAndEndPtPageBorderArr);
}

function drawingPageBorders (newPageBorder,startAndEndPtPageBorderArr) {
    newPageBorder.drawing('brown');
    nextBorderCoordinatesIncr(newPageBorder,startAndEndPtPageBorderArr);
}


function nextBorderCoordinatesIncr (newPageBorder,startAndEndPtPageBorderArr) {
    if (newPageBorder.horizontalOrVertical === 'horizontal') {
        for (let i = 0; i < startAndEndPtPageBorderArr.length; i++) {
            if (startAndEndPtPageBorderArr[i].x_axis === newPageBorder.x_axis) {
                startAndEndPtPageBorderArr[i].x_axis += 40;
                break;
            }
        }
    }
    else {
        for (let i = 0; i < startAndEndPtPageBorderArr.length; i++) {
            if (startAndEndPtPageBorderArr[i].y_axis === newPageBorder.y_axis) {
                startAndEndPtPageBorderArr[i].y_axis += 40;
                break;
            }
        }
    }
}













/* Blocks Nation */



























class Blocks {
    constructor (x_axis,y_axis,width,height,isMoving) {
        this.x_axis = parseFloat(x_axis.toFixed(2));
        this.y_axis = y_axis;
        this.width = width;
        this.height = height;
        this.speed = modules.speed;
        this.isMoving = isMoving;
    }
}

function randomBlockHeight () {
    const blockHeight = [95,100,150,200];
    const height = blockHeight[Math.floor(Math.random() * blockHeight.length)];
    return height;
}

function creatingASingleBlock (x_axis,y_axis,i) {
    const height = randomBlockHeight();
    const aBlock = new Blocks (x_axis,y_axis,height,10,false);
    allBlocksArr[i].push(aBlock);
}

const createBlocks = () => {
    let y_axis = 230;
    for (let i = 0; i < 4; i++) {
        allBlocksArr[i] = [];
        for (let j = 0; j < 5; j++) {
           creatingASingleBlock(1500,y_axis,i);
        }
        y_axis += 100;
    }
}

createBlocks();

function getResultToReleaseANewBlock() {
    if (!movingBlocksArr.length) {
        getRandomMovingBlock();
    }
    else {
        if (movingBlocksArr[movingBlocksArr.length - 1].x_axis + movingBlocksArr[movingBlocksArr.length - 1].width < 1450) {
            getRandomMovingBlock();
        }
    }
}

function getRandomMovingBlock() {
    let randomRow;
    let randomClm = Math.floor(Math.random() * 5);
    if (!movingBlocksArr.length) {
        randomRow = randomMovingBlocksRowsArr[Math.floor(Math.random() * randomMovingBlocksRowsArr.length)];
    }
    else {
        while (true) {
            randomRow = randomMovingBlocksRowsArr[Math.floor(Math.random() * randomMovingBlocksRowsArr.length)];
            randomClm = Math.floor(Math.random() * 5);
            const blockValidate = blockValidation(randomRow,randomClm);
            if (blockValidate) {
                break;
            }
        }
    }
    setNextRandomRowValues(randomRow);
    pushNewMovingBlockAndModifyMvgProp (randomRow,randomClm);
}

function getNextRowsToChooseMovingBlocksFrom (randomRow) {
    switch (randomRow) {
        case 0:
            return [1,2,3];
        break;
        case 1:
            return [0,2,3];
        break;
        case 2:
            return [1,3];
        break;
        case 3:
            return [2];
        break;
    }
}

function blockValidation (row,clm) {
    return allBlocksArr[row][clm].isMoving ? false : true; 
}

function setNextRandomRowValues (randomRow) {
    randomMovingBlocksRowsArr = getNextRowsToChooseMovingBlocksFrom(randomRow);
}

function pushNewMovingBlockAndModifyMvgProp (row,clm) {
    movingBlocksArr.push(allBlocksArr[row][clm]);
    allBlocksArr[row][clm].isMoving = true;
}

function checkIfFirstMovingBlockIsOutOfThePage () {
    if (movingBlocksArr[0].x_axis + movingBlocksArr[0].width <= 0) {
        resetBlockProp();
    }
}

function resetBlockProp () {
    movingBlocksArr[0].x_axis = 1500;
    parseFloat(movingBlocksArr[0].x_axis.toFixed(2));
    movingBlocksArr[0].isMoving = false;
    movingBlocksArr.shift();
    blockOfBall -= 1;
}

function settingBlocksPositionOnXAxis () {
    movingBlocksArr.forEach (block => {
        block.x_axis -= block.speed;
        parseFloat(block.x_axis.toFixed(2));
    })
}

function drawingMovingBlocks() {
    ctx.fillStyle = 'black';
    movingBlocksArr.forEach (block => {
        ctx.fillRect(block.x_axis,block.y_axis,block.width,block.height);
        ctx.closePath();
    }) 
}













/* Ball, saviourBall, BlockBall Collision Detections */


























class TheBallsParent {
    constructor () {
        this.radius = 20;
        this.normalSpeed = modules.speed;
        this.freeControl = true;
    }
}
class BallSaviour extends TheBallsParent {
    constructor () {
        super();
        this.initialYAxis = topBarHeight/2;
        this.initialXAxis =  pageWidth * 0.7;
        this.x_axis = this.initialXAxis;
        this.y_axis = this.initialYAxis;
        this.color = 'rgb(1, 220, 1)';
        this.canReleaseAnother = true;

    }
}

class Ball extends TheBallsParent {
    constructor (x_axis,y_axis,customizedUserSpeedY,customizedUserSpeedX,gravity,gravitationForce,userYControl,userXControl,userEndYPoint,userEndXPoint,gamePlaying,movingRight,movingLeft) {
        super();
        this.x_axis = parseFloat(x_axis.toFixed(2));
        this.y_axis = y_axis;
        this.color = 'rgb(0,0,0)';
        this.customizedUserSpeedY = customizedUserSpeedY;
        this.customizedUserSpeedX = customizedUserSpeedX;
        this.gravity = gravity;
        this.gravitationForce = gravitationForce;
        this.userYControl = userYControl;
        this.userXControl = userXControl;
        this.userEndYPoint = userEndYPoint;
        this.userEndXPoint = userEndXPoint;
        this.gamePlaying = gamePlaying;
        this.movingRight = movingRight;
        this.movingLeft = movingLeft;
        this.ballInAir = false;
        this.blockOfBall;
    }
}




/*Ball Start Up Functions*/




const createBallFn = () => {
    saviourBall = new BallSaviour();
    ball = new Ball ((1500 * 0.875),0,0,0,false,5,false,false,0,0,false,false,false);
    saviourBall.freeControl = false;
}

createBallFn();

function getIfCanBallLandingOnTheField () {
    if (movingBlocksArr[0].x_axis <= ball.x_axis && !endGame && !ball.gamePlaying) {
        incrementBallY_AxisWithGravity();
        getIfBallIsOnTheField();
    }
}

function drawBall (aBallObject) {
    ctx.beginPath();
    ctx.fillStyle = aBallObject.color;
    ctx.arc(aBallObject.x_axis,aBallObject.y_axis,aBallObject.radius,0,Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function getIfBallIsOnTheField () {
    if (ball.y_axis + ball.radius >= movingBlocksArr[0].y_axis && !ball.gamePlaying) {
        ball.x_axis = parseFloat((movingBlocksArr[0].x_axis + (movingBlocksArr[0].width/2)).toFixed(2));
        ball.gamePlaying = true;
        getBlockTheBallIsOn();
    }
}




/*Collission Detectors Functions*/




function checkIfMovingUpBallHasMadeCollision () {
    const isCollision = collisionDetectorWhenBallMovesUp ();
    if (isCollision) {
        returnBallToTheGround();
    }
}

function collisionDetectorWhenBallMovesUp () {
    for (let i = 0; i < movingBlocksArr.length; i++) {
        if (ball.y_axis - ball.radius <= movingBlocksArr[i].y_axis + movingBlocksArr[i].height &&
            (ball.y_axis - ball.radius) - (movingBlocksArr[i].y_axis + movingBlocksArr[i].height) >= 0 &&
            movingBlocksArr[i].x_axis <= ball.x_axis + ball.radius &&
            movingBlocksArr[i].x_axis + movingBlocksArr[i].width >= ball.x_axis - ball.radius) 
        {
            return true;
        }
    }
}

function collisionDetectorWhenBallMovesDownFromAbove () {
    for (let i = 0; i < movingBlocksArr.length; i++) {
        if ((ball.y_axis + ball.radius) >= movingBlocksArr[i].y_axis &&
            (ball.y_axis + ball.radius) - movingBlocksArr[i].y_axis >= 0 && ((ball.y_axis + ball.radius) - movingBlocksArr[i].y_axis) < 10  &&
            movingBlocksArr[i].x_axis <= ball.x_axis + ball.radius &&
            movingBlocksArr[i].x_axis + movingBlocksArr[i].width >= ball.x_axis - ball.radius) 
        {
            return true;
        }
    }
}

function collisionDetectorWhenBallMovesDownFromItsBlock () {
    for (let i = 0; i < movingBlocksArr.length; i++) {
        if ((ball.y_axis + ball.radius) >= movingBlocksArr[i].y_axis &&
            (ball.y_axis + ball.radius) - movingBlocksArr[i].y_axis >= 0 &&
            movingBlocksArr[i].x_axis <= ball.x_axis + ball.radius &&
            movingBlocksArr[i].x_axis + movingBlocksArr[i].width >= ball.x_axis - ball.radius) 
        {
            
            return true;
        }
    }
}

function checkIfMovingDownBallHasMadeCollision () {
    const isCollision = collisionDetectorWhenBallMovesDownFromAbove();
    if (isCollision) {
        ballReachedTheGround();
        getBlockTheBallIsOn();
    }
}

function checkIfBallHasNotFallen () {
    if (!ball.userYControl && !ball.gravity) {
        const isBallFallen = checkingBallCoordinates();

        if (isBallFallen) {
            returnBallToTheGround();
            incrementBallY_AxisWithGravity();
            getNewBlockCollisionIfBallHasFallen();

        }
    }
}

function getNewBlockCollisionIfBallHasFallen () {
    const newBallBlock = collisionDetectorWhenBallMovesDownFromItsBlock ();
    if (newBallBlock) {
        getBlockTheBallIsOn();
        checkingBallCoordinates();
        ballReachedTheGround();
    }
}




/* Functions to track the block which the ball is on */





function getBlockTheBallIsOn () {
    
    if (!ball.userYControl && !ball.gravity) {
        const block = iterateToFindIndexOfTheBallBlock();
        if (block) {
            blockOfBall = movingBlocksArr.indexOf(block);
            checkIfUserGotAScore(block);
        }
    }

}

function iterateToFindIndexOfTheBallBlock () {
    return movingBlocksArr.find(block => {
        if (ball.y_axis + ball.radius >= block.y_axis &&
            (ball.y_axis + ball.radius) - block.y_axis >= 0 && (ball.y_axis + ball.radius) - block.y_axis < 5  &&
            block.x_axis <= ball.x_axis + ball.radius &&
            block.x_axis + block.width >= ball.x_axis - ball.radius)
        {
            return block;
        }
    })
}

function getXYAxisOfLastBlock (aBallObject) {
    aBallObject.x_axis = movingBlocksArr[movingBlocksArr.length - 2].x_axis + (movingBlocksArr[movingBlocksArr.length - 2].width/2);
    aBallObject.y_axis = movingBlocksArr[movingBlocksArr.length - 2].y_axis - aBallObject.radius;
}

function changeBlockOfBallProp (block) {
    ball.blockOfBall = block;
}


function checkingBallCoordinates () {

    if (!movingBlocksArr[blockOfBall]) {
        return;
    }

    if (movingBlocksArr[blockOfBall].x_axis > ball.x_axis + ball.radius ||
        movingBlocksArr[blockOfBall].x_axis + movingBlocksArr[blockOfBall].width < ball.x_axis - ball.radius) 
    {
        return true;
    }
}





/*Functions To track the ball movement directions and making increments or decrements accodingly and also check for the endpoints of the ball*/





function whenTheBallMovesDown () {
    if (ball.gravity) {
        checkIfMovingDownBallHasMadeCollision();
        incrementBallY_AxisWithGravity();
    }
}

function whenTheBallMovesUp () {
    if (ball.userYControl) {
        decrementTheBallY_Axis();
        checkIfBallIsNearEndPoint();
        checkIfBallReachedYEndPoint();
        checkIfMovingUpBallHasMadeCollision();
    }
}

function whenTheBallMoveRight () {
    if (ball.movingRight) {
        updateBallX_Axis();
        checkIfBallReachedRightXEndPoint();
    }
}

function whenTheBallMoveLeft () {
    if (ball.movingLeft) {
        updateBallX_Axis();
        checkIfBallReachedLeftXEndPoint();
    }
}

function returnBallToTheGround () {
    ball.gravity = true;
    ball.userYControl = false;
}

function ballReachedTheGround () {
    ball.gravity = false;
    ball.ballInAir = false;
}

function updateBallWheNoEvent () {
    if (!ball.userXControl && !ball.userYControl) {
        ball.freeControl = true;
    }
}

function moveBallWhenNoEvent (aBallObject) {
    if (aBallObject.freeControl) {
        aBallObject.x_axis -= aBallObject.normalSpeed;
    }
}

function decrementTheBallY_Axis () {
    ball.y_axis += ball.customizedUserSpeedY;
}

function updateBallX_Axis () {
    ball.x_axis += ball.customizedUserSpeedX;
}

function incrementBallY_AxisWithGravity () {
    ball.y_axis += ball.gravitationForce;
}

function checkIfBallIsNearEndPoint () {
    if (ball.y_axis - ball.userEndYPoint < 30) {
        ball.customizedUserSpeedY += 0.1;
    }
}

function checkIfBallReachedYEndPoint () {
    if (ball.y_axis <= ball.userEndYPoint) {
        returnBallToTheGround();
    }
}

function checkIfBallReachedLeftXEndPoint () {
    if ((ball.x_axis + ball.radius) <= ball.userEndXPoint) {
        ball.userXControl = false;
        ball.movingRight = false;
        ball.movingLeft = false;
        ball.freeControl = true;
    }
}

function checkIfBallReachedRightXEndPoint () {
    if ((ball.x_axis - ball.radius) >= ball.userEndXPoint) {
        ball.userXControl = false;
        ball.movingRight = false;
        ball.movingLeft = false;
        ball.freeControl = true;
    }
}



/*Functions To increment the user's score when ball collides*/



function checkIfUserGotAScore (block) {
    if (!ball.blockOfBall) {
        changeBlockOfBallProp(block);
        return;
    }
    const hasUserChangedBlock = checkIfUserChangedBlock(block);
    if (hasUserChangedBlock) {
        incrementScore();
        changeBlockOfBallProp(block);
    }
}

function checkIfUserChangedBlock (block) {
    return ball.blockOfBall === block ? false : true;
}

function incrementScore () {
    modules.playerObject.playerPoints += 1;
    changeColorBasedOnScore();
}

function changeColorBasedOnScore () {
    if (modules.playerObject.playerPoints/modules.playerObject.totalScore > 0.8) {
        modules.playerObject.playerScoreColor = ' rgb(1, 220, 1)';
    }
    else {
        modules.playerObject.playerScoreColor = 'white';
    }
    if (modules.playerObject.playerPoints - modules.playerObject.totalScore === 1) {
        userWinsToTheNextLevel();
    }
}

function userWinsToTheNextLevel () {
    alert(`😜😜😜 ${winningMsg()}🚀🚀🚀`);
    endGameFn();
    toogleTheGameState();
    makeUserRestartTheLevel();
    modules.checkIfUserWonOrLooseTheLevel(true);
}

function winningMsg () {
    return getRandomValueFromAnyArray(['Damn you did it!','You got a big up from Ben!','You made sad Panda smiles!',"Let's prove it true, roll the game again!",'You catch-up the vibes with Sandrita tho!']);
}







/*Functions to make decisions when user fails or wins*/












function gameOver () {
    if (!ball.gamePlaying) {
        return;
    }
    if (ball.y_axis > pageHeight - 25 || ball.x_axis -  ball.radius < 25 || ball.y_axis < topBarHeight + 35) {
        endGameFn();
        modules.playerObject.playerLife = lifeDeduction(modules.playerObject.playerLife);
        batteryStatusClrChangerFn();
        canUserStillPlay = canUserStillPlayFn(modules.playerObject.playerLife);
        if (canUserStillPlay) {
            setCountForNextGame();
        }
        else {
            restartGameAfterLoss();
        }
    }
}

function endGameFn () {
    ball.gamePlaying = !ball.gamePlaying;
    endGame = !endGame;
}

function canUserStillPlayFn (playerLife) {
    return !playerLife ? false : true;
}

function setCountForNextGame () {
    if (canUserStillPlay) {
        setIntevalReference = setInterval(countingDownFn,1000);
    }
    canUserStillPlay = false;
}

function countingDownFn () {
    if (countDown === -1) {
        clrScreenByRemovingCounts();
    }
    else {
        countingDownMsg.innerText = `The next chance\nis starting in: ${countDown}`;
        countDown --;
    }
}

function clrScreenByRemovingCounts() {
    countingDownMsg.innerText = '';
    countDown = 2;
    clearInterval(setIntevalReference);
    setTheBallForNextGame();
}

function setTheBallForNextGame () {
    getXYAxisOfLastBlock(ball);
    ball.gravity = false;
    ball.userYControl = false;
    ball.userXControl = false;
    ball.freeControl = true;
    ball.userEndYPoint = 0;
    ball.userEndXPoint = 0;
    ball.movingRight = false;
    ball.movingLeft = false;
    ball.ballInAir = false;
    ball.blockOfBall = undefined;
    getBlockTheBallIsOn();
    endGameFn();
}

function restartGameAfterLoss () {
    setTimeout(() => {
        const result = confirm('Unfortunately you failed press "Okay" to try again this level or press "Cancel" to return to the main menu.');
        if (result) {
          makeUserRestartTheLevel();
        }
        else {
            backToTheStartingPage();
        }
    },500)
}

function makeUserRestartTheLevel () {
    movingBlocksArr.splice(0);
    allBlocksArr.splice(0);
    clearTimeout (ballSaviourTimeOutRef1);
    clearTimeout (ballSaviourTimeOutRef2);   
    blockOfBall = undefined;
    ball = undefined;
    saviourBall = undefined;
    createBlocks();
    createBallFn();
    endGame = false;
    modules.playerObject.batteryStatus = 'rgb(1, 220, 1)';
    modules.playerObject.playerLife = 100;
    modules.playerObject.playerPoints = 0;
    modules.playerObject.playerScoreColor = 'white';
}

function backToTheStartingPage () {
    endGameFn();
    toogleTheGameState();
    makeUserRestartTheLevel();
    modules.checkIfUserWonOrLooseTheLevel(false);
}



/*Ball Saviour Functions */





function ballSaviourMoveFn () {
    saviourBall.freeControl = true;
}

function ballSaviourReleaseFn () {
    getXYAxisOfLastBlock(saviourBall);
}

function saviourBallCollisionDetector () {
    if (saviourBall.freeControl) {
        ballSaviourAndBallCollision();
        ballSaviourOutOfScreen();
    }
}

function whenBallColideForSaviourBall () {
    if (!ball.gamePlaying && endGame && saviourBall.freeControl) {
        setSaviourBallPropToInitial();
        setTimeoutToReleaseSaviourToSaveTheBall();
    }
}

function ballSaviourAndBallCollision () {
    if ((saviourBall.y_axis - ball.y_axis <=  0 && saviourBall.y_axis - ball.y_axis <  Math.abs(-20)) &&
        ((saviourBall.x_axis - saviourBall.radius) - (ball.x_axis + ball.radius)) <= 0 && 
        ((saviourBall.x_axis - saviourBall.radius) - (ball.x_axis - ball.radius) < Math.abs(-20))) 
    {
        userGainLife();
        setSaviourBallPropToInitial();
    }

}

function ballSaviourOutOfScreen () {
    if (saviourBall.x_axis < 125) {
        setSaviourBallPropToInitial();
    }
}

function setSaviourBallPropToInitial () {
    saviourBall.canReleaseAnother = true;
    saviourBall.freeControl = false;
    saviourBall.x_axis = saviourBall.initialXAxis;
    saviourBall.y_axis = saviourBall.initialYAxis;
}

function userGainLife () {
    modules.playerObject.playerLife += lifeAddition();
    checkIfUserLifeIsInLimit();
    batteryStatusClrChangerFn();
}

function saviourBallControllerFn () {
    if (modules.playerObject.playerLife < 70 && saviourBall.canReleaseAnother) {
        saviourBall.canReleaseAnother = false;
        setTimeoutToReleaseSaviourToSaveTheBall();
    }
}


function setTimeoutToReleaseSaviourToSaveTheBall () {
    const savingTimeIntervals = [3000,5000,7000];
    const time = savingTimeIntervals[Math.floor(Math.random() * savingTimeIntervals.length)];
    ballSaviourTimeOutRef1 = setTimeout (ballSaviourReleaseFn,time);
    ballSaviourTimeOutRef2 = setTimeout (ballSaviourMoveFn,time)
}

function checkIfUserLifeIsInLimit () {
    if (modules.playerObject.playerLife > 100) {
        modules.playerObject.playerLife = 100;
    }
    else if (!modules.playerObject.playerLife) {
        modules.playerObject.playerLife = 0;
    }
}





















/* Battery Status and User Life Nation*/














class BatteryStatusGreen {
    static batteryLevelClr () {
        if (modules.playerObject.playerLife < 90 && modules.playerObject.playerLife >= 70) {
            modules.playerObject.batteryStatus = 'rgb(1, 220, 1)';
        }
    }
}

class BatteryStatusOrange {
    static batteryLevelClr () {
        if (modules.playerObject.playerLife < 70 && modules.playerObject.playerLife >= 50) {
            modules.playerObject.batteryStatus = 'orange';
        }
    }
}

class BatteryStatusRed {
    static batteryLevelClr () {
        if (modules.playerObject.playerLife < 50) {
            modules.playerObject.batteryStatus = 'red';
        }
    }
}

const batteryStatusClrs = [BatteryStatusGreen,BatteryStatusOrange,BatteryStatusRed];

function batteryStatusClrChangerFn () {
    batteryStatusClrs.forEach (BatteryStatusClass => {
        BatteryStatusClass.batteryLevelClr()
    })
}

function lifeDeduction (playerLife) {
    const randomLifeReduce = [15,20,25,30];
    const userLife = playerLife - randomLifeReduce[Math.floor(Math.random() * randomLifeReduce.length)]
    if (userLife <= 0) {
        return 0;
    }
    return userLife;
}

function lifeAddition () {
    const lifeAdditionArr = [5,10,15,20];
    return lifeAdditionArr[Math.floor(Math.random() * lifeAdditionArr.length)];
}

























/* Enemy's nation*/
/* Gun Nation*/












let halfCircle1,halfCircle2,halfCircle3,halfCircle4,gunMouth1,gunMouth2,gunMouth3,gunMouth4,gunWord1,gunWord2,gunWord3,gunWord4,shot1,shot2,shot3,shot4;

class Gun {
    constructor () {
        this.color = 'black'
        this.endYPoint = 80;
        this.flashBack = -70;
        this.initialPoint = -100;
        this.direction = 1;
        this.y_axis = this.initialPoint;
        this.radius = 55;
    }
}

class HalfCircleGun extends Gun {
    constructor (x_axis) {
        super();
        this.x_axis = x_axis;
        this.isMovingUp = false;
        this.isMovingDown = true;
    }
}

class GunMouth extends Gun {
    constructor (width,height,x_axis,y_axis) {
        super();
        this.width = width;
        this.height = height;
        this.x_axis = x_axis;
        this.y_axis = y_axis;
    }
}

class GunWord {
    constructor (word,x_axis,y_axis) {
        this.color = 'transparent';
        this.word = word;
        this.font = '23px verdana';
        this.isMoving = false;
        this.x_axis = x_axis;
        this.y_axis = y_axis;
    }
}

class Shots {
    constructor (x_axis,y_axis) {
        this.x_axis = x_axis;
        this.y_axis = y_axis;
        this.width = 180;
        this.height = 20;
        this.color = 'transparent';
        this.isMoving = false;
    }
}

function gunSpeedProp (upOrDown) {
    this.y_axis += (0.5 * upOrDown);
}

function shotsSpeedProp () {
    this.y_axis += 10;
}

function createHalfCircleGunPart () {
    halfCircle1 = new HalfCircleGun (200);
    halfCircle2 = new HalfCircleGun ((halfCircle1.x_axis) + 300);
    halfCircle3 = new HalfCircleGun (pageWidth*0.6)
    halfCircle4 = new HalfCircleGun (pageWidth*0.6 + 300)
    halfCircle1.speedY = gunSpeedProp;
    halfCircle2.speedY = gunSpeedProp;
    halfCircle3.speedY = gunSpeedProp;
    halfCircle4.speedY = gunSpeedProp;
}
createHalfCircleGunPart();

function createGunMouthGunPart () {
    const width = 40,height = 30;
    gunMouth1 = new GunMouth (width,height,halfCircle1.x_axis - (width/2),halfCircle1.y_axis + (halfCircle1.radius * 0.75));
    gunMouth2 = new GunMouth (width,height,halfCircle2.x_axis - (width/2),halfCircle2.y_axis + (halfCircle2.radius * 0.75));
    gunMouth3 = new GunMouth (width,height,halfCircle3.x_axis - (width/2),halfCircle3.y_axis + (halfCircle3.radius * 0.75));
    gunMouth4 = new GunMouth (width,height,halfCircle4.x_axis - (width/2),halfCircle4.y_axis + (halfCircle4.radius * 0.75));
    gunMouth1.speedY = gunSpeedProp;
    gunMouth2.speedY = gunSpeedProp;
    gunMouth3.speedY = gunSpeedProp;
    gunMouth4.speedY = gunSpeedProp;
}
createGunMouthGunPart();

function createGunWordGunPart () {
    const gapX = 15,gapY = 30;
    gunWord1 = new GunWord ('RANGO',(halfCircle1.x_axis - halfCircle1.radius) + gapX,halfCircle1.y_axis + gapY);
    gunWord2 = new GunWord ('SHOT!',(halfCircle2.x_axis - halfCircle2.radius) + gapX,halfCircle2.y_axis + gapY);
    gunWord3 = new GunWord ('BOOST',(halfCircle3.x_axis - halfCircle3.radius) + gapX,halfCircle3.y_axis + gapY);
    gunWord4 = new GunWord ('BLOOD',(halfCircle4.x_axis - halfCircle4.radius) + gapX,halfCircle4.y_axis + gapY);
    gunWord1.speedY = gunSpeedProp;
    gunWord2.speedY = gunSpeedProp;
    gunWord3.speedY = gunSpeedProp;
    gunWord4.speedY = gunSpeedProp;
}
createGunWordGunPart();

function createShotsGunParts () {
    shot1 = new Shots (halfCircle1.x_axis - (halfCircle1.radius * 1.6),gunMouth1.y_axis + gunMouth1.height);
    shot2 = new Shots (halfCircle2.x_axis - (halfCircle2.radius * 1.6),gunMouth2.y_axis + gunMouth2.height);
    shot3 = new Shots (halfCircle3.x_axis - (halfCircle3.radius * 1.6),gunMouth3.y_axis + gunMouth3.height);
    shot4 = new Shots (halfCircle4.x_axis - (halfCircle4.radius * 1.6),gunMouth4.y_axis + gunMouth4.height)
    shot1.speedY = gunSpeedProp;
    shot2.speedY = gunSpeedProp;
    shot3.speedY = gunSpeedProp;
    shot4.speedY = gunSpeedProp;
    shot1.speedShot = shotsSpeedProp;
    shot2.speedShot = shotsSpeedProp;
    shot3.speedShot = shotsSpeedProp;
    shot4.speedShot = shotsSpeedProp;
}
createShotsGunParts();


function drawHalfCircleGunPart (color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(halfCircle1.x_axis,halfCircle1.y_axis,halfCircle1.radius,0,Math.PI,false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(halfCircle2.x_axis,halfCircle2.y_axis,halfCircle2.radius,0,Math.PI,false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(halfCircle3.x_axis,halfCircle3.y_axis,halfCircle3.radius,0,Math.PI,false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(halfCircle4.x_axis,halfCircle4.y_axis,halfCircle4.radius,0,Math.PI,false);
    ctx.fill();
    ctx.closePath();
}

function drawGunMouthGunPart (color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(gunMouth1.x_axis,gunMouth1.y_axis,gunMouth1.width,gunMouth1.height);
    ctx.fillRect(gunMouth2.x_axis,gunMouth2.y_axis,gunMouth2.width,gunMouth2.height);
    ctx.fillRect(gunMouth3.x_axis,gunMouth3.y_axis,gunMouth3.width,gunMouth3.height);
    ctx.fillRect(gunMouth4.x_axis,gunMouth4.y_axis,gunMouth4.width,gunMouth4.height);
    ctx.closePath();
}

function writeGunWordGunPart (color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = gunWord1.font;
    ctx.fillText (gunWord1.word,gunWord1.x_axis,gunWord1.y_axis);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillText (gunWord2.word,gunWord2.x_axis,gunWord2.y_axis);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillText (gunWord3.word,gunWord3.x_axis,gunWord3.y_axis);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillText (gunWord4.word,gunWord4.x_axis,gunWord4.y_axis);
    ctx.closePath();
}

function drawShotsGunParts (color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(shot1.x_axis,shot1.y_axis,shot1.width,shot1.height);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillRect(shot2.x_axis,shot2.y_axis,shot2.width,shot2.height);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillRect(shot3.x_axis,shot3.y_axis,shot3.width,shot3.height);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillRect(shot4.x_axis,shot4.y_axis,shot4.width,shot4.height);
    ctx.closePath();
}

function gunCoordinatesUpdate () {
    if (halfCircle1.isMovingDown || halfCircle1.isMovingUp) {
        halfCircle1.speedY(halfCircle1.direction);
        halfCircle2.speedY(halfCircle1.direction);
        halfCircle3.speedY(halfCircle1.direction);
        halfCircle4.speedY(halfCircle1.direction);
        gunMouth1.speedY(halfCircle1.direction);
        gunMouth2.speedY(halfCircle1.direction);
        gunMouth3.speedY(halfCircle1.direction);
        gunMouth4.speedY(halfCircle1.direction);
        gunWord1.speedY(halfCircle1.direction);
        gunWord2.speedY(halfCircle1.direction);
        gunWord3.speedY(halfCircle1.direction);
        gunWord4.speedY(halfCircle1.direction);
        shot1.speedY(halfCircle1.direction);
        shot2.speedY(halfCircle1.direction);
        shot3.speedY(halfCircle1.direction);
        shot4.speedY(halfCircle1.direction);
    }
}

function gunReachedShotPosition () {
    if (halfCircle1.y_axis >= halfCircle1.endYPoint && halfCircle1.isMovingDown) {
        gunShotPositionPreparation();
    }
}

function gunShotPositionPreparation () {
    setIsMovingDownPropertyOff();
    changeColorOfGunPartsToBrown();
    setTheShotsToBeShot();
    shotTheShots();
}

function setIsMovingDownPropertyOff () {
    halfCircle1.isMovingDown = false;
}



function changeColorOfGunPartsToBrown () {
    gunSetTimeoutRef1 = setTimeout(changeColorOfGunPartsToBrownRef,3000);
}

function changeColorOfGunPartsToBrownRef () {
    halfCircle1.color = 'rgb(73, 24, 0)';
    halfCircle2.color = 'rgb(73, 24, 0)';
    halfCircle3.color = 'rgb(73, 24, 0)';
    halfCircle4.color = 'rgb(73, 24, 0)';
    gunMouth1.color = 'rgb(73, 24, 0)';
    gunMouth2.color = 'rgb(73, 24, 0)';
    gunMouth3.color = 'rgb(73, 24, 0)';
    gunMouth4.color = 'rgb(73, 24, 0)';
    gunWord1.color = 'white';
    gunWord2.color = 'white';
    gunWord3.color = 'white';
    gunWord4.color = 'white';
    shot1.color = 'rgb(73, 24, 0)';
    shot2.color = 'rgb(73, 24, 0)';
    shot3.color = 'rgb(73, 24, 0)';
    shot4.color = 'rgb(73, 24, 0)';
}

function setTheShotsToBeShot () {
    gunSetTimeoutRef2 = setTimeout(setTheShotsToBeShotRef,5000);
}

function setTheShotsToBeShotRef () {
    shot1.isMoving = true;
    shot2.isMoving = true;
    shot3.isMoving = true;
    shot4.isMoving = true;
}

function shotTheShots () {
    if (shot1.isMoving) {
        checkIfShotsAreInBoundaries();
        checkForShotsAndBallCollision();
        shot1.speedShot();
        shot2.speedShot();
        shot3.speedShot();
        shot4.speedShot();
    }
}

function checkIfShotsAreInBoundaries () {
    if (pageHeight - (shot1.y_axis + (shot1.height)) <= 0) {
        shot1.isMoving = false;
        returnGunToTheDestination();
    }
}

function checkForShotsAndBallCollision () {
    if (((ball.y_axis - ball.radius) - (shot1.y_axis + shot1.height) <= 0 &&
        (ball.y_axis - ball.radius) - (shot1.y_axis + shot1.height) > -15 &&
        shot1.x_axis <= (ball.x_axis + ball.radius) &&
        shot1.x_axis + shot1.width >= ball.x_axis - ball.radius) || 
        ((ball.y_axis - ball.radius) - (shot2.y_axis + shot2.height) <= 0 &&
        (ball.y_axis - ball.radius) - (shot2.y_axis + shot2.height) > -15 &&
        shot2.x_axis <= (ball.x_axis + ball.radius) &&
        shot2.x_axis + shot2.width >= ball.x_axis - ball.radius) ||
        ((ball.y_axis - ball.radius) - (shot3.y_axis + shot3.height) <= 0 &&
        (ball.y_axis - ball.radius) - (shot3.y_axis + shot3.height) > -15 &&
        shot3.x_axis <= (ball.x_axis + ball.radius) &&
        shot3.x_axis + shot3.width >= ball.x_axis - ball.radius) ||
        ((ball.y_axis - ball.radius) - (shot4.y_axis + shot4.height) <= 0 &&
        (ball.y_axis - ball.radius) - (shot4.y_axis + shot4.height) > -15 &&
        shot4.x_axis <= (ball.x_axis + ball.radius) &&
        shot4.x_axis + shot4.width >= ball.x_axis - ball.radius))
    {
        enemyCollision ();
    }
}

function enemyCollision () {
    modules.playerObject.playerLife = lifeDeduction(modules.playerObject.playerLife);
    batteryStatusClrChangerFn();
    if (!modules.playerObject.playerLife) {
        restartGameAfterLoss();
    }
}

function returnGunToTheDestination () {
    changeColorOfGunPartsToBlue();
    setTheGunToMoveUp();
}

function changeColorOfGunPartsToBlue () {
    gunSetTimeoutRef3 = setTimeout (changeColorOfGunPartsToBlueRef,3000);
}

function changeColorOfGunPartsToBlueRef () {
    halfCircle1.color = 'black';
    halfCircle2.color = 'black';
    halfCircle3.color = 'black';
    halfCircle4.color = 'black';
    gunMouth1.color = 'black';
    gunMouth2.color = 'black';
    gunMouth3.color = 'black';
    gunMouth4.color = 'black';
    gunWord1.color = 'transparent';
    gunWord2.color = 'transparent';
    gunWord3.color = 'transparent';
    gunWord4.color = 'transparent';
    setShotsToTransparent ();
}

function setShotsToTransparent () {
    shot1.color = 'transparent';
    shot2.color = 'transparent';
    shot3.color = 'transparent';
    shot4.color = 'transparent';
}

function setTheGunToMoveUp () {
    gunSetTimeoutRef4 = setTimeout (setTheGunToMoveUpRef,3000);
}

function setTheGunToMoveUpRef () {
    halfCircle1.isMovingUp = true;
    halfCircle1.direction = -1;
}

function gunReachedFlashBackPosition () {
    if (halfCircle1.y_axis <= halfCircle1.flashBack && halfCircle1.isMovingUp) {
        returnGunBackToInitialPoint();
        getGunBackOnShotPosition();
    }
}

function returnGunBackToInitialPoint () {
    const gapX = 15,gapY = 30,width = 40,height = 30;
    halfCircle1.isMovingUp = false;
    halfCircle1.y_axis = halfCircle1.initialPoint;
    halfCircle2.y_axis = halfCircle2.initialPoint;
    halfCircle3.y_axis = halfCircle3.initialPoint;
    halfCircle4.y_axis = halfCircle4.initialPoint;
    halfCircle1.x_axis = (200);
    halfCircle2.x_axis = ((halfCircle1.x_axis) + 300);
    halfCircle3.x_axis = (pageWidth*0.6)
    halfCircle4.x_axis = (pageWidth*0.6 + 300)
    
    gunMouth1.x_axis = halfCircle1.x_axis - (width/2);
    gunMouth1.y_axis = halfCircle1.y_axis + (halfCircle1.radius * 0.75);
    gunMouth2.x_axis = halfCircle2.x_axis - (width/2);
    gunMouth2.y_axis = halfCircle2.y_axis + (halfCircle2.radius * 0.75);
    gunMouth3.x_axis = halfCircle3.x_axis - (width/2);
    gunMouth3.y_axis = halfCircle3.y_axis + (halfCircle3.radius * 0.75);
    gunMouth4.x_axis = halfCircle4.x_axis - (width/2);
    gunMouth4.y_axis = halfCircle4.y_axis + (halfCircle4.radius * 0.75);
    
    gunWord1.x_axis = (halfCircle1.x_axis - halfCircle1.radius) + gapX;
    gunWord1.y_axis = halfCircle1.y_axis + gapY;
    gunWord2.x_axis = (halfCircle2.x_axis - halfCircle2.radius) + gapX;
    gunWord2.y_axis= halfCircle2.y_axis + gapY;
    gunWord3.x_axis = (halfCircle3.x_axis - halfCircle3.radius) + gapX;
    gunWord3.y_axis = halfCircle3.y_axis + gapY;
    gunWord4.x_axis = (halfCircle4.x_axis - halfCircle4.radius) + gapX;
    gunWord4.y_axis = halfCircle4.y_axis + gapY;



    shot1.x_axis = halfCircle1.x_axis - (halfCircle1.radius * 1.6);
    shot1.y_axis = gunMouth1.y_axis + gunMouth1.height;
    shot2.x_axis = halfCircle2.x_axis - (halfCircle2.radius * 1.6);
    shot2.y_axis = gunMouth2.y_axis + gunMouth2.height;
    shot3.x_axis = halfCircle3.x_axis - (halfCircle3.radius * 1.6);
    shot3.y_axis = gunMouth3.y_axis + gunMouth3.height;
    shot4.x_axis = halfCircle4.x_axis - (halfCircle4.radius * 1.6);
    shot4.y_axis = gunMouth4.y_axis + gunMouth4.height;
}

function getGunBackOnShotPosition () {
    const tempsMort = [4000,6000];
    gunSetTimeoutRef5 = setTimeout(getGunBackOnShotRef, tempsMort[Math.floor(Math.random() * tempsMort.length)]);
}

function getGunBackOnShotRef () {
    halfCircle1.isMovingDown = true;
    halfCircle1.direction = 1;

}


























/*Enemy Boda*/

let canUserBeAsked = true;
let clearIntervalForQuestionAsked,countSecForUserToAnswer,currentClassAskedFrom,userCanAnswer;


class EnemyBodaParent {
    constructor() {
        this.initialPoint = pageWidth * 1.2;
        this.userWins = pageWidth * 1.4;
        this.x_axis = this.initialPoint;
        this.endXPoint = 100;
        this.isMovingLeft = true;
        this.isMovingRight = false;
        this.speedX = 1;
        this.direction = -1;
        this.colorArray = ['rgb(32, 0, 74)','rgb(103, 58, 0)','rgb(67, 72, 0)','rgb(23, 70, 0)','rgb(0, 51, 59)','rgb(54, 37, 0)'];
        this.color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    }
}
 
class leftEnemyBoda extends EnemyBodaParent {
    constructor (y_axis) {
        super();
        this.y_axis = y_axis;
        this.side = 1;
    }
}

class rightEnemyBoda extends EnemyBodaParent {
    constructor (y_axis) {
        super();
        this.y_axis = y_axis;
        this.side = -1;
    }
}



const enemyBodaArr = [];
let enemyBoda;

function drawEnemyBodaProp () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(this.x_axis + (50*this.direction),this.y_axis);
    ctx.lineTo(this.x_axis,this.y_axis + (80 * this.side));
    ctx.lineTo(this.x_axis + (100*this.direction),this.y_axis);
    ctx.fill();
    ctx.closePath();
}

function moveEnemyBorder (direction) {
    this.x_axis += this.speedX * direction;
}

function createEnemyLeftBorder () {
    let y_axis = 210;

    while (y_axis < (pageHeight - 100)) {
        enemyBoda =  new leftEnemyBoda(y_axis);
        enemyBoda.draw = drawEnemyBodaProp;
        enemyBoda.move = moveEnemyBorder;
        enemyBodaArr.push(enemyBoda);
        y_axis += 80;
    }
}

function createRightEnemyBorder () {
    let y_axis = 210;

    while (y_axis < (pageHeight - 100)) {
        enemyBoda =  new rightEnemyBoda(y_axis);
        enemyBoda.draw = drawEnemyBodaProp;
        enemyBoda.move = moveEnemyBorder;
        enemyBodaArr.push(enemyBoda);
        y_axis += 80;
    }
}

createEnemyLeftBorder ();
createRightEnemyBorder ();


function drawEnemyBodaFn () {
    enemyBodaArr.forEach (enemyBoda => {
        enemyBoda.draw();
 
    })
}

function moveEnemyBodaToLeftFn () {
    enemyBodaArr.forEach (enemyBoda => {
        if (enemyBoda.isMovingLeft) {
            enemyBoda.move(enemyBoda.direction);
            checkEnemyLeftBorderBoundaries(enemyBoda);
        }
    })
}

function moveEnemyBodaToRightFn () {
    enemyBodaArr.forEach (enemyBoda => {
        if (enemyBoda.isMovingRight) {
            enemyBoda.move(enemyBoda.direction);
            checkEnemyRightBorderBoundaries(enemyBoda);
        }
    })
}

function checkEnemyLeftBorderBoundaries (enemyBoda) {
    if (enemyBoda.x_axis <= enemyBoda.endXPoint && enemyBoda.isMovingLeft) {
        changeEnemyBorderDirectionFn (enemyBoda);
    }
}

function checkEnemyRightBorderBoundaries (enemyBoda) {
    if (enemyBoda.x_axis > enemyBoda.initialPoint && enemyBoda.isMovingRight) {
        changeEnemyBorderDirectionFn (enemyBoda);
    }
}

function changeEnemyBorderDirectionFn (enemyBoda) {
    enemyBoda.isMovingLeft = !enemyBoda.isMovingLeft;
    enemyBoda.isMovingRight = !enemyBoda.isMovingRight;
    enemyBoda.direction *= -1;
}

function returnEnemyBodaToInitialPoint () {
    questionAnswer.style.visibility = 'hidden';
    enemyBodaArr.forEach(enemyBoda => {
        enemyBoda.x_axis = enemyBoda.initialPoint;
    })
}

function returnEnemyBodaFarAway () {
    questionAnswer.style.visibility = 'hidden';
    enemyBodaArr.forEach(enemyBoda => {
        enemyBoda.x_axis = enemyBoda.userWins;
    }) 
}

function enemyBodaAndBallCollision () {

    if ((enemyBodaArr[0].x_axis - (ball.x_axis + ball.radius) >= 0 && 
        (enemyBodaArr[0].x_axis - (ball.x_axis + ball.radius) < 3)) && 
        enemyBodaArr[0].isMovingLeft ||
        (enemyBodaArr[0].x_axis - (ball.x_axis - ball.radius) <= 0 &&
        (enemyBodaArr[0].x_axis - (ball.x_axis - ball.radius)) > -3) && 
        enemyBodaArr[0].isMovingRight) 
    {
        enemyCollision();
    }
}














/*Weapon to kill enemy Boda*/

/* All keyBoard Events*/

class GeneralMathematics {
    
    static key;

    static questions = 
    [
        {
          question: "2x + 5 = 15",
          answers: ["(1) 'x = 2'", "(2) 'x = 5'", "(3) 'x = 10'"],
          correctAnswer: "3",
        },
        {
          question: "Solve: x² = 49",
          answers: ["(1) 'x = 9'", "(2) 'x = 5'", "(3) 'x = 7'"],
          correctAnswer: "3",
        },
        {
          question: "What's √81 + √16?",
          answers: ["(1) '15'", "(2) '13'", "(3) '20'"],
          correctAnswer: "2",
        },
        {
          question: "Area of triangle formula?",
          answers: ["(1) '½ × base × height'", "(2) 'base + height'", "(3) 'base ÷ height'"],
          correctAnswer: "1",
        },
        {
          question: "Simplify: 7x ÷ 7",
          answers: ["(1) 'x'", "(2) '3x'", "(3) '7x'"],
          correctAnswer: "1",
        },
        {
          question: "Cube root of 27?",
          answers: ["(1) '9'", "(2) '3'", "(3) '6'"],
          correctAnswer: "2",
        },
        {
          question: "Solve: 12x = 36",
          answers: ["(1) 'x = 6'", "(2) 'x = 4'", "(3) 'x = 3'"],
          correctAnswer: "3",
        },
        {
          question: "Calculate: 9 / 1 + 0",
          answers: ["(1) 'ERROR'", "(2) '1'", "(3) '9'"],
          correctAnswer: "3",
        },
        {
          question: "Calculate: 9 / 0 + 1",
          answers: ["(1) 'ERROR'", "(2) '9'", "(3) '1'"],
          correctAnswer: "1",
        },
        {
          question: "Calculate: 2 × 2 - 2",
          answers: ["(1) '0'", "(2) '2'", "(3) '4'"],
          correctAnswer: "2",
        },
        {
            question: "Solve: 2 × 2 + 7",
            answers: ["(1) '11'", "(2) '13'", "(3) 'None'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: 2 × (2 + 7)",
            answers: ["(1) '18'", "(2) '20'", "(3) '14'"],
            correctAnswer: "2",
        },
        {
            question: "What is 9 ÷ 0?",
            answers: ["(1) 'Undefined'", "(2) 'Zero'", "(3) 'Infinite'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: 12 ÷ (4 × 3)",
            answers: ["(1) '1'", "(2) '2'", "(3) 'None'"],
            correctAnswer: "1",
        },
        {
            question: "What is (18 – 3 × 4) ÷ 3?",
            answers: ["(1) ''None'", "(2) '4'", "(3) 2"],
            correctAnswer: "3",
        },
        {
            question: "What is 100 ÷ 4?",
            answers: ["(1) '50'", "(2) '20'", "(3) '25'"],
            correctAnswer: "3",
        },
        {
            question: "What’s the value of 3 × 9?",
            answers: ["(1) '27'", "(2) '36'", "(3) '24'"],
            correctAnswer: "1",
        },
        {
            question: "How many degrees are in a circle?",
            answers: ["(1) '360'", "(2) '180'", "(3) '90'"],
            correctAnswer: "1",
        },
        {
            question: "What’s 20% of 150?",
            answers: ["(1) '300'", "(2) '50'", "(3) '30'"],
            correctAnswer: "3",
        },
        {
            question: "Solve: 7 + 7 ÷ 7",
            answers: ["(1) '9'", "(2) '7'", "(3) '8'"],
            correctAnswer: "3",
        },
        {
            question: "What is 10 cubed?",
            answers: ["(1) '1'", "(2) '100'", "(3) '1000'"],
            correctAnswer: "3",
        },
        {
            question: "Solve: 5 × (3 + 2)",
            answers: ["(1) '20'", "(2) '25'", "(3) '15'"],
            correctAnswer: "2",
        },
        {
            question: "What’s the perimeter of a square with side length 4?",
            answers: ["(1) '20'", "(2) '12'", "(3) '16'"],
            correctAnswer: "3",
        },
        {
            question: "What is the square of 9?",
            answers: ["(1) '18'", "(2) '81'", "(3) '27'"],
            correctAnswer: "2",
        },
        {
            question: "What’s 50% of 80?",
            answers: ["(1) '50'", "(2) '40'", "(3) '80'"],
            correctAnswer: "2",
        },
        {
            question: "What is 7²?",
            answers: ["(1) 'None'", "(2) '49'", "(3) '42'"],
            correctAnswer: "2",
        },
        {
            question: "Solve: (15 + 5) × (10 ÷ 2)",
            answers: ["(1) '200'", "(2) '100'", "(3) '150'"],
            correctAnswer: "2",
        },
        {
            question: "Solve: (15 + 5) × (10 ÷ 1)",
            answers: ["(1) '144'", "(2) '100'", "(3) '200'"],
            correctAnswer: "3",
        },
        {
            question: "Solve: 3 × (7 + 2) ÷ 9",
            answers: ["(1) 'None'", "(2) '1'", "(3) '9'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: (4 + 3 × 2) ÷ 5",
            answers: ["(1) '2'", "(2) '3'", "(3) 'None'"],
            correctAnswer: "3",
        },
        {
            question: "Solve: 3 × (7 + 2) ÷ 9",
            answers: ["(1) '18'", "(2) '3'", "(3) '27'"],
            correctAnswer: "2",
        },
        {
            question: "What is the volume of a cube with side length 6?",
            answers: ["(1) '216'", "(2) '36'", "(3) '64'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: 40 ÷ (8 + 2)",
            answers: ["(1) '4'", "(2) '8'", "(3) 'None'"],
            correctAnswer: "1",
        },
        {
            question: "What is the area of a circle with radius 7?",
            answers: ["(1) '44'", "(2) '49'", "(3) '154'"],
            correctAnswer: "3",
        },
        {
            question: "How many feet are in a mile?",
            answers: ["(1) '5280'", "(2) '1000'", "(3) '1600'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: 9² ÷ (3 × 3)",
            answers: ["(1) '9'", "(2) '27'", "(3) '81'"],
            correctAnswer: "1",
        },
        {
            question: "What is 15 × 8?",
            answers: ["(1) '130'", "(2) '120'", "(3) 'None'"],
            correctAnswer: "2",
        },
        {
            question: "Solve: (25 ÷ 5) × (3 × 2)",
            answers: ["(1) '30'", "(2) '25'", "(3) '10'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: (18 ÷ 3) × 2 – 4",
            answers: ["(1) '8'", "(2) '10'", "(3) '6'"],
            correctAnswer: "1",
        },
        {
            question: "Solve: 3² × (4 ÷ 2)",
            answers: ["(1) '18'", "(2) '12'", "(3) '24'"],
            correctAnswer: "1",
        }
    ]
      
}

class GeneralKnowledge {

    static key;

    static questions = 
    [
        {
          question: "Language spoken by many natives?",
          answers: ["(1) 'English'", "(2) 'Spanish'", "(3) 'Chinese'"],
          correctAnswer: "3",
        },
        {
          question: "Largest planet?",
          answers: ["(1) 'Saturn'", "(2) 'Jupiter'", "(3) 'Earth'"],
          correctAnswer: "2",
        },
        {
          question: "Who invented gravity?",
          answers: ["(1) 'Galileo'", "(2) 'Albert Einstein'", "(3) 'Isaac Newton'"],
          correctAnswer: "3",
        },
        {
          question: "Fastest animal?",
          answers: ["(1) 'Falcon'", "(2) 'Cheetah'", "(3) 'Horse'"],
          correctAnswer: "2",
        },
        {
          question: "What is a millennium",
          answers: ["(1) '10000 years'", "(2) '100 years'", "(3) '1000 years'"],
          correctAnswer: "3",
        },
        {
          question: "Founder of Amazon?",
          answers: ["(1) 'Mark Zuckerberg'", "(2) 'Jeff Bezos'", "(3) 'Steve Jobs'"],
          correctAnswer: "2",
        },
        {
          question: "What's Wi-Fi?",
          answers: ["(1) 'Wireless internet'", "(2) 'Wired internet'", "(3) 'Digital file'"],
          correctAnswer: "1",
        },
        {
          question: "What is IX in numbers?",
          answers: ["(1) '1'", "(2) '19'", "(3) '9'"],
          correctAnswer: "3",
        },
        {
          question: "Which one comes first: 'Christmas' or 'Happy New Year'",
          answers: ["(1) 'Christmas'", "(2) 'Happy New Year'"],
          correctAnswer: "2",
        },
        {
          question: "Symbol for water?",
          answers: ["(1) 'CO₂ '", "(2) 'O₂'", "(3) 'H₂O'"],
          correctAnswer: "3",
        },
        {
            question: "Which city is known for Big Ben?",
            answers: ["(1) 'Paris'", "(2) 'London'", "(3) 'Rome'"],
            correctAnswer: "2",
        },
        {
            question: "Who painted the Mona Lisa?",
            answers: ["(1) 'Michelangelo'", "(2) 'Leonardo da Vinci'", "(3) 'Vincent van Gogh'"],
            correctAnswer: "2",
        },
        {
            question: "What is the capital of Japan?",
            answers: ["(1) 'Tokyo'", "(2) 'Beijing'", "(3) 'Seoul'"],
            correctAnswer: "1",
        },
        {
            question: "Who invented the lightbulb?",
            answers: ["(1) 'Nikola Tesla'", "(2) 'Benjamin Franklin'", "(3) 'Thomas Edison '"],
            correctAnswer: "3",
        },
        {
            question: "What is the longest river in the world?",
            answers: ["(1) 'Amazon'", "(2) 'Nile'", "(3) 'Yangtze'"],
            correctAnswer: "2",
        },
        {
            question: "What is the currency of the USA?",
            answers: ["(1) 'Euro'", "(2) 'Pound'", "(3) 'Dollar'"],
            correctAnswer: "3", 
        },
        {
            question: "Who is the author of Harry Potter?",
            answers: ["(1) 'J.R.R. Tolkien'", "(2) 'J.K. Rowling'", "(3) 'George R.R. Martin'"],
            correctAnswer: "2",
        },
        {
            question: "What year did World War I end?",
            answers: ["(1) '1914'", "(2) '1939'", "(3) '1918'"],
            correctAnswer: "3", 
        },
        {
            question: "What is the capital of Australia?",
            answers: ["(1) 'Sydney'", "(2) 'Melbourne'", "(3) 'Canberra'"],
            correctAnswer: "3",
        },
        {
            question: "Who wrote 1984?",
            answers: ["(1) 'George Orwell'", "(2) 'Aldous Huxley'", "(3) 'Ray Bradbury'"],
            correctAnswer: "1",
        },
        {
            question: "What is Africa by land area?",
            answers: ["(1) 'DRC'", "(2) 'Sudan'", "(3) 'Algeria'"],
            correctAnswer: "3",
        },
        {
            question: "What is the capital of Canada?",
            answers: ["(1) 'Toronto'", "(2) 'Montreal'", "(3) 'Ottawa'"],
            correctAnswer: "2",
        },
        {
            question: "What’s the hardest natural substance on Earth?",
            answers: ["(1) 'Gold'", "(2) 'Iron'", "(3) 'Diamond'"],
            correctAnswer: "3",
        },
        {
            question: "Who discovered penicillin?",
            answers: ["(1) 'Alexander Fleming'", "(2) 'Marie Curie'", "(3) 'Isaac Newton'"],
            correctAnswer: "1",
        },
        {
            question: "Who was the first man on the moon?",
            answers: ["(1) 'Shimwa Benjamin'", "(2) 'Buzz Aldrin'", "(3) 'Neil Armstrong'"],
            correctAnswer: "3", 
        },
        {
            question: "What is the horn of Africa?",
            answers: ["(1) 'South Africa'", "(2) 'Egypt'", "(3) 'Somalia'"],
            correctAnswer: "3",
        },
        {
            question: "What’s the largest continent by population?",
            answers: ["(1) 'Europe'", "(2) 'Asia'", "(3) 'Africa'"],
            correctAnswer: "2",
        },
        {
            question: "Who invented the airplane?",
            answers: ["(1) 'Wright Brothers'", "(2) 'Leonardo da Vinci'", "(3) 'Henry Ford'"],
            correctAnswer: "1",
        },
        {
            question: "What is the heart of Africa?",
            answers: ["(1) 'Botswana'", "(2) 'Cameroun'", "(3) 'Rwanda'"],
            correctAnswer: "3",
        },
        {
            question: "What is the tallest mountain on Earth?",
            answers: ["(1) 'Mount Everest'", "(2) 'K2'", "(3) 'Kilimanjaro'"],
            correctAnswer: "1",
        },
        {
            question: "Which planet is known as the Red Planet?",
            answers: ["(1) 'Venus'", "(2) 'Mars'", "(3) 'Jupiter'"],
            correctAnswer: "2",
        },
        {
            question: "Who is the founder of Microsoft?",
            answers: ["(1) 'Mark Zuckerberg'", "(2) 'Steve Jobs'", "(3) ' Bill Gates'"],
            correctAnswer: "1",
        },
        {
            question: "Who is considered the first programmer?",
            answers: ["(1) 'Steve Gates'", "(2) 'Mark Zuckerberg'", "(3) ' Ada Lovelace'"],
            correctAnswer: "3",
        },
            {
            question: "What is the capital of Italy?",
            answers: ["(1) 'Venice'", "(2) 'Rome'", "(3) 'Florence'"],
            correctAnswer: "2", 
        },
        {
            question: "What is the capital of Russia?",
            answers: ["(1) 'St. Petersburg'", "(2) 'Beijing'", "(3) 'None'"],
            correctAnswer: "3",
        },
        {
            question: "What’s the biggest ocean in the world?",
            answers: ["(1) 'Atlantic'", "(2) 'Pacific'", "(3) 'Indian'"],
            correctAnswer: "2", 
        },
        {
            question: "Who is known for the theory of relativity?",
            answers: ["(1) 'Isaac Newton'", "(2) 'Nikola Tesla'", "(3) 'Albert Einstein'"],
            correctAnswer: "3", 
        },
        {
            question: "What is the smallest country in Africa?",
            answers: ["(1) 'Rwanda'", "(2) 'Comoros'", "(3) 'Seychelles'"],
            correctAnswer: "3",
        },
        {
            question: "What is the national sport of Rwanda?",
            answers: ["(1) 'Les lions'", "(2) 'Amavubi'", "(3) 'The goats'"],
            correctAnswer: "2", 
        },
        {
            question: "Which rap song is considered the first hip-hop single?",
            answers: ["(1) 'Rapper's Delight'", "(2) 'The Message'", "(3) 'Fight the Power'"],
            correctAnswer: "1", 
        },
    ]
      
}

class GeneralHistory {

    static key;

    static questions = 
    [
        {
          question: "Year WWI started?",
          answers: ["(1) '1900'", "(2) '1939'", "(3) '1914'"],
          correctAnswer: "3",
        },
        {
          question: "Who was Napoleon?",
          answers: ["(1) 'British general'", "(2) 'Russian king'", "(3) 'French emperor'"],
          correctAnswer: "3",
        },
        {
          question: "First US president?",
          answers: ["(1) 'Abraham Lincoln'", "(2) 'George Washington'", "(3) 'Thomas Jefferson'"],
          correctAnswer: "2",
        },
        {
          question: "Who was Hitler?",
          answers: ["(1) 'Germany general'", "(2) 'Russian dictator'", "(3) 'Germany president'"],
          correctAnswer: "3",
        },
        {
          question: "Country colonized India?",
          answers: ["(1) 'Britain'", "(2) 'France'", "(3) 'Spain'"],
          correctAnswer: "1",
        },
        {
          question: "Where's the Great Wall?",
          answers: ["(1) 'China'", "(2) 'None'", "(3) 'Korea'"],
          correctAnswer: "1",
        },
        {
          question: "Who discovered America?",
          answers: ["(1) 'Vasco da Gama'", "(2) 'Christopher Columbus'", "(3) 'Ferdinand Magellan'"],
          correctAnswer: "2",
        },
        {
          question: "Berlin Wall fell when?",
          answers: ["(1) '1995'", "(2) 'None'", "(3) '2000'"],
          correctAnswer: "2",
        },
        {
          question: "Empire of Julius Caesar?",
          answers: ["(1) 'Ottoman'", "(2) 'Roman'", "(3) 'Greek'"],
          correctAnswer: "2",
        },
        {
          question: "Year slavery abolished?",
          answers: ["(1) '1865'", "(2) '1800'", "(3) '1900'"],
          correctAnswer: "1",
        },
        {
            question: "Who was the first person to write an algorithm?",
            answers: ["(1) 'Bill Gates'", "(2) 'Terry Davis'", "(3) 'Ada Loverace'"],
            correctAnswer: "3", 
        },
        {
            question: "When did the Titanic sink?",
            answers: ["(1) '1905'", "(2) '1912'", "(3) '1918'"],
            correctAnswer: "2", 
        },
        {
            question: "Who was Che Guevar?",
            answers: ["(1) 'Worrior'", "(2) 'President'", "(3) 'Warrior'"],
            correctAnswer: "3", 
        },
        {
            question: "Who was the first woman to fly solo across the Atlantic?",
            answers: ["(1) 'Amelia Earhart'", "(2) 'Marie Curie'", "(3) 'Florence Nightingale'"],
            correctAnswer: "1",
        },
        {
            question: "Which programmer developed an OS on his own?",
            answers: ["(1) 'Bill Gates'", "(2) 'Terry Davis'", "(3) 'Ada Lovelace'"],
            correctAnswer: "2",
        },
        {
            question: "Who was the first emperor of China?",
            answers: ["(1) 'Qin Shi Huang'", "(2) 'Genghis Khan'", "(3) 'Sun Tzu'"],
            correctAnswer: "1",
        },
        {
            question: "When was the Declaration of USA Independence signed?",
            answers: ["(1) '1776'", "(2) '1783'", "(3) '1800'"],
            correctAnswer: "1", 
        },
        {
            question: "Who was the first female prime minister of the UK?",
            answers: ["(1) 'Margaret Thatcher'", "(2) 'Queen Victoria'", "(3) 'Theresa May'"],
            correctAnswer: "1",
        },
        {
            question: "What year did the Berlin Wall fall?",
            answers: ["(1) '1999'", "(2) '1989'", "(3) '1979'"],
            correctAnswer: "2", 
        },
        {
            question: "Who founded the Mongol Empire?",
            answers: ["(1) 'Kublai Khan'", "(2) 'Genghis Khan'", "(3) 'Tamerlane'"],
            correctAnswer: "1",
        },
        {
            question: "What year did World War II end?",
            answers: ["(1) '1939'", "(2) '1945'", "(3) '1950'"],
            correctAnswer: "2", 
        },
        {
            question: "Which OS built by one programmer?",
            answers: ["(1) 'Ubuntu'", "(2) 'TempleOS'", "(3) 'Microsoft'"],
            correctAnswer: "2",
        },
        {
            question: "Who was the last czar of Russia?",
            answers: ["(1) 'Peter the Great'", "(2) 'Nicholas II'", "(3) 'Ivan the Terrible'"],
            correctAnswer: "2",
        },
        {
            question: "Who started the Protestant Reformation?",
            answers: ["(1) 'John Calvin'", "(2) 'Martin Luther'", "(3) 'Henry VIII'"],
            correctAnswer: "2",
        },
        {
            question: "What year was the Magna Carta signed?",
            answers: ["(1) '2000'", "(2) '1215'", "(3) '1100'"],
            correctAnswer: "2",
        },
        {
            question: "Who was the leader of Nazi Germany?",
            answers: ["(1) 'Adolf Hitler'", "(2) 'Joseph Stalin'", "(3) 'Benito Mussolini'"],
            correctAnswer: "1",
        },
        {
            question: "Who was the first woman to receive a Nobel Prize?",
            answers: ["(1) 'Rosalind Franklin'", "(2) 'Marie Curie'", "(3) 'Ada Lovelace'"],
            correctAnswer: "2",
        },
        {
            question: "Which the first type of humans to exist?",
            answers: ["(1) 'Homo genus'", "(2) 'Homo sapiens'", "(3) 'Homo habilis'"],
            correctAnswer: "3",
        },
        {
            question: "What year did the first Olympic Games take place?",
            answers: ["(1) '1960'", "(2) '776 BCE'", "(3) '1900'"],
            correctAnswer: "2",
        },
        {
            question: "Who was the first Roman emperor?",
            answers: ["(1) 'Augustus'", "(2) 'Julius Caesar'", "(3) 'Nero'"],
            correctAnswer: "1",
        },
        {
            question: "Who wrote the Iliad and Odyssey?",
            answers: ["(1) 'Homer'", "(2) 'Plato'", "(3) 'Socrates'"],
            correctAnswer: "1",
        },
        {
            question: "When did the American Civil War end?",
            answers: ["(1) '1845'", "(2) '1865'", "(3) '1885'"],
            correctAnswer: "2", // Correct: 1865
        },
        {
            question: "What is the current human type today?",
            answers: ["(1) 'Homo genus'", "(2) 'Homo sapiens'", "(3) 'Homo habilis'"],
            correctAnswer: "2",
        },
        {
            question: "Who was the first African American president of the United States?",
            answers: ["(1) 'Barack Obama'", "(2) 'Frederick Douglass'", "(3) 'Martin Luther King Jr.'"],
            correctAnswer: "1",
        },
        {
            question: "Who was Cleopatra?",
            answers: ["(1) 'Queen of Egypt'", "(2) 'Roman Empress'", "(3) 'Greek Philosopher'"],
            correctAnswer: "1",
        },
        {
            question: "What year did the French Revolution begin?",
            answers: ["(1) '1776'", "(2) '1804'", "(3) '1789'"],
            correctAnswer: "1",
        },
        {
            question: "What's the origin of Barrack Obama?",
            answers: ["(1) 'America'", "(2) 'Santa Maria'", "(3) 'Kenya'"],
            correctAnswer: "3", 
        },
        {
            question: "What year did the Cold War end?",
            answers: ["(1) '1989'", "(2) '1991'", "(3) '1979'"],
            correctAnswer: "2",
        },
        {
            question: "Who was the first King of Rwanda?",
            answers: ["(1) 'Mibambwe I'", "(2) 'Cyirima I'", "(3) 'Ruganzu I'"],
            correctAnswer: "2",
        },
    ]  
}

class GeneralGeography {

    static key;

    static questions = 
    [
        {
          question: "Tallest mountain?",
          answers: ["(1) 'Everest'", "(2) 'K2'", "(3) 'Kilimanjaro'"],
          correctAnswer: "1",
        },
        {
          question: "Largest desert?",
          answers: ["(1) 'Atacama'", "(2) 'Gobi'", "(3) 'Sahara'"],
          correctAnswer: "3",
        },
        {
          question: "River in Egypt?",
          answers: ["(1) 'CongoNile'", "(2) 'Amazon'", "(3) 'None'"],
          correctAnswer: "3",
        },
        {
          question: "Continent of Rwanda?",
          answers: ["(1) 'America'", "(2) 'Africa'", "(3) 'Europe'"],
          correctAnswer: "2",
        },
        {
          question: "Ocean around Australia?",
          answers: ["(1) 'Pacific'", "(2) 'Indian'", "(3) 'Antlatica'"],
          correctAnswer: "2",
        },
        {
          question: "Nearest planet from the sun?",
          answers: ["(1) 'Venus'", "(2) 'Pluto'", "(3) 'Mercury'"],
          correctAnswer: "3",
        },
        {
          question: "Where is Kilimanjaro?",
          answers: ["(1) 'Kenya'", "(2) 'Zanzibar'", "(3) 'Tanzania'"],
          correctAnswer: "3",
        },
        {
          question: "Smallest country?",
          answers: ["(1) 'Vatican City'", "(2) 'Monaco'", "(3) 'Liechtenstein'"],
          correctAnswer: "1",
        },
        {
          question: "Largest rainforest?",
          answers: ["(1) 'Congo'", "(2) 'Amazon'", "(3) 'Sundarbans'"],
          correctAnswer: "1",
        },
        {
          question: "What is the furthest planet from the sun?",
          answers: ["(1) 'Mars'", "(2) 'Pluto'", "(3) 'None'"],
          correctAnswer: "2",
        },
        {
            question: "What is the capital of Brazil?",
            answers: ["(1) 'Rio de Janeiro'", "(2) 'Brasília'", "(3) 'São Paulo'"],
            correctAnswer: "2",
        },
        {
            question: "What's the type of galaxy is 'Earth' located in?",
            answers: ["(1) 'Forresight'", "(2) 'Mars'", "(3) 'Milky Way'"],
            correctAnswer: "3",
        },
        {
            question: "What is the largest desert on Earth?",
            answers: ["(1) 'Arabian Desert'", "(2) 'Sahara Desert'", "(3) 'Antarctic Desert'"],
            correctAnswer: "3",
        },
        {
            question: "What is Kilimanjaro?",
            answers: ["(1) 'A lake'", "(2) 'A hill'", "(3) 'A Mountain'"],
            correctAnswer: "3",
        },
        {
            question: "Which country is famous for its pyramids?",
            answers: ["(1) 'Mexico'", "(2) 'Egypt'", "(3) 'Sudan'"],
            correctAnswer: "2",
        },
        {
            question: "What is the biggest lake in Africa?",
            answers: ["(1) 'Victoria'", "(2) 'Nile'", "(3) 'Kivu'"],
            correctAnswer: "1",
        },
        {
            question: "Where is the Amazon Rainforest?",
            answers: ["(1) 'Africa'", "(2) 'South America'", "(3) 'Asia'"],
            correctAnswer: "2",
        },
        {
            question: "What is the capital of Italy?",
            answers: ["(1) 'Venice'", "(2) 'Florence'", "(3) 'Rome'"],
            correctAnswer: "3",
        },
        {
            question: "Washington D.C, D.C in full?",
            answers: ["(1) 'DC'", "(2) 'Doctor of Colombus'", "(3) 'District of Columbia'"],
            correctAnswer: "3",
        },
        {
            question: "What is the longest river in the world?",
            answers: ["(1) 'Amazon'", "(2) 'Victoria'", "(3) 'Nile'"],
            correctAnswer: "3", 
        },
        {
            question: "Where did Catholic Pop live?",
            answers: ["(1) 'Monaco'", "(2) 'Vatican City'", "(3) 'Liechtenstein'"],
            correctAnswer: "2",
        },
        {
            question: "What country has the most islands?",
            answers: ["(1) 'Indonesia'", "(2) 'Sweden'", "(3) 'Philippines'"],
            correctAnswer: "2", 
        },
        {
            question: "What is the capital of Egypt?",
            answers: ["(1) 'Alexandria'", "(2) 'Addis Ababa'", "(3) 'None'"],
            correctAnswer: "3",
        },
        {
            question: "Where is the Eiffel Tower located?",
            answers: ["(1) 'Rome'", "(2) 'Paris'", "(3) 'Berlin'"],
            correctAnswer: "2",
        },
        {
            question: "What is the hottest continent?",
            answers: ["(1) 'Africa'", "(2) 'Asia'", "(3) 'Europe'"],
            correctAnswer: "1", 
        },
        {
            question: "Which one is a canal?",
            answers: ["(1) 'Suez'", "(2) 'Congo Nile'", "(3) 'Indian'"],
            correctAnswer: "1", 
        },
        {
            question: "Where is Mount Everest?",
            answers: ["(1) 'India'", "(2) 'Nepal'", "(3) 'Bhutan'"],
            correctAnswer: "2",
        },
        {
            question: "What is the capital of Canada?",
            answers: ["(1) 'NewYork'", "(2) 'Toronto'", "(3) 'None'"],
            correctAnswer: "3",
        },
        {
            question: "Which continent has the most countries?",
            answers: ["(1) 'Asia'", "(2) 'America'", "(3) 'Africa'"],
            correctAnswer: "3",
        },
        {
            question: "Which country does Sahara Desert pass through?",
            answers: ["(1) 'South Africa'", "(2) 'Rwanda'", "(3) 'Chad'"],
            correctAnswer: "3",
        },
        {
            question: "What country is shaped like a boot?",
            answers: ["(1) 'Italy'", "(2) 'Spain'", "(3) 'Greece'"],
            correctAnswer: "1",
        },
        {
            question: "Which city is famous for Big Ben?",
            answers: ["(1) 'New York'", "(2) 'London'", "(3) 'Tokyo'"],
            correctAnswer: "2",
        },
        {
            question: "Where is the Great Barrier Reef?",
            answers: ["(1) 'Australia'", "(2) 'Indonesia'", "(3) 'Malaysia'"],
            correctAnswer: "1",
        },
        {
            question: "Which continent is known for kangaroos?",
            answers: ["(1) 'South America'", "(2) 'Australia'", "(3) 'Africa'"],
            correctAnswer: "2",
        },
        {
            question: "What is the biggest island in the world?",
            answers: ["(1) 'Greenland'", "(2) 'Madagascar'", "(3) 'Australia'"],
            correctAnswer: "1",
        },
        {
            question: "What is the capital of Russia?",
            answers: ["(1) 'St. Petersburg'", "(2) 'Kazan'", "(3) 'Moscow'"],
            correctAnswer: "2",
        },
        {
            question: "Which river flows through London?",
            answers: ["(1) 'Thames'", "(2) 'Seine'", "(3) 'Danube'"],
            correctAnswer: "1",
        },
        {
            question: "Where is the Grand Canyon located?",
            answers: ["(1) 'Canada'", "(2) 'USA'", "(3) 'Mexico'"],
            correctAnswer: "2",
        },
        {
            question: "Which country is home to sushi?",
            answers: ["(1) 'China'", "(2) 'Japan'", "(3) 'Korea'"],
            correctAnswer: "2",
        },
        {
            question: "What is the capital of Rwanda?",
            answers: ["(1) 'Kigali'", "(2) 'Kampala'", "(3) 'Nairobi'"],
            correctAnswer: "1",
        },
    ]  
}


const questionsClassArr = [GeneralMathematics,GeneralKnowledge,GeneralGeography,GeneralHistory];



function checkIfBodaIsMovingInItsBoundaries () {
    if (((enemyBodaArr[0].x_axis < pageWidth && enemyBodaArr[0].isMovingLeft) || 
    (enemyBodaArr[0].x_axis > enemyBodaArr[0].endXPoint && enemyBodaArr[0].isMovingRight)) && canUserBeAsked) {
        getToToggleUserCanBeAsked ();
        const classToAskFrom = getRandomValueFromAnyArray (questionsClassArr);
        const questionToAsk = getRandomValueFromAnyArray (classToAskFrom.questions);
        showUserTheQuestion(questionToAsk);
        classToAskFrom.key = questionToAsk.correctAnswer;
        countSecForUserToAnswer = getRandomValueFromAnyArray([10,15]);
        currentClassAskedFrom = classToAskFrom;
        checkIfUserIsInLimitToReply();
        userCanAnswer = true;
    }
}

function getToToggleUserCanBeAsked () {
    canUserBeAsked = !canUserBeAsked;
}

function getRandomValueFromAnyArray (array) {
    return array[Math.floor(Math.random() * array.length)];
}


function showUserTheQuestion (questionAsked) {
    questionAnswer.querySelector('#question').innerText = questionAsked.question;
    questionAnswer.querySelector('#answers').innerText = splitAnswers(questionAsked.answers);
    questionAnswer.style.visibility = 'visible';
}

function splitAnswers (array) {
    array = array.join(' ');
    return array;
}

function checkIfUserIsInLimitToReply () {
    clearIntervalForQuestionAsked = setInterval(countTheSecondsDown,1000);
}

function countTheSecondsDown () {

    stopCountsWhenEmemyBorderIsOut();

    if (countSecForUserToAnswer > 0) {
        countSecForUserToAnswer --;
        questionAnswer.querySelector('#countDown').innerText = `Answer In ${countSecForUserToAnswer} seconds`;
    }

    if (!countSecForUserToAnswer) {
        getIfEnemyBodaIsInBoundaryForUserToBeAskedAgain ();
    }
}

function stopCountsWhenEmemyBorderIsOut () {
    if (enemyBodaArr[0].x_axis - enemyBodaArr[0].userWins >= -50) {
        stopSecCounter();
    }
}

function stopSecCounter () {
    countSecForUserToAnswer = 0;
}

function checkIfUserIsCorrect (answer) {
    if (currentClassAskedFrom.key === answer) {
        modules.playerObject.playerLife += lifeAddition();
        checkIfUserLifeIsInLimit();
        batteryStatusClrChangerFn ()
        returnEnemyBodaFarAway();
    }
    else {
        stopSecCounter();
    }
    userCanAnswer = false;
    turnTheClassCorrectKeyOff ();
}

function turnTheClassCorrectKeyOff () {
    currentClassAskedFrom.key = undefined;
}

function getIfEnemyBodaIsInBoundaryForUserToBeAskedAgain () {
    if (((enemyBodaArr[0].x_axis < pageWidth && enemyBodaArr[0].isMovingLeft) || 
        (enemyBodaArr[0].x_axis > enemyBodaArr[0].endXPoint && enemyBodaArr[0].isMovingRight))
        && !canUserBeAsked && !countSecForUserToAnswer)
    {
        clearInterval (clearIntervalForQuestionAsked);
        getToToggleUserCanBeAsked ();
    }
}










document.addEventListener('keyup', e => {
    const answerKeys = ['1','2','3'];
    if (userCanAnswer) {
        if (!answerKeys.includes(e.key)) {
            return;
        }
        checkIfUserIsCorrect(e.key);
    }
})





/* Ball Movements Direction*/



class ArrowUp {
    static key = 'ArrowUp';
    static  ballMovementChangerFn () {
        if (!ball.gravity) {
            movingUpBallPropertyChanger();
        }
    }
}

function movingUpBallPropertyChanger () {
    ball.freeControl = false;
    ball.userYControl = true;
    ball.customizedUserSpeedY = -5;
    ball.userEndYPoint = ball.y_axis - 180;
    ball.ballInAir = true;
}

class ArrowRight {
    static key = 'ArrowRight';
    static  ballMovementChangerFn () {
        movingRightBallPropertyChanger();
    }
}

function movingRightBallPropertyChanger () {
    ball.userXControl = true;
    ball.movingRight = true;
    ball.customizedUserSpeedX = 5;
    ball.userEndXPoint = ball.x_axis + 20;
    if (ball.ballInAir) {
        ball.userEndXPoint = ball.x_axis + 45;
    }
}

class ArrowLeft {
    static key = 'ArrowLeft';
    static  ballMovementChangerFn () {
        movingLeftBallPropertyChanger();
    }
}

function movingLeftBallPropertyChanger () {
    ball.userXControl = true;
    ball.movingLeft = true;
    ball.customizedUserSpeedX = -5;
    ball.userEndXPoint = ball.x_axis - 20;
    if (ball.ballInAir) {
        ball.userEndXPoint = ball.x_axis - 45;
    }
}




const ballMovementControllerArr = [ArrowUp,ArrowRight,ArrowLeft];

function ballMovementControllerFn (key) {
    ballMovementControllerArr.forEach(ballMoveDirection => {
        if (ballMoveDirection.key === key) {
            ballMoveDirection.ballMovementChangerFn();
        }
    })
}






document.addEventListener('keydown', e => {
    if (ball.gamePlaying) {
        ballMovementControllerFn (e.key);
    }
})

function animate () {

    if (gameRunning) {
        requestAnimationFrame (animate);
    }
    else {
        return;
    }
    ctx.clearRect(0,0,pageWidth,pageHeight);
    pageUpdateFn();

    topNavBackGround();
    userLifeBorder();
    userLifeBattery(modules.playerObject.batteryStatus,modules.playerObject.playerLife);
    userLifeInPercentage(modules.playerObject.playerLife);
    userCurrentScore(modules.playerObject.playerScoreColor, modules.playerObject.playerPoints,modules.playerObject.totalScore);
    userCurrentLeveL(modules.playerObject.playerLevel);
    //blocks
    if (allBlocksArr.length) {
        getResultToReleaseANewBlock();
        checkIfFirstMovingBlockIsOutOfThePage();
        settingBlocksPositionOnXAxis();
        drawingMovingBlocks();
        getIfCanBallLandingOnTheField();
        drawBall(ball);

        if (modules.playerObject.playerLevel > 1) {
            drawBall(saviourBall);
            saviourBallControllerFn();
            saviourBallCollisionDetector();
            whenBallColideForSaviourBall();
        }
    }

    if (ball.gamePlaying) {
        moveBallWhenNoEvent(ball);
        if (modules.playerObject.playerLevel > 1) {
            moveBallWhenNoEvent(saviourBall);
        }
        whenTheBallMovesUp();
        whenTheBallMovesDown();
        updateBallWheNoEvent();
        whenTheBallMoveRight();
        whenTheBallMoveLeft();
        checkIfBallHasNotFallen();
        gameOver();
    }

    //page borders
    getPageBorderDecisionDrawXorY();

    if (!ball.gamePlaying && modules.playerObject.playerLevel > 1) {
        clearTimeout(gunSetTimeoutRef1);
        clearTimeout(gunSetTimeoutRef2);
        clearTimeout(gunSetTimeoutRef3);
        clearTimeout(gunSetTimeoutRef4);
        clearTimeout(gunSetTimeoutRef5);
        returnGunBackToInitialPoint();
        getGunBackOnShotPosition();
        
        if (modules.playerObject.playerLevel > 2) {
            returnEnemyBodaToInitialPoint();
        }
    }

    //enemies hood

    if (halfCircle1 && ball.gamePlaying && modules.playerObject.playerLevel > 1) {
        drawHalfCircleGunPart(halfCircle1.color);
        drawGunMouthGunPart (gunMouth1.color);
        writeGunWordGunPart (gunWord1.color);
        drawShotsGunParts (shot1.color);
        gunCoordinatesUpdate();
        gunReachedShotPosition();
        shotTheShots();
        checkIfShotsAreInBoundaries();
        gunReachedFlashBackPosition();

        if (modules.playerObject.playerLevel > 2) {
            drawEnemyBodaFn ();
            moveEnemyBodaToLeftFn ();
            moveEnemyBodaToRightFn ();
            checkIfBodaIsMovingInItsBoundaries ();
            getIfEnemyBodaIsInBoundaryForUserToBeAskedAgain ();
            enemyBodaAndBallCollision ();
        }
    }
}


export {userLifeBattery,userLifeInPercentage,userCurrentScore,userCurrentLeveL,toogleTheGameState,animate,gameRunning,backToTheStartingPage}