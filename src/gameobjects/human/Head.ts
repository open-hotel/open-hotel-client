import { HumanLayer } from './HumanLayer'
import { HumanHair, hairs } from './Hair'
import { HumanEyes } from './Eyes'

interface HeadProps {
  type: number
  direction: number
  action: string
}

export class HumanHead extends HumanLayer {
  private hair: HumanHair
  private eyes: HumanEyes

  constructor(attrs: HeadProps) {
    super('hd', 'human/head', attrs)
    this.zIndex = 1

    this.hair = new HumanHair(hairs[0])
    this.eyes = new HumanEyes({
      action: 'std',
      prefix: 'hh_human_face_h',
      direction: attrs.direction,
      type: 1,
    })

    this.addChild(this.hair)
    this.addChild(this.eyes)

    this.attrs2.watch('direction', newDirection => {
      this.hair.attrs2.direction = newDirection
      this.eyes.attrs2.direction = newDirection
    })
  }

  speak(time = 1000) {
    if (this.attrs2.action === 'std') {
      this.attrs2.action = 'spk'
      this.eyes.attrs2.action = 'spk'
    }
    this.sprite.play()
    setTimeout(() => this.stop(), time)
  }

  stop() {
    this.sprite.stop()
    if (this.attrs2.action === 'spk') {
      this.attrs2.action = 'std'
      this.eyes.attrs2.action = 'std'
    }
  }
}
