import { HumanLayer } from './HumanLayer'

interface HeadProps {
  type: number
  direction: number
  action: string
}

export class HumanHead extends HumanLayer {
  static flips: {
    [k: number]: number
  } = {
    4: 2,
    5: 1,
    6: 0,
  }

  constructor(attrs: HeadProps) {
    super('hd', 'human/head', attrs)
    this.sprite.anchor.set(0.5, 0.75)
    this.zIndex = 1
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
