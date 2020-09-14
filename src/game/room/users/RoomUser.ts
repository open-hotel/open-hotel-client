import { Selectable } from "../Selectable.interface"
import { HumanImager } from "../../imager/human.imager"
import { HumanFigure } from "../../imager/human/figure.util"
import { HumanActions } from "../../imager/human/action.util"
import { AvatarStructure } from "../../imager/human/AvatarStructure"
import { HumanPart } from "../../imager/human/HumanPart"
import { Sprite, Ticker } from "pixi.js"
import { AnimationManager } from "../../imager/human/animation/AnimationManager"
import { IAnimationFrameOffset } from "../../imager/human/animation/IAnimation"

export interface RoomUserOptions {
  nickname: string,
  imagerOptions: ImagerOptions
}

interface ImagerOptions {
  encodedFigure: string
  encodedActions: string
  direction: number
  head_direction: number
  is_ghost: boolean
}

export class RoomUser {

  public sprite: PIXI.Container
  private structure: AvatarStructure
  private animationManager = new AnimationManager()

  constructor(
    private readonly options: RoomUserOptions,
    private readonly humanImager: HumanImager,
  ) { }

  static ticker = new Ticker()

  async initSprite() {
    const { imagerOptions } = this.options
    const { container, renderTree } = await this.humanImager.createFigure({
      figure: HumanFigure.decode(imagerOptions.encodedFigure),
      actions: HumanActions.decode(imagerOptions.encodedActions),
      direction: imagerOptions.direction,
      head_direction: imagerOptions.head_direction,
      is_ghost: imagerOptions.is_ghost,
    })

    this.sprite = container
    this.structure = renderTree

    this.startAnimations()
    return this.sprite
  }

  startAnimations() {
    RoomUser.ticker.add(this.startAnimationLoop)

    const { actionTypeToAnimationName } = this.humanImager

    this.animationManager.animations = []

    for (const action of this.structure.actions) {
      const animationName = actionTypeToAnimationName[action.state]
      const animation = this.humanImager.animations[animationName]

      if (!animation) {
        continue
      }

      this.animationManager.add(animation)
    }

    this.animationManager.buildFrames()
  }

  startAnimationLoop = () => {
    const frame = this.animationManager.nextFrame()

    if (!frame) return;

    // Update HumanPartOptions
    for (const [setType, partOptions] of Object.entries(frame.bodyparts)) {
      const humanParts: HumanPart[] = this.structure.groups[setType]

      if (!humanParts) continue;

      humanParts.forEach((humanPart) => {
        humanPart.assetpartdefinition = partOptions.assetpartdefinition ?? humanPart.assetpartdefinition;
        humanPart.frame = partOptions.frame ?? humanPart.frame;
        humanPart.dx = Number(partOptions.dx ?? humanPart.dx);
        humanPart.dy = Number(partOptions.dy ?? humanPart.dy);
      })
    }

    // Update Offsets
    const offsets: IAnimationFrameOffset = frame.offsets[this.options.imagerOptions.direction] || {}

    for (const [activePartset, offset] of Object.entries(offsets)) {
      const setTypes: string[] = this.humanImager.partsets.activePartSets[activePartset]

      setTypes.forEach((setType) => {
        const humanParts: HumanPart[] = this.structure.groups[setType]

        if (!Array.isArray(humanParts)) return;

        humanParts.forEach((humanPart) => {
          humanPart.dx = Number(offset.dx)
          humanPart.dy = Number(offset.dy)
        })
      })
    }

    // Update Sprites
    for (const [setType, humanParts] of Object.entries(this.structure.groups)) {
      const partContainer = this.structure.partTypeToContainer[setType]

      if (!Array.isArray(humanParts)) continue;

      humanParts.forEach((humanPart, index) => {
        const sprite = partContainer.children[index] as Sprite
        this.structure.updateSprite(sprite, humanPart)
      })
    }
  }

  destroy() {
    RoomUser.ticker.remove(this.startAnimationLoop)
  }
}

RoomUser.ticker.maxFPS = 12
RoomUser.ticker.start()
