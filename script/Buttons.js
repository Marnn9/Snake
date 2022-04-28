import * as GLib2D from "./Graphic_Lib_2D.js";
import {sprites, ctx, EGameStatus, gameStatus } from  "./game.js";

"use strict";

/** functions for drawing the buttons, one for each button to get enough info to make each sprites clickable */
export function TStartButton(){
    const pos = new GLib2D.TPoint(350, 300);
    const sprite = new GLib2D.TSprite(sprites.Play, pos);
    const rect = sprite.getRectangle();
    
    this.draw = function (){
        switch(gameStatus){
            case EGameStatus.New:
                ctx.shadowColor = "black";
                sprite.draw();
                ctx.shadowColor = "transparent";
                break;      
        }
    };

    /** function for detecting and use the mouse position*/

    this.isMouseOver = function(aMousePos){
        let isMouseHit = false;
        switch(gameStatus){
            case EGameStatus.New:    
                isMouseHit = rect.checkHitPosition(aMousePos);
                break;   
        }
        return isMouseHit;
    };

}//end of class TStartbutton

export function TReplayButton(){

const posReplay = new GLib2D.TPoint(663,398);
const spriteReplay = new GLib2D.TSprite(sprites.Retry,posReplay);
const rectReplay = spriteReplay.getRectangle();

this.draw = function (){
    switch(gameStatus){
        case EGameStatus.GameOver:
        case EGameStatus.Pause:
            spriteReplay.draw(); 
    break;
    }
    
};

this.isMouseOver = function(aMousePos){
    let isMouseHit = false;
    switch(gameStatus){
        case EGameStatus.GameOver: 
        case EGameStatus.Pause:
            isMouseHit = rectReplay.checkHitPosition(aMousePos);
        break;
    }
    return isMouseHit;
};
}//end of class TReplayButton

export function THomeButton(){
    const posHome = new GLib2D.TPoint(112,398);
    const spriteHome = new GLib2D.TSprite(sprites.Home,posHome);
    const rectHome = spriteHome.getRectangle();
   
    
    this.draw = function (){
        switch(gameStatus){
            case EGameStatus.GameOver:
            case EGameStatus.Pause:
                spriteHome.draw(); 
        break;
        }
    }
    
    this.isMouseOver = function(aMousePos){
        let isMouseHit = false;
        switch(gameStatus){
            case EGameStatus.GameOver: 
            case EGameStatus.Pause:
                isMouseHit = rectHome.checkHitPosition(aMousePos);
            break;
        }
        return isMouseHit;
    };
    }//end of class THomeButton

    export function TResumeButton(){
        const posResume = new GLib2D.TPoint(370,385);
        const spriteResume = new GLib2D.TSprite(sprites.Resume,posResume);
        const rectResume = spriteResume.getRectangle();
        
        this.draw = function (){
            switch(gameStatus){
                case EGameStatus.Pause:
                    spriteResume.draw(); 
            break;
            }
        }
        
        this.isMouseOver = function(aMousePos){
            let isMouseHit = false;
            switch(gameStatus){
                case EGameStatus.Pause:
                    isMouseHit = rectResume.checkHitPosition(aMousePos);
                break;
            }
            return isMouseHit;
        };
        }//end of class TResumeButton