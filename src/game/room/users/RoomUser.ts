
import { Sprite, Ticker } from "pixi.js"
import Tween from '@tweenjs/tween.js'
import { AvatarImager } from "../../imager/avatar/human-imager"
import { HumanFigure } from "../../imager/avatar/util/figure"
import { HumanActions } from "../../imager/avatar/util/action"
import { AvatarStructure } from "../../imager/avatar/AvatarStructure"
import { HumanPart } from "../../imager/avatar/AvatarChunk"
import { AnimationManager } from "../../imager/avatar/animation/AnimationManager"
import { IAnimationFrameOffset } from "../../imager/avatar/animation/IAnimation"
import { IUserModel } from "../../users/types"
import { RoomEngine } from "../Room.engine"
import { IsoPoint } from "../../../engine/lib/IsoPoint"

export class RoomUser {

  public container: PIXI.Container
  private structure: AvatarStructure
  private animationManager = new AnimationManager()
  private teleTween = new Tween.Tween({ x: 0, y: 0 })
  public iso = new IsoPoint()

  constructor(
    public readonly model: IUserModel,
    private readonly room: RoomEngine,
  ) {
    this.iso.set(model.x, model.y, model.z)
  }

  static ticker = new Ticker()

  async initSprite() {
    const { name, look, action, direction, head_direction, is_ghost, x = 0, y = 0 } = this.model
    const { container, structure } = await this.room.avatarImager.createFigure({
      figure: HumanFigure.decode(look),
      actions: HumanActions.decode(action),
      direction,
      head_direction,
      is_ghost,
    })

    container.name = `user: ${name}`

    this.container = container
    this.structure = structure

    this.startAnimations()
    return this.container
  }

  startAnimations() {
    RoomUser.ticker.add(this.startAnimationLoop)

    const { actionTypeToAnimationName } = this.room.avatarImager

    this.animationManager.animations = []

    for (const action of this.structure.actions) {
      const animationName = actionTypeToAnimationName[action.state]
      const animation = this.room.avatarImager.animations[animationName]

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
    const offsets: IAnimationFrameOffset = frame.offsets[this.model.direction] || {}

    for (const [activePartset, offset] of Object.entries(offsets)) {
      const setTypes: string[] = this.room.avatarImager.partsets.activePartSets[activePartset]

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

  setPosition(position: IsoPoint) {
    this.iso = position
    position.toPoint().copyTo(this.container.position)
    return this
  }

  moveTo(position: IsoPoint) {
    this.teleTween.stop()
    this.teleTween = new Tween.Tween({
      x: this.iso.x,
      y: this.iso.y,
      z: this.iso.z,
    }).to({
      x: position.x,
      y: position.y,
      z: position.z,
    }, 400)
    .onUpdate(({ x, y, z }) => {
      this.setPosition(this.iso.set(x, y, z))
    })
    .start(undefined)
  }
}

RoomUser.ticker.maxFPS = 12
RoomUser.ticker.start()
