import { GameObject } from '../../engine/lib/GameObject'
import { HumanHead } from './Head'
import { HumanBody } from './Body'
import { random } from '../../engine/lib/utils/Util'
import { HumanLeftHand } from './LeftHand'
import { HumanRightHand } from './RightHand'

export type THumanDirection = 0 | 2 | 4 | 6

export const HumanDirection = {
  FRONT: 2,
  LEFT: 0,
  RIGHT: 4,
  BACK: 6,
}

interface HumanProps {
  direction: THumanDirection
  isLay: boolean
  isSpeak: boolean
  isIdle: boolean
  isWalk: boolean
}

export class Human extends GameObject<HumanProps> {
  public readonly head: HumanHead
  public readonly body: HumanBody
  public readonly leftHand: HumanLeftHand
  public readonly rightHand: HumanRightHand

  constructor() {
    super({
      direction: 2,
      isIdle: false,
      isLay: false,
      isSpeak: false,
      isWalk: false,
    })

    this.interactive = true
    this.sortableChildren = true

    this.addListener('pointertap', () => this.head.speak(5000))

    this.head = new HumanHead({
      type: 1,
      action: 'std',
      direction: this.attrs2.direction,
    })

    this.body = new HumanBody({
      type: 1,
      action: 'std',
      direction: this.attrs2.direction,
    })

    this.leftHand = new HumanLeftHand({
      type: 1,
      action: 'std',
      direction: this.attrs2.direction,
    })

    this.rightHand = new HumanRightHand({
      type: 1,
      action: 'std',
      direction: this.attrs2.direction,
    })

    this.head.addChild(this.leftHand, this.rightHand)

    this.attrs2.addListener(() => this.updateLayers())
    this.body.addChild(this.head)

    this.addChild(this.body)

    const moveHead = () => {
      const { direction } = this.attrs2
      const newDirection = random(direction - 1, direction + 1)
      this.head.attrs2.direction = Math.min(newDirection, Math.max(newDirection, 0))
      setTimeout(moveHead, random(750, 2000))
    }

    setTimeout(moveHead, random(750, 2000))

    // const { width, height } = this.getBounds()
    // Posicionar aqui
    // new Vector3(
    //   width / 2,
    //   width / 2,
    //   height / -2
    // ).toVector2().copyTo(this.pivot)

    this.body.sprite.onFrameChange = () => this.positionateLayers()
    this.updateLayers()

    this.attrs2.watch('direction', v => {
      this.body.attrs2.direction = this.leftHand.attrs2.direction = this.rightHand.attrs2.direction = v
    })
  }

  private positionateLayers() {
    const { height } = this.body.sprite.getLocalBounds()
    this.head.position.set(0, -height)
    this.leftHand.position.set(0, 0)
    this.rightHand.position.set(-7, 12)
  }

  walk() {
    this.attrs2.isWalk = true
    this.attrs2.isLay = false

    return this
  }

  stop() {
    this.attrs2.isWalk = false
    this.attrs2.isLay = false

    return this
  }
  updateLayers() {
    const { direction, isWalk } = this.attrs2
    this.body.attrs2.direction = this.head.attrs2.direction = this.leftHand.attrs2.direction = direction

    this.head.zIndex = 3
    this.leftHand.zIndex = 2
    this.rightHand.zIndex = 3
    this.body.sortChildren()

    if (isWalk) {
      this.body.attrs2.action = 'wlk'
      this.leftHand.attrs2.action = 'wlk'
      this.rightHand.attrs2.action = 'wlk'
    } else {
      this.body.attrs2.action = 'std'
      this.leftHand.attrs2.action = 'std'
      this.rightHand.attrs2.action = 'std'
    }

    this.positionateLayers()
  }
}
