import * as GLib2D from "./Graphic_Lib_2D.js";
import {sprites, ctx, EGameStatus, gameStatus} from  "./game.js";

/**draws the gamescore, counts, places and edit opacity  */
export function TNumber(aSpriteInfo, aPosition, aScale, aAlpha){
    const spi = aSpriteInfo;  
    const pos = aPosition;
    let scale = aScale;
    let alpha = aAlpha;
    const spNumbers = [];  

   /*  for(let i = 0; i < scale; i++){
        const newPos = new GLib2D.TPoint(pos.x - (spi.width * i), pos.y);
        spNumbers.push(new GLib2D.TSprite(spi, newPos));
    }  */

    function createDigit(){
        const newPos = new GLib2D.TPoint(pos.x - ((spi.width + 2) * spNumbers.length * scale), pos.y);
        const newSprite = new GLib2D.TSprite(spi, newPos);
        newSprite.setScale(scale);
        newSprite.setAlpha(alpha)
        spNumbers.push(newSprite);
    }
    createDigit();

    this.draw = function(){
        switch(gameStatus){
        case EGameStatus.GameOver:
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].draw();
        }
        break;
        }
    }

    this.update = function(aValue){
        if(aValue < 0){
            return 0;
        }
        const digits = aValue.toString().length;
        while(digits > spNumbers.length){
            createDigit();
        }
        while(digits < spNumbers.length){
            spNumbers.pop();
        }
        let divider = 1;
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].setIndex(Math.floor(aValue/divider) % 10);
            divider *= 10;
        }
        return aValue;
    }

    this.setAlpha = function(aAlpha){
        alpha = aAlpha;
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].setAlpha(alpha);
        }
    }

    this.setScale = function(aScale){
        scale = aScale;
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].setAlpha(scale);
        }
    }

}//end of class TNumber


/** shows gamescore when playing */

export function TGameScore() {
    const Points = new TNumber(sprites.Number, new GLib2D.TPoint(400,400), 1, 1);
    const EndPoints = new TNumber(sprites.Number, (200,200), 1, 1);
    /* const spi = sprites.Number;
    const pos = new GLib2D.TPoint(50,20);
    const posEnd = new GLib2D.TPoint(40,40);
    const number = new TNumber(spi, pos, 4, 0);
    const EndNumber = new TNumber(spi, posEnd, 4, 0);
    let score = 0; */

    this.draw = function(){
        switch(gameStatus){
            case EGameStatus.Running:
                Points.draw();
                break;
            case EGameStatus.GameOver:
                EndPoints.draw();
                break;   
        }
    }

     this.setScore = function(aDelta){
       if(aDelta > 0){
        score += aDelta;
       Points.update(score);
       EndPoints.update(score);
    }
    }

    this.getScore = function(){
        return score;
    } 

}//end of class TGameScore