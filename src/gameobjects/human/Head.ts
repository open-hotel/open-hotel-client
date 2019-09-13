import { HumanLayer } from './HumanLayer'
import { HumanHair, hairs } from './Hair'
import { HumanEyes } from './Eyes'
import { HumanFace } from './Face'
import { random } from '@/engine/lib/utils/Util'

interface HeadProps {
  type: number
  direction: number
  action: string
}

export class HumanHead extends HumanLayer {
  public hair: HumanHair
  public eyes: HumanEyes
  public face: HumanFace

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
    this.face = new HumanFace({
      action: 'std',
      prefix: 'hh_human_face_h',
      direction: attrs.direction,
      type: 1,
    })

    this.sortableChildren = true
    this.eyes.zIndex = this.face.zIndex + 1

    this.addChild(this.hair)
    this.addChild(this.eyes)
    this.addChild(this.face)

    this.attrs2.watch('direction', newDirection => {
      this.hair.attrs2.direction = newDirection
      this.eyes.attrs2.direction = newDirection
      this.face.attrs2.direction = newDirection
      this.updatePositions()
    })

    const blink = () => {
      this.eyes.blink()
      setTimeout(blink, random(3000, 6000))
    }

    setTimeout(blink, random(1000, 5000))
  }

  updatePositions() {
    const { direction } = this.attrs2
    if (direction === 1) {
      this.face.position.set(14, -10)
      this.eyes.position.set(14, -10)
    } else if (direction === 2) {
      this.face.position.set(7, -7)
      this.eyes.position.set(7, -7)
    } else if (direction === 3) {
      this.face.position.set(0, -2)
      this.eyes.position.set(0, -7)
    } else if (direction === 4) {
      this.face.position.set(-7, -7)
      this.eyes.position.set(-7, -7)
    } else if (direction === 5) {
      this.face.position.set(-14, -10)
      this.eyes.position.set(-14, -10)
    }
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
