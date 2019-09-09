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
  }
}
