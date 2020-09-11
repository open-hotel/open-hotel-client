import { Selectable } from "../Selectable.interface"
import { HumanImager } from "../../imager/human.imager"
import { HumanFigure } from "../../imager/human/figure.util"
import { HumanActions } from "../../imager/human/action.util"
import { RenderTree } from "../../imager/human/renderTree"
import { HumanPart } from "../../imager/human/HumanPart"
import { Sprite, Ticker } from "pixi.js"

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
  constructor (
    private readonly options: RoomUserOptions,
    private readonly humanImager: HumanImager,
  ) {}

  public sprite: PIXI.Container
  private renderTree: RenderTree
  static ticker = new Ticker()

  async initSprite () {
    const { imagerOptions } = this.options
    const { container, renderTree } = await this.humanImager.createFigure({
      figure: HumanFigure.decode(imagerOptions.encodedFigure),
      actions: HumanActions.decode(imagerOptions.encodedActions),
      direction: imagerOptions.direction,
      head_direction: imagerOptions.head_direction,
      is_ghost: imagerOptions.is_ghost,
    })
    this.sprite = container
    this.renderTree = renderTree

    this.startAnimations()
    return this.sprite
  }

  private currentFrame = 0
  private activeAnimations = []

  startAnimations () {
    RoomUser.ticker.add(this.startAnimationLoop)
    const { actionTypeToAnimationName } = this.humanImager
    for (const action of this.renderTree.actions) {
      const animationName = actionTypeToAnimationName[action.state]
      const animation = this.humanImager.animations[animationName]
      if (!animation) {
        continue
      }
      this.activeAnimations.push(animation)
    }
  }

  startAnimationLoop = () => {
    for (const animation of this.activeAnimations) {
      const currentAnimationFrame = this.currentFrame % animation.frames.length
      const currentFrame = animation.frames[currentAnimationFrame]

      for (const [partName, { frame, assetpartdefinition }] of Object.entries<any>(currentFrame.bodyparts)) {
        const partContainer = this.renderTree.partTypeToContainer[partName]

        if (!partContainer) {
          continue
        }

        const humanParts: HumanPart[] = this.renderTree.groups[partName]
        humanParts.forEach((humanPart, index) => {
          humanPart.frame = frame
          humanPart.assetpartdefinition = assetpartdefinition
          const sprite = partContainer.children[index] as Sprite
          this.renderTree.updateSprite(sprite, humanPart)
        })

      }

    }

    this.currentFrame++
  }

  destroy () {
    RoomUser.ticker.remove(this.startAnimationLoop)
  }
}

RoomUser.ticker.maxFPS = 12
RoomUser.ticker.start()
