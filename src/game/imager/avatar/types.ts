import { HumanFigure } from "./util/figure";
import { HumanPart } from "./AvatarChunk";
import { HumanDirection } from "./util/directions";
import { HumanActions } from "./util/action";

export type PartType = 'bd' | 'ch' | 'sh' | 'lg' | 'lh' | 'ls' | 'rh' | 'rs' | 'hd' | 'fc' | 'ey' | 'hr' | 'hrb'
export type ItemType = 'li' | 'ri'

export interface HumanPartDescriptor {
  colorable: 0 | 1
  colorindex: number
  id: number
  index: number
  type: PartType
}

type StrBin = '0' | '1'

interface HumanSet {
  club: string
  colorable: StrBin
  gender: 'M' | 'F' | 'U'
  parts: HumanPartDescriptor[]
  preselectable: StrBin
  selectable: StrBin
  hiddenLayers?: string[]
}

export interface SetType {
  set: HumanSet
  settype: FigureDataSettype
  colors: number[]
  typeName: PartType
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

export type AnimationName = 'Lay' | 'Float' | 'Swim' | 'Sit' | 'Snowboard360' | 'SnowboardOllie' | 'SnowboardUp' | 'SnowboardSquat' | 'RideJump' | 'Respect' | 'Wave' | 'Sign' | 'Blow' | 'Laugh' | 'Idle' | 'AvatarEffect' | 'Dance' | 'UseItem' | 'CarryItem' | 'Talk' | 'Gesture' | 'GestureSmile' | 'GestureSad' | 'GestureAngry' | 'GestureSurprised' | 'Sleep' | 'Move' | 'Default'

export type GeometryType = 'vertical' | 'sitting' | 'horizontal' | 'swhorizontal' | 'swim'
export type HumanGroupName = 'top' | 'bottom' | 'behind' | 'torso' | 'leftitem' | 'rightitem' | 'leftarm' | 'rightarm' | 'head'

export interface HumanItem {
  double: number
  nx: number
  ny: number
  nz: number
  radius: number
  x: number
  y: number
  z: number
  // custom prop added at runtime
  zIndex?: number
}

export interface HumanGroup {
  items: Record<PartType | ItemType, HumanItem>
  radius: number
  x: number
  y: number
  z: number
  // custom prop added at runtime
  zIndex?: number
}

export interface ColorDefinition {
  index: number
  club: number
  selectable: 0 | 1
  color: string
}

export type FigureDataSettypeKey = 'hr' | 'hd' | 'ch' | 'lg' | 'sh' | 'ha' | 'he' | 'ea' | 'fa' | 'ca' | 'wa' | 'cc' | 'cp'

export interface FigureDataSettype {
  mand_f_0: string
  mand_f_1: string
  mand_m_0: string
  mand_m_1: string
  paletteid: string
  set: Record<number, HumanSet>
}

export interface FigureData {
  palette: Record<number, Record<number, ColorDefinition>>
  settype: Record<FigureDataSettypeKey, FigureDataSettype>
}

interface Offset {
  dx: string
  dy: string
}



