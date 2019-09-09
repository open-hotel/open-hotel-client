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
  }
}
