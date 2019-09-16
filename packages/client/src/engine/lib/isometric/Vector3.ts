import * as PIXI from 'pixi.js'
import { IsometricUtils } from './IsometricUtils'
import { Vector3Interface } from './IVector3'

export interface IsoPointObject {
  x: number
  y: number
  z: number
}
export type IsoPointLike = Vector3 | IsoPointObject | [number, number, number]

export class Vector3 implements Vector3Interface {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  static from(point: IsoPointLike | PIXI.Point, copy = true): Vector3 {
    if (point instanceof Vector3) return copy ? point.clone() : point
    if (Array.isArray(point)) return new Vector3(point[0], point[1], point[2])
  }

  add(point: Vector3Interface): Vector3 {
    return new Vector3(this.x + point.x, this.y + point.y, this.z + point.z)
  }
  scale(point: Vector3Interface): Vector3 {
    return new Vector3(this.x * point.x, this.y * point.y, this.z * point.z)
  }

  set(x: number, y: number, z: number): Vector3 {
    this.x = x
    this.y = y
    this.z = z

    return this
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  copyTo(point: Vector3Interface): Vector3 {
    return point.set(this.x, this.y, this.z)
  }

  toVector2(): PIXI.IPoint {
    return IsometricUtils.cartToIso(this.x, this.y, this.z)
  }

  equal(point: Vector3Interface): boolean {
    return this.x === point.x && this.y === point.y && this.z === point.z
  }
}
