import { HumanLayer } from "./HumanLayer";

interface IBody {
  type: number,
  direction: number,
  action: string
}

export class HumanBody extends HumanLayer {
  static flips: {[k:number]: number} = {
    4: 2,
    5: 1,
    6: 0
  }

  constructor (attrs:IBody) {
    super('bd', 'human/body', attrs)

    this.sprite.anchor.set(.5, 1)
  }

  idle () {
    this.attrs2.action = 'std'
    this.sprite.stop()
  }

  walk () {
    this.attrs2.action = 'wlk'
    this.sprite.play()
  }
}