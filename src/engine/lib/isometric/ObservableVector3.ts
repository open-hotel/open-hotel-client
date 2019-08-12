import { Vector3 } from './Vector3'
import { Vector3Interface } from './IVector3'

type IsoPointListener = (newPoint: Vector3Interface, oldPoint: Vector3Interface) => any

export class ObservableVector3 extends Vector3 {
  private _x: number
  private _y: number
  private _z: number

  constructor(private readonly cb: IsoPointListener, x: number = 0, y: number = 0, z: number = 0) {
    super()

    this._x = x
    this._y = y
    this._z = z
  }

  get x() {
    return this._x
  }

  set x(value: number) {
    const oldPoint = this.clone()
    this._x = value
    this.notify(this, oldPoint)
  }

  get y() {
    return this._y
  }

  set y(value: number) {
    const oldPoint = this.clone()
    this._y = value
    this.notify(this, oldPoint)
  }

  get z() {
    return this._z
  }

  set z(value: number) {
    const oldPoint = this.clone()
    this._z = value
    this.notify(this, oldPoint)
  }

  private notify(newPoint: Vector3Interface, oldPoint: Vector3Interface) {
    if (this.cb) this.cb(newPoint, oldPoint)
  }

  set(x: number, y: number, z: number): ObservableVector3 {
    const oldPoint = this.clone()

    this._x = x
    this._y = y
    this._z = z

    this.notify(this, oldPoint)

    return this
  }
}
