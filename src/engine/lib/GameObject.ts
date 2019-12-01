import * as PIXI from 'pixi.js'
import { Vector3 } from '../isometric/Vector3'
import { ObservableVector3 } from '../isometric'
import TWEEN from '@tweenjs/tween.js'
import { IObservable, Observable } from './Observable'
import { Application } from '../Application'

export class GameObject<Attrs = object> extends PIXI.Sprite {
  public app: Application
  private _position_map = new ObservableVector3(() => null)
  private _position_iso = new ObservableVector3(p => p.toVector2().copyTo(this.position))
  public readonly attrs: IObservable<Attrs>

  constructor(attrs?: Attrs) {
    super()
    this.attrs = Observable.create<Attrs>(attrs)
    this.app = Application.get()
  }

  get mapPosition() {
    return this._position_map
  }

  get isoPosition() {
    return this._position_iso
  }
}
