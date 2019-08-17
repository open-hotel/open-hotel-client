import { HumanLayer } from './HumanLayer'

interface HairProps {
  type: number
  direction: number
  action: string
}

export class HumanHair extends HumanLayer {
  constructor(attrs: HairProps) {
    super('hr', 'human/hair', attrs, 'hair_F_backbun_h')
    this.sprite.anchor.set(0.5, 0.85)
  }
}
