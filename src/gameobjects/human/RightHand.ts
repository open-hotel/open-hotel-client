import { HumanLayer } from './HumanLayer'
import { THumanDirection, HumanDirection } from './Human'

interface HandRightProps {
  type: number
  direction: number
  action: string
}

export class HumanRightHand extends HumanLayer {
  static flips: {
    [k: number]: number
  } = {
    4: 2,
    5: 1,
    6: 0,
  }

  private lastDirection: THumanDirection | -1 = -1

  constructor(attrs: HandRightProps) {
    super('rh', 'human/right_hand', attrs)
    this.sprite.anchor.set(0.75, 0.25)

    // this.sprite.onFrameChange = f => {
    //   console.log('frame', f)
    //   // if (f === 3) {
    //   //   this.sprite.anchor.set(0.5, 0)
    //   // }
    //   // else {
    //   //   this.sprite.anchor.set(.75, 0)
    //   // }
    // }

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
        this.sprite.anchor.set(0.2, 0.2)
      },
      [HumanDirection.FRONT]: () => {
        console.log('indo pra frente')
        this.sprite.anchor.set(0.68, 0.2)
      },
    }

    switcher[direction] && switcher[direction]()
  }
}
