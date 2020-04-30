import * as PIXI from 'pixi.js'
import { ObservableVector3 } from '../isometric'
import { Application } from '../Application'
import { Constructor } from '../types'

export function GameObject<TBase extends Constructor<PIXI.DisplayObject>, Attrs extends Record<string, any>>(
  BaseObject: TBase,
) {
  return class extends BaseObject {
    public app: Application
    private _position_map = new ObservableVector3(() => null)
    private _position_iso = new ObservableVector3(p => p.toVector2().copyTo(this.position))
    public attrs: Attrs

    setAttrs(data: Attrs) {
      this.attrs.removeAllListeners()
      for (const [key, value] of Object.entries(data)) {
        this.attrs.$set(key, value)
      }
      return this.attrs
    }

    constructor(...args: any[]) {
      super(...args)
      this.app = Application.get()
    }

    get mapPosition() {
      return this._position_map
    }

    get isoPosition() {
      return this._position_iso
    }
  }
}
