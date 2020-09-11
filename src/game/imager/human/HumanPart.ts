export interface HumanChunkProps {
  lib: string
  size: 'h' | 'sh'
  assetpartdefinition: string
  type: string
  id: string | number
  direction: number
  frame: number
  tint: number
  alpha: number
  part: any
}

export const calcFlip = (d: number) => (d > 3 && d < 7 ? 6 - d : d)

export class HumanPart implements HumanChunkProps {
  lib = null
  size: 'h' | 'sh' = 'h'
  assetpartdefinition = 'std'
  type = null
  id = '1'
  direction = 0
  frame = 0
  tint = 0xffffff
  alpha = 100
  part: any;

  constructor(props: Partial<HumanChunkProps>) {
    Object.assign(this, props)
  }

  buildState(options?: Partial<HumanChunkProps>) {
    options = Object.assign({}, this, options)
    return [options.size, options.assetpartdefinition, options.type, options.id, options.direction, options.frame].join(
      '_',
    )
  }

  buildFilenameName(options?: Partial<HumanChunkProps>) {
    options = Object.assign({}, this, options)

    const parts = [options.lib, this.buildState(options)].join('_')
    return `${parts}.png`
  }

  setBase(base: string) {
    const parts = base.split('_')
    this.id = parts.pop()
    this.type = parts.join('_')
    return this
  }
}
