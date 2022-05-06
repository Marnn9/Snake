"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { TBoardCell, TBoardCellInfo,EBoardCellInfoType} from "./board.js"
import { TSnakeBody, TSnakeHead, TSnakeTail } from "./snake.js"
import { TBait } from "./bait.js";
import { THomeButton, TReplayButton, TResumeButton, TStartButton } from "./Buttons.js";
import { TInfoboard } from "./Infoboard.js";
import { TGameScore} from "./numbers.js";


//--------------------------------------------------------------------------------------------------------------------
//------ Variables, Constants and Objects
//--------------------------------------------------------------------------------------------------------------------
//Coordinates on the sprite-sheet
const SnakeSheetData = {
    Head:       { x:   0, y:   0, width:  38, height:  38, count:  4 },
    Body:       { x:   0, y:  38, width:  38, height:  38, count:  6 },
    Tail:       { x:   0, y:  76, width:  38, height:  38, count:  4 },
    Bait:       { x:   0, y: 114, width:  38, height:  38, count:  1 },
    Play:       { x:   0, y: 155, width: 202, height: 202, count: 10 },
    Retry:      { x: 614, y: 995, width: 169, height: 167, count:  1 },
    Resume:     { x:   0, y: 357, width: 202, height: 202, count:  2 },
    Home:       { x:  64, y: 994, width: 170, height: 167, count:  1 },
    Number:     { x:   0, y: 560, width:  81, height:  86, count: 10 },
    GameOver:   { x:   0, y: 647, width: 856, height: 580, count:  1 }
};
export const sprites = SnakeSheetData;
export let cvs = null;
export let ctx = null;

export const EDirection = { Up: 0, Right: 1, Left: 2, Down: 3 };
export const EGameStatus = { New: 0, Running: 1, Pause: 2, GameOver: 3};

export let gameStatus = EGameStatus.New;
export let insertNewBody = null;

const mousePos = new GLib2D.TPoint(0, 0);

const GameProps = {
    gameBoard: null,
    GameOver: null,
    snake: [],
    bait: null,
    Home: null,
    Head: null,
    Body: null,
    Tail: null,
    Play: null,
    Retry: null,
    Resume: null,
    Number: null,
    gamePoints: null
}

export const gameProps = GameProps;
export const gameBoardSize = new TBoardCell(25, 20);


let insertBody = null;


let hndUpdateGame = null;

let spawnTime = null;
let catchTime = null;
let time = null; 

let gameSpeeds = 500;



/**tried making bait as Array but the apple couldn't respawn and despawn easily with this method */
/*  object of different times 
const TimeSchedule = {
    timeLast: 0,
    timeCreate: 3000 
}
making it an object 
const timeSchedulefood = Object.create(TimeSchedule); */

//--------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//--------------------------------------------------------------------------------------------------------------------

/**drawing the objects from gameProps */
function drawGame() {
   /*   for(let index = 0; index < gameProps.baits.length; index ++){
        gameProps.baits[index].draw()
    }  */
   
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    gameProps.bait.draw()
    
    switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
    for (let i = 0; i < gameProps.snake.length; i++) {
        gameProps.snake[i].draw();
    }
    break;
    }
    
    gameProps.GameOver.draw();
    gameProps.Play.draw();
    gameProps.Retry.draw();
    gameProps.Home.draw();
    gameProps.Resume.draw();
    gameProps.gamePoints.draw();

    requestAnimationFrame(drawGame);
}//end of drawGame

/**constantly updates the position and the frames of the game */
export function updateGame() {
    if(gameStatus === EGameStatus.Running){
        for (let i = 0; i < gameProps.snake.length; i++) {    
            const snakeElement = gameProps.snake[i];
        if(snakeElement == gameProps.snake[0]){
            if (gameProps.snake[0].checkCollision()) {
                gameStatus = EGameStatus.GameOver;
                break;
            }
            BaitCollition()
        }else if(i === (gameProps.snake.length -2)){
            if(insertNewBody){
                insertBody = snakeElement.MakeBody();
            }
        }
        if(gameStatus == EGameStatus.Running){
            snakeElement.update();
        }
    } 
  
    if(insertBody!== null){
        const tail = gameProps.snake.pop();
        gameProps.snake.push(insertBody);
        gameProps.snake.push(tail);
        insertBody = null;
    }
    
           /*  for(let index = 0; index < gameProps.baits.length; index ++){
            gameProps.baits[index].update();
        } */
    //spawnGameProps();
    }

    gameProps.Play.update();

}//end of updateGame

/** making the gameProps to revert so you can refresh without refreshing the whole website */
export function newGame() {
    if( hndUpdateGame != null){
        clearInterval(hndUpdateGame);
    }
    gameProps.gameBoard = [];
    for (let i = 0; i < gameBoardSize.row; i++) {
        const row = [];
        for (let j = 0; j < gameBoardSize.col; j++) {
            row.push(new TBoardCellInfo());
        }
        gameProps.gameBoard.push(row);
    }
    gameProps.snake = [];
    let newSnakeElement = new TSnakeHead(new TBoardCell(2, 10));
    gameProps.snake.push(newSnakeElement);

    newSnakeElement = new TSnakeBody(new TBoardCell(1, 10));
    gameProps.snake.push(newSnakeElement);

    newSnakeElement = new TSnakeTail(new TBoardCell(0, 10));
    gameProps.snake.push(newSnakeElement);
    BaitCollition();

    gameSpeeds = 500;
    gameStatus = EGameStatus.New;
    hndUpdateGame = setInterval(updateGame, gameSpeeds);
    
    
    gameProps.gamePoints.resetPoints();//sets points to 0 when you replay
    gameProps.bait.update()
    gameProps.gamePoints.update();


}//end of newGame

/** This function is run after sprite sheet image is loaded.*/
function gameReady() {
    gameProps.bait = new TBait();
    
    gameProps.Play = new TStartButton();
    gameProps.Retry = new TReplayButton();
    gameProps.Home = new THomeButton();
    gameProps.Resume = new TResumeButton();
    
    gameProps.GameOver = new TInfoboard();
    gameProps.gamePoints = new TGameScore();
    
    newGame();
    requestAnimationFrame(drawGame);
}//end of gameReady

function updateMousePos(aEvent) {
    mousePos.x = aEvent.clientX - cvs.offsetLeft;
    mousePos.y = aEvent.clientY - cvs.offsetTop;
}

/**determine the cursor type */
function cvsMouseMove(aEvent) {
    // Mouse move over canvas
    cvs.style.cursor = "default";
    updateMousePos(aEvent);
 
    if(gameProps.Play.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
    }else if(gameProps.Home.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
    }else if(gameProps.Retry.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
    }else if(gameProps.Resume.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
    }else{
         cvs.style.cursor = "default"}   
}//end of cvsMouseMove

/**what event that happens when you click the buttons */
function cvsClick() {
    // Mouse button has clicked on Canvas
    cvs.style.cursor = "default";
     if(gameProps.Play.isMouseOver(mousePos)){
        spawnTime = Date.now(); 
        gameStatus = EGameStatus.Running;
        cvs.style.cursor = "default";
    }else if(gameProps.Retry.isMouseOver(mousePos)){
        newGame();
        gameStatus = EGameStatus.Running;
        cvs.style.cursor = "default";
    }else if(gameProps.Home.isMouseOver(mousePos)){
        newGame();
        gameStatus = EGameStatus.New;
        cvs.style.cursor = "default";
    }else if(gameProps.Resume.isMouseOver(mousePos)){
        spawnTime = Date.now(); 
        gameStatus = EGameStatus.Running;
        cvs.style.cursor = "default";
    }else{
        cvs.style.cursor = "default"}  
        
}//end of cvsClick


/** the keys you use to play the game */
function cvsKeydown(aEvent) {
    const snakeHead = gameProps.snake[0];
    switch (aEvent.key) {
        case "ArrowLeft":
            snakeHead.setDirection(EDirection.Left);
            break;
        case "ArrowRight":
            snakeHead.setDirection(EDirection.Right);
            break;
        case "ArrowUp":
            snakeHead.setDirection(EDirection.Up);

            break;
        case "ArrowDown":
            snakeHead.setDirection(EDirection.Down);
            break;
        case " ":
            if (gameStatus === EGameStatus.Pause) {
                gameStatus = EGameStatus.Running;
            } else if (gameStatus === EGameStatus.Running) {
                gameStatus = EGameStatus.Pause;
            }
            break;
    }
}//end of cvskeydown

/** if the snake head and apple is in the same place: the apple moves and gives points 
 * based on the time between the spawn and the catch of the apple, when an apple is eaten speed increases by SpeedIncrease*/
function BaitCollition(){
    if(gameProps.bait.BaitPos().row === gameProps.snake[0].SnakePos().row &&
    gameProps.bait.BaitPos().col === gameProps.snake[0].SnakePos().col){
    gameProps.bait.update();
    catchTime = Date.now();

    insertNewBody = true;

    /* let newSnakeElement = new TSnakeBody(new TBoardCell(1, 10));
     /* if(snake[i].length === -1){
        gameProps.Body.MakeBody(); 
    gameProps.snake.push(newSnakeElement); */
    
    const SpeedIncrease = 10;
    clearInterval(hndUpdateGame);
    hndUpdateGame = setInterval(updateGame, (gameSpeeds -= SpeedIncrease));
    
    time = catchTime - spawnTime;
    let points = null
         function TimeScore(){
        if (time <= 3000){
            points = 10;
        }else if((time < 6000) && (time > 3000)){
            points = 8;
        }else if((time < 9000) && (time > 6000)){
            points = 6
        }else if((time < 12000) && (time > 9000)){
            points = 4;
        }else{points = 2};
        return points;    
        }
       TimeScore();
    gameProps.gamePoints.setScore(points, +1);
    spawnTime = Date.now(); 
    }

}

/*makes the Bait appear when made and function run 
function spawnGameProps(){
    const now = Date.now();
    let timeDelta = now - timeSchedulefood.timeLast;
        if(timeDelta > timeSchedulefood.timeCreate + 6000){
            gameProps.baits.push(new TBait());
            timeSchedulefood.timeLast = now;
        } 
}
*/


export function initGame(aCanvas) {
    cvs = aCanvas;
    cvs.width = gameBoardSize.col * sprites.Head.width;
    cvs.height = gameBoardSize.row * sprites.Head.height;
    ctx = cvs.getContext("2d");
    cvs.addEventListener("mousemove", cvsMouseMove, false);
    cvs.addEventListener("click", cvsClick, false);
    document.addEventListener("keydown", cvsKeydown);
    GLib2D.initLib(ctx, "./media/SpriteSheet_Snake.png", gameReady);
}
