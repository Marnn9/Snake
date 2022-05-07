 "use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import {gameStatus ,EGameStatus, sprites} from "./game.js"


/** class to make the board that appears when you die: GameOver**/

export function TInfoboard(){
    const spi = sprites.GameOver;
    const posBoard = new GLib2D.TPoint(50, 50 );
    const spriteBoard = new GLib2D.TSprite(spi, posBoard);
   
    this.draw = function (){
         switch(gameStatus){
            case EGameStatus.GameOver:
                 spriteBoard.draw();
            break;
        } 
    }

}// end of class TInfoboard