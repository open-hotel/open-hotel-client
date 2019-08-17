import { HumanLayer } from './HumanLayer'

interface HairProps {
  type: number
  direction: number
  action: string
}

export class HumanHair extends HumanLayer {
  constructor(attrs: HairProps) {
    super('hr', 'human/hair', attrs, 'hair_F_backbun_h')

    const anim = this.humanAnimation

    anim.turns({
      front: this.anchorsC(0.55, 0.9),
      right: this.anchorsC(0.66, 0.9),
    })
  }
}
