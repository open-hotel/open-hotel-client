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
    const colors = this.getColors(type);
    color = color ?? Object.keys(colors)[0]
    const colorItem = colors[color]

    return colorItem && Number('0x'+colorItem.color)
  }

  async wardrobePartItem(
    type: string,
    id: string,
    args: string[],
    geometryType = 'vertical',
    geometryPart = 'torso',
    hiddenLayers = type == 'hd' ? ['bd', 'lh', 'rh'] : [],
  ) {
    const container = new PIXI.Container()
    const data = this.figuredata.settype[type].set[id]
    const removeLayers = new Set(hiddenLayers.concat(data.hiddenLayers || []))
    const geometry = this.geometry.type[geometryType][geometryPart]
    const len = data.parts.length

    container.sortableChildren = true

    for (let i = 0; i < len; i++) {
      const part = data.parts[i]
      if (removeLayers.has(part.type)) continue
      const lib = this.getLib(part.type, part.id)
      if (!lib) continue

      const { spritesheet } = await this.loader.add(lib, `${lib}/${lib}.json`).wait()
      const p = new HumanPart({
        type: part.type,
        id: part.id,
        lib,
        direction: 2,
        radius: geometry.items[part.type].radius,
      })
      const textureName = p.buildFilenameName()
      const texture = spritesheet.textures[textureName]
      const sprite = new PIXI.Sprite(texture)
      const state = p.buildState()
      const [x = 0, y = 0] = (this.loader.resources[p.lib].manifest.assets[state]?.offset ?? '')
        .split(',')
        .map(v => Number(v))

      sprite.name = textureName
      sprite.pivot.set(x, y)

      if (p.type !== 'ey' && part.colorable && part.colorindex > 0) {
        sprite.tint = this.getColor(type, args[part.colorindex])
      }

      sprite.zIndex = p.radius
      container.addChild(sprite)
    }

    return this.app.renderer.extract.base64(container)
  }
}
