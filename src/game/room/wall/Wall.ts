import * as PIXI from 'pixi.js-legacy'
import { Vector3 } from '../../../engine/isometric'
import { IsoPoint } from '../../../engine/lib/IsoPoint'

export class Wall extends PIXI.Sprite {
  constructor(
    texture: PIXI.Texture,
    public positionInMap = new IsoPoint(),
    public direction = 0
  ) {
    super(texture)

    // this.interactive = true
    // this.buttonMode = true

    // this.width = 88
    // this.height = 200
  }
}
