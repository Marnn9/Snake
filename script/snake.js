"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, EDirection, gameProps, gameBoardSize, gameStatus, EGameStatus, insertNewBody} from "./game.js";
import { ESpriteIndex, moveSnakeElement, } from "./snakeBodyDirection.js";
import { EBoardCellInfoType, TBoardCell } from "./board.js";


/**class for making the snake, its body and tail */
export function TSnakeHead(aBoardCell) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Head; 
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let newDirection = direction;

    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
            sp.setIndex(direction);
            sp.draw();
        break;
        }
    };

    this.setDirection = function (aDirection) {
        if (((direction === EDirection.Right) || (direction === EDirection.Left)) && ((aDirection === EDirection.Up) || (aDirection === EDirection.Down))) {
            newDirection = aDirection;
        } else if (((direction === EDirection.Up) || (direction === EDirection.Down)) && ((aDirection === EDirection.Right) || (aDirection === EDirection.Left))) {
            newDirection = aDirection;
        }
    };

    this.update = function () {
        gameBoard[boardCell.row][boardCell.col].Infotype = EBoardCellInfoType.IsSnake; //Writes to board that this cell contains snake
        direction = moveSnakeElement(newDirection, boardCell, spi); //sets direction by moveSnakeElement from SnakeBodydirections.js, makes snake move in in the right direction given by player
        pos.x = boardCell.col * spi.width;                         
        pos.y = boardCell.row * spi.height;
    };
    
     this.checkCollision = function(){
        const WallHit = ((boardCell.row < 0) || (boardCell.row >= gameBoardSize.row) || (boardCell.col < 0) || (boardCell.col >= gameBoardSize.col)); //sets the border of the canvas
        let BodyHit = false;
        if(!WallHit){ //if the snake hasn't gone outside the canvas
            BodyHit = gameBoard[boardCell.row][boardCell.col].Infotype === EBoardCellInfoType.IsSnake //if the cell has a snake[] in it
        } return WallHit || BodyHit; //either one of them if checkCollision = true
    };

    this.SnakePos = function(){
        return (boardCell);    //returns current position, used in Baitcollition 
    };

}//end of class TSnakehead

export function TSnakeBody(aBoardCell, aDirection, aSpriteIndex) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Body; 
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction; 
    let spriteIndex = ESpriteIndex.RL;

    //failsafe so that direction and spriteindex, is always set to the corresponding parameters given to the function
    if((aDirection !== undefined) && (aSpriteIndex !== undefined)){
        direction = aDirection;
        spriteIndex = aSpriteIndex;
    }; 
    
    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
            sp.setIndex(spriteIndex);//chooses the sprite based on the movement
            sp.draw();
        break;
        }
    };

    this.setDirection = function (aDirection) {
        if (((direction === EDirection.Right) || (direction === EDirection.Left)) && ((aDirection === EDirection.Up) || (aDirection === EDirection.Down))) {
            newDirection = aDirection;
        } else if (((direction === EDirection.Up) || (direction === EDirection.Down)) && ((aDirection === EDirection.Right) || (aDirection === EDirection.Left))) {
            newDirection = aDirection;
        }
    };

    this.update = function () {
        gameBoard[boardCell.row][boardCell.col].Infotype = EBoardCellInfoType.IsSnake;//body writes to gameboard to tell that the snake is in that position
        spriteIndex = moveSnakeElement(direction, boardCell, spi); //updates sprite by movement so the sprite is always corresponding to the direction, makes it move
        direction = gameBoard[boardCell.row][boardCell.col].direction;//sets direction by key directions
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
    };

     this.MakeBody = function(){
        return new TSnakeBody(new TBoardCell(boardCell.col, boardCell.row), direction, spriteIndex);     //creates a body copy with the same coordinates as the last existing bodypart(s) 
    };

   /*  this.BodyPos = function(){ 
        return (boardCell);      //returned the current location of the body to use in game NewSnakeBodyElement.BodyPos();
    }; */
}//end of class TSnakeBody

export function TSnakeTail(aBoardCell, aDirection, aSpriteIndex) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Tail; 
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let newDirection = direction;
    let spriteIndex = null;

    if((aDirection !== undefined) && (aSpriteIndex !== undefined)){
        direction = aDirection;
        spriteIndex = aSpriteIndex;
    };

    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
            sp.setIndex(direction); //each direction has unike sprites, this is set correctly by using direction info
            sp.draw();
        break;
        }
    };

    this.setDirection = function (aDirection) {
        if (((direction === EDirection.Right) || (direction === EDirection.Left)) && ((aDirection === EDirection.Up) || (aDirection === EDirection.Down))) {
            newDirection = aDirection;
        } else if (((direction === EDirection.Up) || (direction === EDirection.Down)) && ((aDirection === EDirection.Right) || (aDirection === EDirection.Left))) {
            newDirection = aDirection;
        }
    };

    this.update = function () {
        /**if insertNewBody === true, the value of the variable InsertNewBody is set back to null */
        if(insertNewBody){
            insertNewBody;
            return;
        }
        gameBoard[boardCell.row][boardCell.col].Infotype = EBoardCellInfoType.IsEmpty; //cell information is deleted, snake won't die when it hits the tail
        spriteIndex = moveSnakeElement(direction, boardCell, spi);
        direction = gameBoard[boardCell.row][boardCell.col].direction;
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height; 
    };

    /* this.TailPos = function(){ //was called in game.js => UpdateGame
        return (boardCell);      //returned the current location of the Tail to use in game NewSnakeTailElement.BodyPos();
    }; */
}//end of class TSnakeTail