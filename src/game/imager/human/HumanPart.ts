import { Game } from '../../Game'
import { PointLike } from '../../../engine/lib/util/Walk'
import { Logger } from '../../../engine/lib/Logger'

export interface HumanChunkProps {
  lib: string
  size: 'h' | 'sh'
  action: string
  type: string
  id: string
  direction: number
  frame: number
  color: number
  flippedType: string;
}

export const calcFlip = (d: number) => (d > 3 && d < 7 ? 6 - d : d)

export class HumanPart implements HumanChunkProps {
  size: 'h' | 'sh' = 'h'
  lib = null
  action = 'std'
  type = null
  id = '1'
  color = 0xffffff
  frame = 0
  direction = 0
  logger: Logger
  flippedType = null;

  buildFilenameNameWith(options?: Partial<HumanChunkProps>) {
    options = Object.assign(
      {},
      this,
      options,
    )

    const parts = [
      options.lib,
      options.size,
      options.action,
      options.type,
      options.id,
      options.direction,
      options.frame,
    ].join('_')
    return `${parts}.png`
  }

  get isFlipDirection() {
    return this.direction > 3 && this.direction < 7
  }

  get flipedDirection() {
    return calcFlip(this.direction)
  }

  constructor(props: Partial<HumanChunkProps>) {
    Object.assign(this, {
      ...props,
      size: props.size || 'h',
    })

    this.logger = Game.current.app.$logger.create(this.type)
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
    if (!spritesheet) this.logger.warn(lib, `No Spritesheet defined for ${this.lib}!`)

    return spritesheet
  }

  getTexture(filename: string) {
    const spritesheet = this.spritesheet
    const texture = spritesheet && spritesheet.textures && spritesheet.textures[filename]
    return texture
  }

  getTexureWith(options?: Partial<HumanChunkProps>) {
    const filename = this.buildFilenameNameWith(options);
    return this.getTexture(filename);
  }

  getOffset({
    size = this.size,
    action = this.action,
    type = this.type,
    id = this.id,
    direction = this.direction,
    frame = this.frame,
  } = {}) {
    const name = [size, action, type, id, direction, frame].join('_');
    const { offset: offsets } = this.spritesheet.data.meta
    return offsets[name];
  }
}
