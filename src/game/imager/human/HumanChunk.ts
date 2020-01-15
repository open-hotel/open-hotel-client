import { Game } from '../../Game'
import { PointLike } from '../../../engine/lib/util/Walk'

export interface HumanChunkProps {
  lib: string
  size: string
  action: string
  type: string
  id: string
  direction: number
  frame: number
  color: number
}

function calcFlip(d) {
  return d < 4 ? d : 6 - d
}

export class HumanChunk implements HumanChunkProps {
  lib = null
  size = 'h'
  action = 'std'
  type = null
  id = '1'
  private _frame = 0
  color = 0xffffff
  _f = 0
  direction = 0
  parts = {}

  get data() {
    const {
      figuredata: { data: figuredata },
    } = Game.current.app.loader.resources
    return figuredata.settype[this.type]
  }

  get frame() {
    return this._frame
  }

  set frame(v) {
    this._f = v
    this._frame = v
  }

  static buildResourceName(options: Partial<HumanChunkProps>) {
    return [options.lib, options.size, options.action, options.type, options.id, options.direction].join('_')
  }

  static buildFilenameName(options: Partial<HumanChunkProps>) {
    return [this.buildResourceName(options), options.frame].join('_') + '.png'
  }

  get isFliped() {
    const { spritesheet } = this

    return !!(
      spritesheet &&
      !spritesheet.textures[HumanChunk.buildFilenameName(this)] &&
      spritesheet.textures[HumanChunk.buildFilenameName({ ...this, direction: this.flipDirection })]
    )
  }

  get flipDirection() {
    return calcFlip(this.direction)
  }

  get drawDirection() {
    return this.isFliped ? this.flipDirection : this.direction
  }

  constructor(props: Partial<HumanChunkProps>) {
    Object.assign(this, props)
  }

  get resourceName() {
    return this.isFliped
      ? HumanChunk.buildResourceName({ ...this, direction: this.flipDirection })
      : HumanChunk.buildResourceName(this)
  }

  get filename() {
    return this.isFliped
      ? HumanChunk.buildFilenameName({ ...this, direction: this.flipDirection })
      : HumanChunk.buildFilenameName({ ...this, frame: this._f })
  }

  get libLoaded() {
    const { resources } = Game.current.app.loader
    return this.lib in resources
  }

  get spritesheet() {
    if (!this.libLoaded) {
      console.error(`Lib ${this.lib} not loaded!`)
      return null
    }

    const lib = Game.current.app.loader.resources[this.lib]
    const spritesheet = lib && lib.spritesheet
    console.assert(lib, `No Spritesheet defined for ${this.lib}!`)

    return spritesheet
  }

  get texture() {
    const { spritesheet } = this
    const texture = spritesheet && spritesheet.textures[this.filename]

    if (!texture) {
      if (this._f > 0) {
        this._f--
        return this.texture
      }
      console.error(`No Texture found for ${this.filename} in ${this.lib}!`, spritesheet)
    }

    return texture || PIXI.Texture.EMPTY
  }

  get offset(): PointLike {
    return this.spritesheet.data.meta.offset[this.filename] || { x: 0, y: 0}
  }

  get animation() {
    const { spritesheet } = this
    const animations = spritesheet && spritesheet.animations

    return (animations && animations[this.resourceName]) || []
  }
}
