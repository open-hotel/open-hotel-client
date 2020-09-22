
import { Sprite, Ticker, AccessibilityManager } from "pixi.js"
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

    const { animations, loader } = this.room.avatarImager

    for (const [action, value] of this.structure.actions) {
      const animationName = actionTypeToAnimationName[action.state]
      let animation = animations[animationName]

      if (animation) {
        this.animationManager.add(animation)
        continue
      }

      if (action.state === "dance" || action.state === 'fx') {
        const id = action.state === 'fx' ? value : `dance.${value}`
        const lib = loader.resources.effectmap.json.dance[id]
        const resource = loader.resources[lib]

        if (resource && resource.json.animations && resource.json.animations[id]) {
          const animation = resource.json.animations[id]
          this.animationManager.add(animation)
        }
      }


      // if (action.animation === "1") {
      //   const lib = this.humanImager.effectmap.dance[
      //     action.state === 'dance'
      //       ? `dance.${value}`
      //       : value
      //   ]

      //   console.log(lib)
      // }
    }

    this.animationManager.buildFrames()
  }

  startAnimationLoop = () => {
    const frame = this.animationManager.nextFrame()

    if (!frame) return;

    // Update HumanPartOptions
    for (const [setType, partOptions] of Object.entries(frame.bodyparts)) {
      const humanParts: HumanPart[] =
        setType in this.structure.groups
          ? this.structure.groups[setType]
          : Object.keys(this.structure.geometry[setType]?.items ?? {})
            .reduce((acc, p) => {
              if (p in this.structure.groups) {
                return acc.concat(this.structure.groups[p])
              }

              return acc
            }, [])

      if (!humanParts) continue;

      const assetpartdefinition = partOptions.assetpartdefinition ?? this.room.avatarImager.avatarActions[partOptions.action]?.assetpartdefinition

      humanParts.forEach((humanPart) => {
        humanPart.assetpartdefinition = assetpartdefinition ?? humanPart.assetpartdefinition;
        humanPart.frame = partOptions.frame ?? humanPart.frame;
        humanPart.dx = Number(partOptions.dx ?? humanPart.dx);
        humanPart.dy = Number(partOptions.dy ?? humanPart.dy);
        humanPart.dd = Number(partOptions.dd ?? humanPart.dd);
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
