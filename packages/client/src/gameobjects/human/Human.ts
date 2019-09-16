import { GameObject } from '../../engine/lib/GameObject'
import { HumanHead } from './Head'
import { HumanBody } from './Body'
import { random } from '../../engine/lib/utils/Util'
import { HumanLeftHand } from './LeftHand'
import { HumanRightHand } from './RightHand'
import { HumanHair } from './Hair'
import * as PIXI from 'pixi.js'

interface HumanProps {
  direction: number
  isLay: boolean
  isSpeak: boolean
  isIdle: boolean
  isWalk: boolean
  isLoading: boolean
  look: {
    skin: number
    hair: {
      name: string
      type: number
    }
  }
}

export class Human extends GameObject<HumanProps> {
  public readonly head: HumanHead
  public readonly body: HumanBody
  public readonly leftHand: HumanLeftHand
  public readonly rightHand: HumanRightHand
  public readonly hair: HumanHair

  constructor() {
    super({
      direction: 2,
      isIdle: false,
      isLay: false,
      isSpeak: false,
      isWalk: false,
      isLoading: true,
      look: {
        skin: 0xffe0bd,
        hair: {
          name: 'hair_F_backbun_h',
          type: 1,
        },
      },
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

    this.attrs2.addListener(() => this.updateLayers())
    this.body.addChild(this.head, this.leftHand, this.rightHand)

    this.addChild(this.body)

    const moveHead = () => {
      const { direction } = this.attrs2
      let newDirection = random(direction - 1, direction + 1)
      if (newDirection === -1) {
        newDirection = 7
      } else if (newDirection === 8) {
        newDirection = 0
      }
      this.head.attrs2.direction = newDirection
      setTimeout(moveHead, random(750, 2000))
    }

    setTimeout(moveHead, random(750, 2000))

    // Position here
    new PIXI.Point(-30, -25).copyTo(this.pivot)
    this.zIndex = 3

    this.body.sprite.onFrameChange = () => this.positionateLayers()

    this.updateLayers()
    this.updateLook()

    this.attrs2.watch('direction', v => {
      this.body.attrs2.direction = this.leftHand.attrs2.direction = this.rightHand.attrs2.direction = v
    })
  }

  updateLook() {
    const { look, isLoading } = this.attrs2
    let { skin } = look

    this.filters = [new PIXI.filters.AlphaFilter(0.4)]

    return this.app
      .getResource(['resources/human/hair/2321/sheet.json', 'resources/human/face/1/sheet.json'])
      .then(([hair, face]) => {
        this.head.hair.setSheet(hair.spritesheet)
        this.head.face.setSheet(face.spritesheet)
        this.head.eyes.setSheet(face.spritesheet)
        this.filters = []

        this.body.sprite.tint = skin
        this.head.sprite.tint = skin
        this.head.face.sprite.tint = skin
        this.leftHand.sprite.tint = skin
        this.rightHand.sprite.tint = skin
      })
  }

  speak(time) {
    this.head.speak(time)
  }

  private positionateLayers() {
    const { height } = this.body.sprite.getLocalBounds()
    this.head.position.set(0, -(height - 2))
    this.leftHand.position.set(8, -(height - 5))
    this.rightHand.position.set(-7, -(height - 6))

    if (this.attrs2.direction === 0) {
      this.leftHand.position.set(-10, -(height - 4))
      this.rightHand.position.set(5, -(height - 10))
    }

    if (this.attrs2.direction === 2) {
      this.leftHand.position.set(8, -(height - 4))
      this.rightHand.position.set(-7, -(height - 6))
    }

    if (this.attrs2.direction === 4) {
      this.leftHand.position.set(-8, -(height - 5))
      this.rightHand.position.set(7, -(height - 7))
    }

    if (this.attrs2.direction === 5) {
      this.leftHand.position.set(-5, -(height - 7))
      this.rightHand.position.set(5, -(height - 7))
    }

    if (this.attrs2.direction === 6) {
      this.leftHand.position.set(10, -(height - 5))
      this.rightHand.position.set(-6, -(height - 10))
    }

    if (this.attrs2.direction === 7) {
      this.leftHand.position.set(-7, -(height - 2))
      this.rightHand.position.set(6, -(height - 3))
    }
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
