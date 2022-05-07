import * as GLib2D from "./Graphic_Lib_2D.js";
import {sprites, ctx, EGameStatus, gameStatus, gameProps} from  "./game.js";

/**draws the gamescore, counts, places and edit opacity  */
export function TNumber(aSpriteInfo, aPosition, aScale, aAlpha){
    const spi = aSpriteInfo;  
    const pos = aPosition;
    let scale = aScale;
    let alpha = aAlpha;
    const spNumbers = [];  


    function createDigit(){
        const newPos = new GLib2D.TPoint(pos.x - ((spi.width + 2) * spNumbers.length * scale), pos.y);
        const newSprite = new GLib2D.TSprite(spi, newPos);
        newSprite.setScale(scale);
        newSprite.setAlpha(alpha)
        spNumbers.push(newSprite);
    }
    createDigit();

    //draws all the time, rules set in TGamescore;
    this.draw = function(){
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].draw();
        
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


/** shows gamescore when playing, Pause and Gameover: different locations, same score
 * used to gathering information and inserting in TNumber, then to be drawn */

export function TGameScore() {
    const EndPoints = new TNumber(sprites.Number, new GLib2D.TPoint(730,260), 1, 1);
    const Points = new TNumber(sprites.Number, new GLib2D.TPoint(820,130), 1, 0.3);
    const appleScore = new TNumber(sprites.Number, new GLib2D.TPoint(820,20), 1, 0.3);
    let score = 0;
    let Apple = 0; //number of apples eaten

    this.draw = function(){
        switch(gameStatus){
            case EGameStatus.Running:
            case EGameStatus.Pause:    
            Points.draw();
            appleScore.draw();
            break;
            case EGameStatus.GameOver:
                EndPoints.draw();
                break;   
        }
    }

    this.update = function(){
        EndPoints.update(score);
        Points.update(score);
        appleScore.update(score);
    }

      this.setScore = function(aDelta, anApple){
        score += aDelta;
        Apple += anApple;
       EndPoints.update(score);
       Points.update(score);
       appleScore.update(Apple);
    } 

    this.getScore = function(){
        return score + appleScore;
    } 

    this.resetPoints =function(){ 
       score = 0;
       Apple = 0;
    };

}//end of class TGameScore
