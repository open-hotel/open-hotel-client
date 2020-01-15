import * as PIXI from 'pixi.js'
import { GameObject } from '../../../engine/lib/GameObject'
import { Game } from '../../Game'
import { HumanImagerProps } from '../../imager/human/Human.imager'
import { Observable, IObservable } from '../../../engine/lib/Observable'
import { mergeDeep, random } from '../../../engine/lib/util/Util'

export interface HumanProps extends Partial<HumanImagerProps> {}

export class Human extends GameObject<typeof PIXI.AnimatedSprite, HumanProps>(PIXI.AnimatedSprite) {
  eybTimer: number
  headTimer: number

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

    Observable.subscribe(this.attrs, (_, [[key]]) => {
      console.log('UPDATE', key)
      if (key === 'is_ghost') return this.setGhost();
      this.updateFigure()
    })

    this.updateFigure()

    this.loop = true
    this.animationSpeed = 1 / 6
    this.interactive = true

    this.addListener('pointertap', () => {
      this.attrs.action.eyb = !this.attrs.action.eyb
    })

    this.startBlink()
    this.startHeadMove()
  }

  startHeadMove() {
    this.headTimer = window.setTimeout(() => {
      const min = this.attrs.direction - 1
      const max = this.attrs.direction + 1
      this.attrs.head_direction = random(min, max)
      this.startHeadMove()
    }, random(1000, 5000))
  }

  startBlink() {
    this.eybTimer = window.setTimeout(() => {
      this.attrs.action.eyb = true
      window.setTimeout(() => {
        this.attrs.action.eyb = false
        this.startBlink()
      }, 200)
    }, random(2500, 5000))
  }

  async updateFigure(ghost = true) {
    const { human } = Game.current.imager

    if (ghost) {
      this.attrs.is_ghost = true
    }
    this.textures = await human.createAnimation({
      ...this.attrs,
      is_ghost: false,
    })
    if (ghost) this.attrs.is_ghost = false
    this.anchor.set(0.5, 1)

    this.play()
  }

  async setGhost(is_ghost = this.attrs.is_ghost) {
    if (is_ghost) {
      const { human } = Game.current.imager

      this.filters = [new PIXI.filters.AlphaFilter(0.4)]
      this.textures = await human.createAnimation({...this.attrs})
      this.anchor.set(0.5, 1)

      this.play()
    } else {
      this.filters = []
      this.updateFigure(false);
    }
    return this
  }
}
