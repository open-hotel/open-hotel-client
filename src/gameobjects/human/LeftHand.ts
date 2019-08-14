import { HumanLayer } from './HumanLayer'

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

  constructor(attrs: HandLeftProps) {
    super('lh', 'human/left_hand', attrs)
    this.sprite.anchor.set(0, 0)

    this.sprite.tint = 0xff0000

    this.humanAnimation.onTurn('back', () => {
      console.log('indo pra tras')
      this.sprite.anchor.set(3, -0.14)
      this.sprite.angle = 2
    })

    this.humanAnimation.onTurn('front', () => {
      console.log('indo pra frente')
      this.sprite.anchor.set(-1.2, -0.2)
    })
  }
}
