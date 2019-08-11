import { Vector3 } from "./isometric/Vector3";
import { ObservableVector3 } from "./isometric";
import { Floor } from "../../gameobjects/room/Floor";
import { Tween, Easing } from "@tweenjs/tween.js";
import { IObservable, Observable } from "./Observable";
import { Application } from "../Application";

export class GameObject<Attrs = object> extends PIXI.Sprite {
  public app: Application
  public floor: Floor
  private _position_map = new ObservableVector3(() => null)
  private _position_iso = new ObservableVector3((p) => p.toVector2().copyTo(this.position))
  private _tween_position = new Tween()
  public readonly attrs2: IObservable<Attrs>

  constructor (attrs?: Attrs) {
    super()
    this.attrs2 = Observable.create<Attrs>(attrs)
    this.app = Application.get()
  }

  private attrs: { [key:string]:any } = {
    isoPosition: new Vector3()
  }

  get mapPosition () {
    return this._position_map
  }

  get isoPosition () {
    return this._position_iso
  }

  public set (key:string, value: any) {
    this.attrs[key] = value
    return this
  }

  public get (key:string, defaultValue?: any) {
    return this.attrs[key] === undefined ? defaultValue : this.attrs[key]
  }

  public del (key:string) {
    delete this.attrs[key];
    return this
  }

  moveTo (point:PIXI.IPoint|Vector3, duration: number = 500): Promise<void> {
    return new Promise(resolve => {
      const currentPosition = point instanceof Vector3 ? this.isoPosition : this.position
      this._tween_position.stop()
      this._tween_position = new Tween(currentPosition.clone())
        .to(point.clone(), duration)
        .onComplete(resolve)
        .onUpdate((point) => point.copyTo(currentPosition))
        .start()
    })
  }
}
