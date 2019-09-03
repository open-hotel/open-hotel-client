import { HumanLayer } from './HumanLayer'
import { THumanDirection } from './HumanAnimation'

interface HandRightProps {
  type: number
  direction: THumanDirection
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
    // this.sprite.anchor.set(0.75, 0.25)

    // const anchor = (x: number, y: number) => this.sprite.anchor.set(x, y)
    // const animate = this.humanAnimation

    // animate.onTurn('back', () => {
    //   anchor(0.25, 0.2)
    // })

    // animate.onTurn('front', () => {
    //   anchor(0.68, 0.2)
    // })

    // animate.onTurn('right', () => {
    //   anchor(2.5, 0.2)
    // })

    // animate.onTurn('left', () => {
    //   anchor(-0.8, 0.2)
    // })

    // animate
    //   .onFrame(0, () => {
    //     anchor(2.5, 0.2)
    //   })
    //   .ofDirection('right')

    // animate
    //   .onFrame(1, () => {
    //     anchor(2.1, 0.2)
    //   })
    //   .ofDirection('right')

    // animate
    //   .onFrame(3, () => {
    //     anchor(1.6, 0.25)
    //   })
    //   .ofDirection('right')
  }
}
