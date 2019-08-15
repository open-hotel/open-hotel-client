import { HumanLayer } from './HumanLayer'
import { THumanDirection } from './HumanAnimation'

interface HandLeftProps {
  type: number
  direction: THumanDirection
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

  constructor(attrs: HandLeftProps) {
    super('lh', 'human/left_hand', attrs)
    this.sprite.anchor.set(0, 0)

    const anchor = (x: number, y: number) => this.sprite.anchor.set(x, y)
    const animate = this.humanAnimation

    animate.onTurn('back', () => {
      anchor(2.6, -0.14)
    })

    animate.onTurn('front', () => {
      anchor(-1.2, -0.2)
    })

    animate.onTurn('right', () => {
      anchor(-1.2, -0.2)
    })

    animate.onTurn('left', () => anchor(2.9, -0.1))

    animate
      .onFrame(3)
      .to(6)
      .ofDirection('back')
      .listen(() => anchor(2.4, -0.14))

    animate.onFrame(3, () => anchor(2.5, -0.2)).ofDirection('left')
    animate.onFrame(0, () => anchor(2.9, -0.1)).ofDirection('left')
  }
}
