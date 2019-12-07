import * as PIXI from 'pixi.js';
import { GameObject } from '../../../engine/lib/GameObject'
import { Game } from '../../Game'
import { HumanImagerProps } from '../../imager/human/Human.imager'
import { Observable, IObservable } from '../../../engine/lib/Observable'

export interface HumanProps extends Partial<HumanImagerProps> {

}

export class Human extends GameObject<typeof PIXI.AnimatedSprite, HumanProps>(PIXI.AnimatedSprite) {
  constructor(props: HumanProps) {
    super([PIXI.Texture.EMPTY])

    this.attrs = Observable.create<HumanProps>(props);
    
    this.attrs.addListener(() => this.updateAnimation())

    this.attrs.watch('figure', () => this.updateFigure())
    this.attrs.watch('action', () => this.updateFigure())
    this.attrs.watch('is_ghost', () => this.updateGhost())

    this.updateFigure()
    
    this.loop = true;
    this.animationSpeed = 1/6;
    this.interactive = true;

    this.addListener('pointertap', () => {
      this.attrs.action.eyb = !this.attrs.action.eyb
    })

  }

  async updateFigure (ghostPlaceholder = true) {
    const { human } = Game.current.imager

    if (ghostPlaceholder) {
      this.attrs.is_ghost = true;
      this.textures = await human.createAnimation(this.attrs);
      this.anchor.set(.5, 1)
      this.attrs.is_ghost = false;
    }

    this.textures = await human.createAnimation(this.attrs);
    this.anchor.set(.5, 1)
    
    this.play()
  }

  async updateAnimation () {
    const { human } = Game.current.imager
    this.textures = await human.createAnimation(this.attrs);
    this.pivot.set(.5, 1)
    this.play()
  }

  updateGhost () {
    this.filters = this.attrs.is_ghost ? [ new PIXI.filters.AlphaFilter(.4)] : []
    this.updateFigure(false);
    return this
  }
}
