import { HumanLayer } from './HumanLayer'
import { HumanHair, hairs } from './Hair'
import { HumanFace } from './Face'

interface HeadProps {
  type: number
  direction: number
  action: string
}

export class HumanHead extends HumanLayer {
  private hair: HumanHair
  private face: HumanFace

  constructor(attrs: HeadProps) {
    super('hd', 'human/head', attrs)
    // this.sprite.anchor.set(0.5, 0.75)
    this.zIndex = 1

    this.hair = new HumanHair(hairs[0])
    this.face = new HumanFace({
      action: 'std',
      prefix: 'hh_human_face_h',
      type: 1,
    })

    this.addChild(this.hair)
    this.addChild(this.face)

    this.attrs2.watch('direction', newDirection => {
      this.hair.attrs2.direction = newDirection
      this.face.attrs2.direction = newDirection
    })
  }

  speak(time = 1000) {
    if (this.attrs2.action === 'std') {
      this.attrs2.action = 'spk'
      this.face.attrs2.action = 'spk'
    }
    this.sprite.play()
    setTimeout(() => this.stop(), time)
  }

  stop() {
    this.sprite.stop()
    if (this.attrs2.action === 'spk') {
      this.attrs2.action = 'std'
      this.face.attrs2.action = 'std'
    }
  }
}
