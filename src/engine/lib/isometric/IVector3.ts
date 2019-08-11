import * as PIXI from 'pixi.js'

export interface IVector3 {
    x: number;
    y: number;
    z: number;

    add (point: IVector3): IVector3;
    scale (point: IVector3): IVector3;
    set (x: number, y: number, z: number): IVector3;
    clone ():IVector3
    copyTo(point: IVector3): IVector3
    toVector2 (): PIXI.IPoint
    equal (point: IVector3): boolean
}