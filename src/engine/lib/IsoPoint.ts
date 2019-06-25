import * as PIXI from 'pixi.js'
import * as iso from '@randallmorey/isometryjs'

export interface IsoPointObject { x:number, y:number, z:number }
export type IsoPointLike = IsoPoint | IsoPointObject | [number, number, number]

export class IsoPoint {
    static iso2Cart (
        isoX:number = 0, 
        isoY:number = 0, 
        isoZ:number = 0,
        rotation: number = 30
    ) {
        const [x, y] = iso.makeIsometricTransform(rotation)(isoX, isoY, isoZ)
        return new PIXI.Point(x, y);
    }
    
    static cart2Iso (cartX: number, cartY: number, isoZ = 0) {
        const x = cartY - cartX;
        const y = (cartY + cartX);
        return new IsoPoint(x, y);
    }
    
    constructor (
        public x:number = 0,
        public y:number = 0,
        public z:number = 0
    ) {}

    static from(point:IsoPointLike|PIXI.Point, copy = true, isoZ = 0):IsoPoint {
        if (point instanceof IsoPoint) return copy ? point.copy() : point
        if (point instanceof PIXI.Point) return IsoPoint.cart2Iso(point.x, point.y, isoZ)
        if (Array.isArray(point)) return new IsoPoint(point[0], point[1], point[2])
    }

    add (x = 0, y = x, z = y) {
        this.x += x
        this.y += y
        this.z += z

        return this
    }

    scale (x = 1, y = x, z = y) {
        this.x *= x
        this.y *= y
        this.z *= z

        return this
    }

    set (x = 1, y = x, z = y) {
        this.x = x
        this.y = y
        this.z = z

        return this
    }

    copy (): IsoPoint {
        return new IsoPoint(this.x, this.y, this.z)
    }

    applyIn (obj:IsoPointObject) {
        obj.x = this.x
        obj.y = this.y
        obj.z = this.z
    }

    toPoint (d?:number): PIXI.Point {
        const p = IsoPoint.iso2Cart(this.x, this.y, this.z, d)
        return new PIXI.Point(p.x, p.y)
    }
}