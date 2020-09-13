export interface IAnimationFrame {
  bodyparts?: {
    [k: string]: {
      assetpartdefinition: string
      frame: number
      repeats?: number
      dx?: number
      dy?: number
    }
  }
  offsets?: {
    [k: number]: {
      [k: string]: {
        dx?: number
        dy?: number
      }
    }
  }
}

export interface IAnimation {
  desc: string
  frames: IAnimationFrame[]
}
