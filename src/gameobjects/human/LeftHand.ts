import { HumanLayer } from './HumanLayer'
import { HumanDirection, THumanDirection } from './Human'

interface HandLeftProps {
  type: number
  direction: number
  action: string
}

export class HumanLeftHand extends HumanLayer {
  static flips: {
    [k: number]: number
  } = {
    4: 2,
    5: 1,
    6: 0,
  }

  private lastDirection: THumanDirection | -1 = -1

  constructor(attrs: HandLeftProps) {
    super('lh', 'human/left_hand', attrs)
    this.sprite.anchor.set(0, 0)

    this.sprite.tint = 0xff0000

    this.attrs2.watch('direction', direction => this.fixPosition(direction))
  }

  private fixPosition(direction: THumanDirection) {
    if (this.lastDirection === direction) {
      return
    }
    this.lastDirection = direction

    const switcher = {
      [HumanDirection.BACK]: () => {
        console.log('indo pra tras')
        this.sprite.anchor.set(3, -0.14)
        this.sprite.angle = 2
      },
      [HumanDirection.FRONT]: () => {
        console.log('indo pra frente')
        this.sprite.anchor.set(-1.2, -0.2)
      },
    }

    switcher[direction] && switcher[direction]()
  }
}
