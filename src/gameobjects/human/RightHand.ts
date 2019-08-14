import { HumanLayer } from './HumanLayer'

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

    const anchor = (x: number, y: number) => this.sprite.anchor.set(x, y)

    this.humanAnimation
      .onFrame(3, () => {
        anchor(20, 20)
      })
      .ofDirection('front')

    this.humanAnimation.onTurn('back', () => {
      console.log('indo pra tras')
      anchor(0.2, 0.2)
    })

    this.humanAnimation.onTurn('front', () => {
      console.log('indo pra frente')
      anchor(0.68, 0.2)
    })
  }
}
