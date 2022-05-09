"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { TBoardCell, TBoardCellInfo, EBoardCellInfoType} from "./board.js"
import { TSnakeBody, TSnakeHead, TSnakeTail } from "./snake.js"
import { TBait } from "./bait.js";
import { THomeButton, TReplayButton, TResumeButton, TStartButton } from "./Buttons.js";
import { TInfoboard } from "./Infoboard.js";
import { TGameScore} from "./numbers.js";
import { TSymboles } from "./symboles.js";




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
    GameOver:   { x:   0, y: 647, width: 856, height: 580, count:  1 },
    AppleEaten: { x: 380, y:   0, width:  32, height:  34, count:  1 },
    scoreSymb:  { x: 379, y:  34, width:  33, height:  59, count:  1 }
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
    gamePoints: null,
    Symbols: null
}

export const gameProps = GameProps;
export const gameBoardSize = new TBoardCell(25, 20);

let insertBody = null;

let newSnakeTailElement = null;
let newSnakeBodyElement = null;

let hndUpdateGame = null;

let spawnTime = null;
let catchTime = null;
let time = null; 

let gameSpeeds = null;



/**tried making bait as an Array but the apple couldn't respawn and despawn by time,
 * as easily with this method as the method using BaitCollition */

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
        gameProps.baits[index].draw()                                   //to draw all the items in Baits array
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
    gameProps.Symbols.draw();

    requestAnimationFrame(drawGame);
}//end of drawGame

/**constantly updates the position and the frames of the game */
export function updateGame() {
    if(gameStatus === EGameStatus.Running){ 
        for (let i = 0; i < gameProps.snake.length; i++) { //this iterates the array
            const snakeElement = gameProps.snake[i];
            const head = gameProps.snake[0];
            if(snakeElement === head){ 
                if (head.checkCollision()) {     //Checkcollitoin from TSnakeHead
                    gameStatus = EGameStatus.GameOver;         //SnakeHead has hit the bounderies of the canvas or the head has hit the body
                    break;
                }    
                BaitCollition()                                //if an apple is "eaten", and the snake hasn't run the checkCollition, the else if is run 
            }else if(i === (gameProps.snake.length -2)){       //if the iteration of i is two place away from the tail (end of the array), it does the next steps 
                if(insertNewBody){                             //if baitcollition is happening insetnewBody = true, then MakeBody can happen 
                    insertBody = snakeElement.MakeBody();      //run function MakeBody that adds a new body part 
                }
            }
            
            /* else if((newSnakeBodyElement.BodyPos().row === head.SnakePos().row &&
            newSnakeBodyElement.BodyPos().col === head.SnakePos().col)  //if head and body is in the same location
            ||
            (newSnakeTailElement.TailPos().row === head.SnakePos().row &&
            newSnakeTailElement.TailPos().col === head.SnakePos().col) //or if tail and head is in the same location
            ||
            (snakeElement.BodyPos().row === head.SnakePos().row &&
            snakeElement.BodyPos().col === head.SnakePos().col) ){    //or if the new added bodypart and head is the same location
              
                gameStatus = EGameStatus.GameOver;                      //one statement over is true = GameOver
              break;
        } */ // this method did not work optimally, the information from the SnakeElement could not be used with BodyPos(), 
             // The metod used to check if the snake hits itself is in CheckCollition in Snake.js
            
        if(gameStatus == EGameStatus.Running){             //the snake is only updates when the game is running
                snakeElement.update();
            }
        }

        if(insertBody!== null){                 //insertBody = snakeElement.MakeBody()
            const tail = gameProps.snake.pop(); //tail is removed
            gameProps.snake.push(insertBody);   //new body part added at the end of the array
            gameProps.snake.push(tail);         //tail added again at the end
            insertNewBody = null;               
            insertBody = null;                  //reset back to null so no more parts will be added unwillingly
        }
    
           /*  for(let index = 0; index < gameProps.baits.length; index ++){
            gameProps.baits[index].update();   //updated all the items in the Baits array
        }*/ 
            //spawnGameProps();                //made a new Bait when updated (after time given in function)
    }

    gameProps.Play.update(); //to Animate

}//end of updateGame

/** making the gameProps to revert so you can refresh without refreshing the whole website */
export function newGame() {
    if( hndUpdateGame != null){                                 //Fix so its 0 when replay
        clearInterval(hndUpdateGame);
        hndUpdateGame = null;
    }
    
    gameProps.gameBoard = [];
    for (let i = 0; i < gameBoardSize.row; i++) {
        const row = [];  
        for (let j = 0; j < gameBoardSize.col; j++) {
            row.push(new TBoardCellInfo());
        }
        gameProps.gameBoard.push(row);
    }
    gameProps.snake = [];                                        //resets snake to minimal length when new game by clearing the Array
    let newSnakeElement = new TSnakeHead(new TBoardCell(2 , 10));//pushes the head into the array
    gameProps.snake.push(newSnakeElement); 

    newSnakeBodyElement = new TSnakeBody(new TBoardCell(1, 10)); //pushes the Body into the array
    gameProps.snake.push(newSnakeBodyElement);

    newSnakeTailElement = new TSnakeTail(new TBoardCell(0, 10)); //pushes the Tail into the array, now the snake is only 3 parts long at start
    gameProps.snake.push(newSnakeTailElement);
    
    gameSpeeds = 500;                                           //sets speed back to start-speed when a new game starts
    hndUpdateGame = setInterval(updateGame, gameSpeeds);

    gameProps.gamePoints.resetPoints();                         //sets score to 0 when you replay
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
    
    gameProps.Symbols = new TSymboles();

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
        spawnTime = Date.now();                        //starts the timer of the first apple
        gameStatus = EGameStatus.Running;
        cvs.style.cursor = "default";
    }else if(gameProps.Retry.isMouseOver(mousePos)){
        newGame();                                     //runs the reset-function
        gameStatus = EGameStatus.Running;
        cvs.style.cursor = "default";
    }else if(gameProps.Home.isMouseOver(mousePos)){
        newGame();                                     //runs the reset-function
        gameStatus = EGameStatus.New;
        cvs.style.cursor = "default";
    }else if(gameProps.Resume.isMouseOver(mousePos)){
        spawnTime = Date.now();                        //restarts the timer so the time will not have run when player was idle
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

function BaitCollition(){
    if(gameProps.bait.BaitPos().row === gameProps.snake[0].SnakePos().row && //if the snake and apple is in the same position
        gameProps.bait.BaitPos().col === gameProps.snake[0].SnakePos().col){
        gameProps.bait.update();                                             //the apple moves to a new random location 
        catchTime = Date.now();

    insertNewBody = true;                                                    //Set to true here so the part can be added just when an apple is eaten  

    const SpeedIncrease = 10;
    clearInterval(hndUpdateGame);                                           //clearsinterval so it can be redefined
    gameSpeeds -= SpeedIncrease;                                            //new speed = speed - increase;
    if(gameSpeeds <150){                                                    //makes 150 the maximum speed it can go
        gameSpeeds = 150;
    }

    time = catchTime - spawnTime;                                           //calculates the time used to eat an apple in ms 
    let points = null
         function TimeScore(){                                              //gives points based on the number of seconds (1000ms = 1s)
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

    gameProps.gamePoints.setScore(points, +1);                           //score is set to number of points from TimeScore(), number of apples eaten increases by 1
    spawnTime = Date.now();                                              //the timer restarts: applied the apple moved
    hndUpdateGame = setInterval(updateGame, gameSpeeds);                 //updates the gamespeed to the new speed
    }
    else if(gameProps.bait.BaitPos().Infotype === EBoardCellInfoType.IsSnake){ //if the apple spawns in a cell containing the snake 
        gameProps.bait.update();                                         //the Apple respawns at new random location
    }

}//end of BaitCollition

/*makes the Bait appear when made and function run 
function spawnGameProps(){
    const now = Date.now();
    let timeDelta = now - timeSchedulefood.timeLast;
        if(timeDelta > timeSchedulefood.timeCreate + 6000){             //made a new bait every 6 seconds
            gameProps.baits.push(new TBait());                          //added new bait to array
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
    GLib2D.initLib(ctx, "./media/SpriteSheet_Snake1.png", gameReady);
}
