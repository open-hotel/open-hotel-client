import TWEEN from '@tweenjs/tween.js'
import { Constructor } from '@/engine/types'
import { GameObject } from '../GameObject'
import { IPoint } from 'pixi.js'

export interface PointLike {
  x: number
  y: number
}

export class WalkRunner implements PromiseLike<any> {
  private _cancel = false
  private _task: Promise<boolean>

  constructor(public obj: PIXI.DisplayObject, public tween: TWEEN.Tween) {}

  then(onFinishOrCancel?: (finished: boolean) => any | PromiseLike<any>) {
    return this._task.then(onFinishOrCancel)
  }

  follow(points: PointLike[], onStep: (point?: PointLike, index?: number) => any, stepDuration = 400) {
    points = points.slice(0)
    // eslint-disable-next-line no-async-promise-executor
    this._task = new Promise(async (resolve, reject) => {
      let step: PointLike = null
      let i = 0

      while (!this._cancel && (step = points.shift())) {
        await onStep(step, i++)
      }

      return resolve(!this._cancel)
    })

    return this
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

    followPath(points: PointLike[], onStep: (point?: PointLike, index?: number) => any, stepDuration = 300) {
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
