import { HumanLayer } from './HumanLayer'

interface HairProps {
  type: number
  direction: number
  action: string
}

export class HumanHair extends HumanLayer {
  constructor(attrs: HairProps) {
    super('ha', 'human/hair', attrs)
    this.sprite.anchor.set(0.5, 0.8)
  }
}
