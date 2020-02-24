import * as PIXI from 'pixi.js'
import { GameObject } from '../../../engine/lib/GameObject'
import { Game } from '../../Game'
import { HumanFigureProps } from '../../imager/human/Human.imager'
import { Observable, IObservable } from '../../../engine/lib/Observable'
import { mergeDeep, random } from '../../../engine/lib/util/Util'

export interface HumanProps extends Partial<HumanFigureProps> {}

export class Human extends GameObject<typeof PIXI.AnimatedSprite, HumanProps>(PIXI.AnimatedSprite) {
  constructor(props: HumanProps) {
    super([PIXI.Texture.EMPTY])

    props = mergeDeep(
      {
        action: {
          eyb: false,
          sit: false,
          wlk: false,
          crr: false,
          sig: false,
        },
      },
      props,
    )

    this.attrs = Observable.create(props)

    Observable.set(this.attrs, props)
  }
}
