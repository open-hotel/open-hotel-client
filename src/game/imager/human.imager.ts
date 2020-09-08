import * as PIXI from 'pixi.js'
import { Loader } from '../../engine/loader'
import { ApplicationProvider } from '../pixi/application.provider'
import { Provider } from 'injets/dist'
import { Application } from '../../engine/Application'
import { SetType, HumanFigureProps } from './human/humanImagerTypes'
import { RenderTree } from './human/renderTree'
import { HumanFigure } from './human/figure.util'

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
        const lib = HumanFigure.getLib(this.figuremap, part.type, part.id)
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
    const actions = this.getActions(options)
    const renderTree = new RenderTree(this.loader, actions)
      .createRenderTree(setTypes, options)

    console.log(renderTree)
    const { canvas } = renderTree

    const container = renderTree.createContainer(options)
    const DEFAULT_HUMAN_OFFSET = 8

    return [
      this.app.renderer.generateTexture(
        container,
        PIXI.SCALE_MODES.LINEAR,
        1,
        new PIXI.Rectangle(canvas.dx, canvas.dy - canvas.height + DEFAULT_HUMAN_OFFSET, canvas.width, canvas.height)
      )
    ]

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
