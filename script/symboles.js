import * as GLib2D from "./Graphic_Lib_2D.js";
import {gameStatus ,EGameStatus, sprites} from "./game.js"


/** class that shows the symbols that indicates the scores: apples eaten and GamePoints**/

export function TSymboles(){
    const posEaten = new GLib2D.TPoint(910,45);
    const spriteEaten = new GLib2D.TSprite(sprites.AppleEaten, posEaten );
    const posTrophy = new GLib2D.TPoint(910,145);
    const spriteTrophy = new GLib2D.TSprite(sprites.scoreSymb, posTrophy);


    this.draw = function (){
         switch(gameStatus){
            case EGameStatus.Running:
            case EGameStatus.Pause:
                spriteEaten.draw();
                spriteTrophy.draw();
            break;
        } 
    }

}// end of class TSymbols