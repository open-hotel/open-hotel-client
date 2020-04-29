import * as PIXI from 'pixi.js-legacy'
import { IsoPoint } from '../../../engine/lib/IsoPoint'

export class Floor extends PIXI.Sprite {
  constructor(texture: PIXI.Texture, public iso = new IsoPoint()) {
    super(texture)

    this.interactive = true
    this.buttonMode = true

    iso.toPoint().copyTo(this.position)

    this.hitArea = new PIXI.Polygon([
      new PIXI.Point(this.width / 2, 0),
      new PIXI.Point(this.width, this.height / 2 - 4),
      new PIXI.Point(this.width / 2, this.height - 8),
      new PIXI.Point(0, this.height / 2 - 4),
    ])
  }
}
