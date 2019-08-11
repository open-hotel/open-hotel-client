import { Vector3 as Vector3 } from './Vector3';
import { IVector3 } from './IVector3';
import { ObservablePoint } from 'pixi.js';

type IsoPointListener = (newPoint:IVector3, oldPoint:IVector3) => any

export class ObservableVector3 extends Vector3 {
    private _x:number
    private _y:number
    private _z:number

    constructor (
        private readonly cb: IsoPointListener,
        x: number = 0,
        y: number = 0,
        z: number = 0,
    ) {
        super()

        this._x = x
        this._y = y
        this._z = z
    }

    get x () {
        return this._x
    }

    get y () {
        return this._y
    }

    get z () {
        return this._z
    }

    set x (value: number) {
        const oldPoint = this.clone()
        this._x = value
        this.notify(this, oldPoint)
    }

    set y (value: number) {
        const oldPoint = this.clone()
        this._y = value
        this.notify(this, oldPoint)
    }

    set z (value: number) {
        const oldPoint = this.clone()
        this._z = value
        this.notify(this, oldPoint)
    }

    private notify (newPoint: IVector3, oldPoint:IVector3) {
        if (this.cb) this.cb(newPoint, oldPoint)
    }

    set (x: number, y: number, z: number): ObservableVector3 {
        const oldPoint = this.clone()

        this._x = x
        this._y = y
        this._z = z
        
        this.notify(this, oldPoint)

        return this
    }
}