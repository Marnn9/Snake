"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, EDirection, gameProps, gameBoardSize, gameStatus, EGameStatus} from "./game.js";
import { moveSnakeElement, } from "./snakeBodyDirection.js";

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
    /* const bodySpi = gameProps.Body;
    const bodyPos = new GLib2D.TPoint(boardCell.col * bodySpi.width, boardCell.row * spi.height);
    const bodySp = new GLib2D.TSprite(bodySpi, bodyPos);
     */

    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
        case EGameStatus.GameOver:
            sp.setIndex(direction);
            sp.draw();
            //bodySp.draw();
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
        
        /* switch(gameStatus){
        case EGameStatus.Running:
        checkCollision(rect);
        break;
        }  */
    }

     this.checkCollision = function(){
        return ((boardCell.row < 0) || (boardCell.row >= gameBoardSize.row) || (boardCell.col < 0) || (boardCell.col >= gameBoardSize.col));       
    
    }

    this.SnakePos = function(){
        return (boardCell);
    }
}//end of class TSnakehead

export function TSnakeBody(aBoardCell) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Body;  //SnakeSheet.Body or SnakeSheet.Tail
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let newDirection = direction;

    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
        case EGameStatus.GameOver:
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
    };

    this.bodyPos = function(){
        return (boardCell);
    }

}//end of class TSnakeBody

export function TSnakeTail(aBoardCell) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Tail;  //SnakeSheet.Body or SnakeSheet.Tail
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    const rect = sp.getRectangle();
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let newDirection = direction;

    this.draw = function () {
        switch(gameStatus){
        case EGameStatus.Running:
        case EGameStatus.Pause:
        case EGameStatus.GameOver:
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
    };

}//end of class TSnakeTail