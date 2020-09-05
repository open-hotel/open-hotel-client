import { Selectable } from "../Selectable.interface"
import { HumanImager } from "../../imager/human.imager"
import { Figure } from "../../imager/human/figure.util"
import { Action } from "../../imager/human/action.util"

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

  public sprite: PIXI.AnimatedSprite

  async initSprite () {
    const { imagerOptions } = this.options
    const textures = await this.humanImager.createAnimation({
      figure: Figure.decode(imagerOptions.encodedFigure),
      actions: Action.decode(imagerOptions.encodedActions),
      direction: imagerOptions.direction,
      head_direction: imagerOptions.head_direction,
      is_ghost: imagerOptions.is_ghost,
    })
    this.sprite = new PIXI.AnimatedSprite(textures)

    return this.sprite
  }
}
