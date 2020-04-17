import * as PIXI from 'pixi.js-legacy'

export interface Vector3Interface {
  x: number
  y: number
  z: number

  add(point: Vector3Interface): Vector3Interface
  scale(point: Vector3Interface): Vector3Interface
  set(x: number, y: number, z: number): Vector3Interface
  clone(): Vector3Interface
  copyTo(point: Vector3Interface): Vector3Interface
  toVector2(): PIXI.Point
  equal(point: Vector3Interface): boolean
}
