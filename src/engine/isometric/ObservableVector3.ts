import { Vector3 } from './Vector3'
import { Vector3Interface } from './IVector3'

type IsoPointListener = (newPoint: Vector3Interface, oldPoint: Vector3Interface) => any

export class ObservableVector3 extends Vector3 {
  private _x: number
  private _y: number
  private _z: number
  private _cb: IsoPointListener

  constructor(cb: IsoPointListener, x: number = 0, y: number = 0, z: number = 0) {
    super()

    this._x = x
    this._y = y
    this._z = z

    Object.defineProperties(this, {
      _x: {
        enumerable: false,
        value: x,
      },
      _y: {
        enumerable: false,
        value: y,
      },
      _z: {
        enumerable: false,
        value: z,
      },
      _cb: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: cb,
      },
    })
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
    if (this._cb) this._cb(newPoint, oldPoint)
  }

  set(x: number, y: number, z: number): ObservableVector3 {
    const oldPoint = this.clone()

    this._x = x
    this._y = y
    this._z = z

    this.notify(this, oldPoint)

    return this
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    }
  }
  toArray() {
    return [this.x, this.y, this.z]
  }

  valueOf() {
    return this.toObject()
  }
}
