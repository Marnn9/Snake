"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { gameStatus, EGameStatus, sprites} from "./game.js"
import { TBoardCell } from "./board.js";


/**Class that makes and checks for collition on the bait */
export function TBait() {
    const boardCell = new TBoardCell(1, 1);
    const spi = sprites.Bait;
    const pos = new GLib2D.TPoint(Math.floor(Math.random() * 23) + 1, Math.floor(Math.random() * 18) + 1);
    const sprite = new GLib2D.TSprite(spi,pos);
    const centerPos = new GLib2D.TPoint(0,0);

    this.BaitPos = function(){
        return(boardCell)
    }

    this.update = function(){
        let posX = Math.floor(Math.random()* 23);
        let posY = Math.floor(Math.random()* 17);
        boardCell.row = posX;
        boardCell.col = posY;
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
        sprite.pos = pos;
        sprite.draw;

    }

    this.draw = function () { 
        switch(gameStatus){
            case EGameStatus.Running:
            case EGameStatus.Pause:
            case EGameStatus.GameOver:
            sprite.draw();
            break;
            }  
    }

   /*  this.checkCollision = function (aRect){
        centerPos.x = pos.x + spi.width/2;
        centerPos.y = pos.y + spi.height/2;
        return aRect.checkHitPosition(centerPos);
    } */

}//end of class TBait
