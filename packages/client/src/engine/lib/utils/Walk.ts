import TWEEN from '@tweenjs/tween.js'
import { Constructor } from '@/engine/types'
import { IPoint } from 'pixi.js'

export interface PointLike {
  x: number
  y: number
}

export class WalkRunner {
  private _cancel = false

  constructor(public obj: PIXI.DisplayObject, public tween: TWEEN.Tween) {}

  async follow(points: number[][], onStep: (point?: number[], index?: number) => any, stepDuration = 400) {
    points = points.slice(0)
    let step: number[] = null
    let i = 0

    while (!this._cancel && (step = points.shift())) {
      await onStep(step, i++)
    }

    return !this._cancel
  }

  cancel() {
    this._cancel = true
    if (this.tween) this.tween.stop()
  }
}

export function Walkable<TBase extends Constructor<PIXI.DisplayObject>>(Base: TBase) {
  return class extends Base {
    public _tween: TWEEN.Tween
    private _walk = new WalkRunner(this, this._tween)

    followPath(points: number[][], onStep: (point?: number[], index?: number) => any, stepDuration = 300) {
      this._walk.cancel()
      this._walk = this._walk = new WalkRunner(this, this._tween)
      return this._walk.follow(points, onStep, stepDuration)
    }

    moveTo(position: IPoint, duration = 400) {
      return new Promise(resolve => {
        if (this._tween) this._tween.stop()
        this._tween = new TWEEN.Tween(this.position.clone())
          .to(position, duration)
          .onUpdate((p: PIXI.IPoint) => this.position.set(p.x, p.y))
          .onComplete(resolve)
          .start()
      })
    }
  }
}
