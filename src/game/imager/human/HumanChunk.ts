import { Game } from "../../Game"

export interface HumanChunkProps {
  lib: string
  size: string
  action: string
  type: string
  id: string
  direction: number
  frame: number
  tint: number
}

export class HumanChunk implements HumanChunkProps {
  lib = null
  size = 'h'
  action = 'std'
  type = null
  id = '1'
  direction = 2
  frame = 0
  tint = 0xFFFFFF

  constructor (props: Partial<HumanChunkProps>) {
    Object.assign(this, props)
  }

  get resourceName () {
    return [this.lib, this.size, this.action, this.type, this.id, this.direction].join('_')
  }

  get filename () {
    return [[this.resourceName, this.frame].join('_'), 'png'].join('.')
  }

  get spritesheet () {
    const { resources } = Game.current.app.loader
    const lib = resources[this.lib]
    return lib && lib.spritesheet
  }

  get texture () {
    const { spritesheet } = this
    return spritesheet && spritesheet.textures[this.filename]
  }

  get animation () {
    const { spritesheet } = this
    const animations = spritesheet && spritesheet.animations

    return (animations && animations[this.resourceName]) || []
  }
}