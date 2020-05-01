import * as PIXI from 'pixi.js'
import { IsometricUtils } from '../isometric/IsometricUtils'

export interface IsoPointObject {
  x: number
  y: number
  z: number
}
export type IsoPointLike = IsoPoint | IsoPointObject | [number, number, number]

export class IsoPoint {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  static from(point: IsoPointLike, copy = true): IsoPoint {
    if (point instanceof IsoPoint) return copy ? point.copy() : point
    if (Array.isArray(point)) return new IsoPoint(point[0], point[1], point[2])
  }

  static isIsoPoint(value:any): value is IsoPointObject {
    return typeof value === 'object' && 'x' in value && 'y' in value && 'z' in value
  }

  add(point: IsoPointObject): this;
  add(x?: number, y?: number, z?: number): this;
  add(xOrPoint: number | IsoPointObject = 0, y?: number, z?: number): this {
    if (IsoPoint.isIsoPoint(xOrPoint)) {
      this.x += xOrPoint.x
      this.y += xOrPoint.y
      this.z += xOrPoint.z
    } else {
      this.x += xOrPoint
      this.y += y
      this.z += z
    }

    return this
  }

  scale(x = 1, y = x, z = y) {
    this.x *= x
    this.y *= y
    this.z *= z

    return this
  }

  set(x = 1, y = x, z = y) {
    this.x = x
    this.y = y
    this.z = z

    return this
  }

  copy(): IsoPoint {
    return new IsoPoint(this.x, this.y, this.z)
  }

  applyIn(obj: IsoPointObject) {
    obj.x = this.x
    obj.y = this.y
    obj.z = this.z
  }

  toPoint(): PIXI.Point {
    const p = IsometricUtils.cartToIso(this.x, this.y, this.z)
    return new PIXI.Point(p.x, p.y)
  }

  static fromPoint (point: PIXI.IPoint, z = 0) {
    const p = IsometricUtils.isoToCart(point.x, point.y, z)
    return new IsoPoint(p.x, p.y, z)
  }
}
