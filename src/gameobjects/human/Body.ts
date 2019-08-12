import { HumanLayer } from './HumanLayer'

interface BodyProps {
  type: number
  direction: number
  action: string
}

export class HumanBody extends HumanLayer {
  static flips: {
    [k: number]: number
  } = {
    4: 2,
    5: 1,
    6: 0,
  }

  constructor(attrs: BodyProps) {
    super('bd', 'human/body', attrs)

    this.sprite.anchor.set(0.5, 1)
  }

  idle() {
    this.attrs2.action = 'std'
    this.sprite.stop()
  }

  walk() {
    this.attrs2.action = 'wlk'
    this.sprite.play()
  }
}
