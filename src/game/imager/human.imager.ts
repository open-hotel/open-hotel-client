import * as PIXI from 'pixi.js'
import { mergeWith } from 'lodash'

import { HumanPart, calcFlip } from './human/HumanPart'
import { HumanActions } from './human/action.util'
import { HumanFigure } from './human/figure.util'
import { mmc } from '../../engine/lib/util/Util'
import { Loader } from '../../engine/loader'
import { ApplicationProvider } from '../pixi/application.provider'
import { Provider } from 'injets/dist'
import { Application } from '../../engine/Application'

export type FigurePartList = Record<string, HumanPart[]>

export interface HumanFigureProps {
  figure: HumanFigure
  actions: HumanActions
  size?: 'h' | 'sh'
  head_direction: number
  direction: number
  is_ghost: boolean
}

interface FigureRenderOptions {
  parts: FigurePartList
  geometry: PIXI.Rectangle
  drawOrder: {
    type: string
    direction: number
  }
}

interface FigureGroupItem {
  zIndex: number
  part: HumanPart
}

interface FigureGroup {
  name: 'bottom' | 'behind' | 'torso' | 'leftitem' | 'rightitem' | 'leftarm' | 'rightarm' | 'head'
  items: FigureGroupItem[]
  zIndex: number
}

export interface FigureAnimationFrame {
  frame: number
  repeats?: number
  action?: string
  assetpartdefinition?: string
  dx?: number
  dy?: number
  dd?: number
}

export interface FigureAnimation {
  frames: Record<string, FigureAnimationFrame>[]
  offsets?: Array<{ dx: number; dy: number }>
}

@Provider()
export class HumanImager {
  private readonly app: Application

  constructor(private readonly loader: Loader, appProvider: ApplicationProvider) {
    this.app = appProvider.app
  }

  private getData(name: string) {
    return this.loader.resources[name].json
  }

  get figuremap() {
    return this.getData('figuremap')
  }

  get figuredata() {
    return this.getData('figuredata')
  }

  get draworder() {
    return this.getData('draworder')
  }

  get partsets() {
    return this.getData('partsets')
  }

  get avatarActions(): { state; precedence } {
    return this.getData('avatarActions')
  }

  get geometry() {
    return this.getData('geometry')
  }

  get animations() {
    return this.getData('animations')
  }

  get effectmap() {
    return this.getData('effectmap')
  }

  private getLib(type: string, id: string) {
    const { libs, parts } = this.figuremap
    return libs[parts[type][id]]?.id
  }

  private getColors(type: string) {
    const { palette, settype } = this.figuredata
    return palette[settype[type].paletteid]
  }

  private getColor(type: string, color: string) {
    const colors = this.getColors(type)
    color = color ?? Object.keys(colors)[0]
    const colorItem = colors[color]

    return colorItem && Number('0x' + colorItem.color)
  }

  // renderGroups(groups: FigureGroup[] = []): PIXI.Texture {
  //   const container = new PIXI.Container()
    
  //   groups.sort((a, b) => a.zIndex - b.zIndex)
    
  //   for (const group of groups) {
  //     group.items.sort((a, b) => a.zIndex - b.zIndex);
  //   }

  //   return container
  // }

  async createAnimation(options: HumanFigureProps): Promise<PIXI.Texture[]> {
    return [PIXI.Texture.WHITE]
  }
}
