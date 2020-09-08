import { HumanFigure } from "./figure.util";
import { HumanPart } from "./HumanPart";
import { HumanDirection } from "./direction.enum";
import { HumanActions } from "./action.util";

export interface SetType {
  set: any
  settype: any
  colors: number[]
  typeName: string
}

export type FigurePartList = Record<string, HumanPart[]>

export interface HumanFigureProps {
  figure: HumanFigure
  actions: HumanActions
  size?: 'h' | 'sh'
  head_direction: HumanDirection
  direction: HumanDirection
  is_ghost: boolean
}

export interface FigurePartAnimationFrame {
  frame: number
  repeats?: number
  action?: string
  // wlk, std, sw, etc
  assetpartdefinition?: string
  dx?: number
  dy?: number
  dd?: number
}

export interface FigureAnimation {
  frames: Record<string, FigurePartAnimationFrame>[]
  offsets?: Array<{ dx: number; dy: number }>
}
