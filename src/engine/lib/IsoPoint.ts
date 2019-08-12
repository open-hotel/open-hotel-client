import * as PIXI from 'pixi.js'
import { IsometricUtils } from './isometric/IsometricUtils'

export interface IsoPointObject {
  x: number
  y: number
  z: number
}
export type IsoPointLike = IsoPoint | IsoPointObject | [number, number, number]

export class IsoPoint {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  static from(point: IsoPointLike | PIXI.Point, copy = true): IsoPoint {
    if (point instanceof IsoPoint) return copy ? point.copy() : point
    if (Array.isArray(point)) return new IsoPoint(point[0], point[1], point[2])
  }

  add(x = 0, y = x, z = y) {
    this.x += x
    this.y += y
    this.z += z

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
}
