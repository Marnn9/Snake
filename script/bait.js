"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { gameStatus, EGameStatus, sprites} from "./game.js"
import { TBoardCell } from "./board.js";


/**Class that makes and draws at a new apple at new random position if it is collition on the bait in update */
export function TBait() {
    const boardCell = new TBoardCell(1, 1);
    const spi = sprites.Bait;
    const pos = new GLib2D.TPoint(Math.floor(Math.random() * 19) + 1, Math.floor(Math.random() * 16) + 1);
    const sprite = new GLib2D.TSprite(spi,pos);

    this.BaitPos = function(){
        return(boardCell)
    }

    this.update = function(){
        let posX = Math.floor(Math.random()* 20);
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
            sprite.draw();
            break;
            }  
    }

}//end of class TBait
