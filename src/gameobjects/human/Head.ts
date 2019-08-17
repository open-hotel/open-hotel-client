import { HumanLayer } from './HumanLayer'
import { HumanHair } from './Hair'

interface HeadProps {
  type: number
  direction: number
  action: string
}

export class HumanHead extends HumanLayer {
  private hair: HumanHair

  constructor(attrs: HeadProps) {
    super('hd', 'human/head', attrs)
    this.sprite.anchor.set(0.5, 0.75)
    this.zIndex = 1

    this.hair = new HumanHair({
      type: 2321,
      action: 'std',
      direction: this.attrs2.direction,
    })

    this.addChild(this.hair)

    this.attrs2.watch('direction', newDirection => {
      this.hair.attrs2.$set('direction', newDirection)
    })
  }

  speak(time = 1000) {
    if (this.attrs2.action === 'std') this.attrs2.action = 'spk'
    this.sprite.play()
    setTimeout(() => this.stop(), time)
  }

  stop() {
    this.sprite.stop()
    if (this.attrs2.action === 'spk') this.attrs2.action = 'std'
  }
}
