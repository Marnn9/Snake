"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, EDirection, gameProps, gameBoardSize, gameStatus, EGameStatus, insertNewBody} from "./game.js";
import { ESpriteIndex, moveSnakeElement, } from "./snakeBodyDirection.js";
import { EBoardCellInfoType, TBoardCell } from "./board.js";

/**class for making the snake, its body and tail */
export function TSnakeHead(aBoardCell) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Head;  //SnakeSheet.Body or SnakeSheet.Tail
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    const rect = sp.getRectangle();
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
        direction = moveSnakeElement(newDirection, boardCell, spi);
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
    }

     this.checkCollision = function(){
        return ((boardCell.row < 0) || (boardCell.row >= gameBoardSize.row) || (boardCell.col < 0) || (boardCell.col >= gameBoardSize.col));
    }

    this.SnakePos = function(){
        return (boardCell);
    }
}//end of class TSnakehead

export function TSnakeBody(aBoardCell, aDirection, aSpriteIndex) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Body;  //SnakeSheet.Body or SnakeSheet.Tail
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
        spriteIndex = moveSnakeElement(direction, boardCell, spi); //updates sprite by movement so the sprite is always right
        direction = gameBoard[boardCell.row][boardCell.col].direction;//sets direction by snakehead directions
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
    };

    /**creates a body copy with the same coordinates as the last existing bodypart(s) */
     this.MakeBody = function(){
        return new TSnakeBody(new TBoardCell(boardCell.col, boardCell.row), direction, spriteIndex);
        
    };

}//end of class TSnakeBody

export function TSnakeTail(aBoardCell, aDirection, aSpriteIndex) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Tail;  //SnakeSheet.Body or SnakeSheet.Tail
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let newDirection = direction;
    let spriteIndex = null;

    if((aDirection !== undefined) && (aSpriteIndex !== undefined)){
        direction = aDirection;
        spriteIndex = aSpriteIndex;
    }

    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
            sp.setIndex(direction);
            sp.draw();
        break;
        }
    };

    this.TailPos = function(){
        return (boardCell);
    }

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
        gameBoard[boardCell.row][boardCell.col].Infotype = EBoardCellInfoType.IsEmpty;
        spriteIndex = moveSnakeElement(direction, boardCell, spi);
        direction = gameBoard[boardCell.row][boardCell.col].direction;
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;

        
    };

}//end of class TSnakeTail