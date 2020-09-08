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
import { HumanDirection } from './human/direction.enum'

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

interface SetType {
  set: any
  settype: any
  colors: number[]
  typeName: string
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

  private _actionTypeToAction
  private get actionTypeToAction() {
    if (this._actionTypeToAction) {
      return this._actionTypeToAction
    }
    return this._actionTypeToAction  = Object.entries(this.avatarActions).reduce(
      (acc, [name, { state }]) => ({
        ...acc,
        [state]: name,
      }),
      {},
    )
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

  renderFrame () {

  }

  private async loadDependencies (setTypes: SetType[]) {
    const dependencies = setTypes.flatMap<string>(({ set }) => {
      const setDependecies = set.parts.map(part => {
        const libraryIndex = this.figuremap.parts[part.type][part.id]
        const lib = this.figuremap.libs[libraryIndex]?.id
        return lib && `${lib}/${lib}.json`
      })
      return Array.from(new Set(setDependecies))
    }).filter(e => e)

    await this.loader.add(dependencies).wait()
  }

  async createAnimation(options: HumanFigureProps): Promise<PIXI.Texture[]> {
    const setTypes: SetType[] = Object.entries(options.figure)
      .map(
        ([typeName, partOptions]) => {
          const settype = this.figuredata.settype[typeName]
          const colors: number[] = partOptions.colors.map(
            colorId => Number('0x' + this.figuredata.palette[settype.paletteid][colorId].color)
          )
          return {
            set: this.figuredata.settype[typeName].set[partOptions.id],
            settype,
            colors,
            typeName
          }
        }
      )

    await this.loadDependencies(setTypes)
    this.createRenderTree(setTypes, options)

    return [PIXI.Texture.WHITE]
  }

  private createRenderTree (setTypes: SetType[], options: HumanFigureProps) {
    const actions = this.getActions(options)
    const lastAction = actions[actions.length - 1]
    const geometryType = this.geometry.type[lastAction.geometrytype]

    const partNameToGeometryType = Object.entries(geometryType)
      .reduce((acc, [geometryGroupName, geometryGroup]: [string, any]) => {
        Object.entries(geometryGroup.items).forEach(([partName, partTransformOptions]) => {
          acc[partName] = geometryGroupName
        })
        return acc
      }, {})

    const groupRenderTree = setTypes
      .flatMap(setType => {
        return setType.set.parts.map(part => ({ ...part, setType }))
      })
      .reduce((acc, part) => {
      const geometryGroupName = partNameToGeometryType[part.type]
      const geometryGroup = geometryType[geometryGroupName]

      if (!acc[geometryGroupName]) {
        acc[geometryGroupName] = {
          radius: geometryGroup.radius,
          parts: {}
        }
      }

      if (!acc[geometryGroupName].parts[part.type]) {
        acc[geometryGroupName].parts[part.type] = {
          radius: geometryGroup.items[part.type].radius,
          sprites: []
        }
      }

      acc[geometryGroupName].parts[part.type].sprites.push(
        {
          id: part.id,
          color: part.setType.colors[part.colorindex - 1]
        }
      )

      return acc
    }, {})

    debugger

    const exgroupRenderTree = {
      head: {
        radius: 3,
        parts: {
          hd: {
            radius: 1323,
            sprites: [
              {
                color: '',
                id: 4233
              }
            ]
          }
        }
      }
    }
  }

  private getActions(props: HumanFigureProps) {
    let actions = Object.keys(props.actions)
      .map(a => this.avatarActions[this.actionTypeToAction[a]])
      .filter(a => a)
      .sort((a, b) => b.precedence - a.precedence)

    actions.forEach(action => {
      const prevents = new Set((action.prevents || '').split(','))
      if (prevents.size > 0) {
        actions = actions.filter(a => {
          if (a.state === 'fx') {
            return !prevents.has([a.state, props.actions.fx].join('.'))
          }
          return !prevents.has(a.state)
        })
      }
    })

    return actions
  }

}
