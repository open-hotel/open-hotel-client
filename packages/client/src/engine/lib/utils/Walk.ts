import TWEEN from '@tweenjs/tween.js'

interface PointLike {
  x: number
  y: number
}

export class Walkable {
  public tween: TWEEN.Tween

  constructor(public object?: PIXI.DisplayObject) {
    this.tween = new TWEEN.Tween(object.position.clone())
  }

  async moveTo(position: PointLike, duration: number = 400) {
    return new Promise(resolve => {
      this.tween.stop()
      this.tween = new TWEEN.Tween(this.object.position.clone())
        .to(position, duration)
        .onUpdate((p: PIXI.IPoint) => this.object.position.set(p.x, p.y))
        .onComplete(resolve)
        .start()
    })
  }

  async followPath(
    path: PointLike[],
    duration: number = 400,
    cb: (point: PointLike, index: number) => any = () => null,
  ) {
    return this.forEachPath(path, async (p, i) => {
      await cb(p, i)
      return this.moveTo(p, duration)
    })
  }

  async forEachPath(path: PointLike[], cb: (point: PointLike, index: number) => any = () => null) {
    let p,
      i = 0
    while ((p = path.shift())) {
      await cb(p, i++)
    }
  }

  static cancelSwitch = false

  static async walk(path: PointLike[], cb: (point: PointLike, index: number) => Promise<any> | any) {
    let i = 0
    let { length } = path

    while (i < length) {
      if (this.cancelSwitch) {
        this.cancelSwitch = false
        return
      }
      await cb(path[i], i++)
    }
  }
}
