"use strict";
import { EDirection } from "./game.js"

export const EBoardCellInfoType = {IsEmpty: 0, IsSnake: 1, IsBait: 2};

/**class for the game board */
export function TBoardCell(aCol, aRow) {
    this.col = aCol;
    this.row = aRow;

    /*this.draw = function (){
        sprite.draw();
        /* switch(gameStatus){
            case EGameStatus.New: 
            sprite.draw();
            break;
        } 
    }*/
}

export function TBoardCellInfo() {
    this.direction = EDirection.Right;
    this.InfoType = EBoardCellInfoType.IsEmpty;
}

