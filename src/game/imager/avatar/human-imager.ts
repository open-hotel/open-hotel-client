import { Loader } from '../../../engine/loader'
import { ApplicationProvider } from '../../pixi/application.provider'
import { Provider } from 'injets'
import { Application } from '../../../engine/Application'
import { SetType, HumanFigureProps, AnimationName, FigureData, FigureDataSettypeKey } from './types'
import { AvatarStructure } from './AvatarStructure'
import { HumanFigure } from './util/figure'
import { ActionType } from './util/action'

@Provider()
export class AvatarImager {
  readonly app: Application

  constructor(public readonly loader: Loader, appProvider: ApplicationProvider) {
    this.app = appProvider.app
  }

  private getData(name: string) {
    return this.loader.resources[name].json
  }

  get figuremap() {
    return this.getData('figuremap')
  }

  get figuredata(): FigureData {
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

  private _actionTypeToAnimationName: Record<ActionType, AnimationName>
  get actionTypeToAnimationName(): Record<ActionType, AnimationName> {
    if (this._actionTypeToAnimationName) {
      return this._actionTypeToAnimationName
    }
    return this._actionTypeToAnimationName = Object.entries(this.avatarActions)
      .reduce<any>(
        (acc, [name, { state }]) => ({
          ...acc,
          [state]: name,
        }),
        {},
      )
  }

  private async loadDependencies(setTypes: SetType[], actions: any[]) {
    const itemActions = new Set(['usei', 'cri', 'sign'])
    let dependencies = new Set<string>()
    const effectMap = this.loader.resources.effectmap.json

    actions.forEach(([action, value]) => {
      let lib: string;

      if (itemActions.has(action.state)) {
        lib = 'hh_human_item'
      }
      else if (action.state === 'dance') {
        lib = effectMap.dance[`dance.${value}`]
      } else if (action.state === 'fx') {
        const id = `${value}`
        lib = effectMap.fx[id]
      }

      if (lib) {
        dependencies.add(lib)
      }
    })

    setTypes.forEach(({ set }) => {
      set.parts.forEach((part) => {
        const lib = HumanFigure.getLib(this.figuremap, part.type, part.id)

        if (lib) dependencies.add(lib)

        return dependencies
      })
    })

    const resources = Array.from(dependencies).reduce((acc, lib) => {
      acc[lib] = `${lib}/${lib}.json`
      return acc
    }, {})

    await this.loader.add(resources).wait()
  }

  async createFigure(options: HumanFigureProps) {
    const setTypes = Object.entries(options.figure)
      .map(
        ([typeName, partOptions]) => {
          const settype = this.figuredata.settype[typeName as FigureDataSettypeKey]
          const palette = this.figuredata.palette[settype.paletteid]
          const colors = partOptions.colors.map(
            colorId => Number('0x' + palette[colorId].color)
          )
          return {
            set: this.figuredata.settype[typeName].set[+partOptions.id],
            settype,
            colors,
            typeName
          } as SetType
        }
      )


    const actions = this.getActions(options)

    await this.loadDependencies(setTypes, actions)

    const structure = new AvatarStructure(this, actions).build(setTypes, options)
    const container = structure.createContainer(options)

    return {
      container,
      structure
    }
  }

  private checkPrevents(actionPrevents: string, actions: any[], props: HumanFigureProps) {
    const prevents = new Set((actionPrevents || '').split(','))

    if (prevents.size > 0) {
      actions = actions.filter(([a]) => {
        if (a.state === 'fx') {
          return !prevents.has(`${a.state}.${props.actions.fx}`)
        }
        return !prevents.has(a.state)
      })
    }

    return actions
  }

  private getActions(props: HumanFigureProps) {
    let actions = Object.entries(props.actions)
      .map(([name, value]) => [
        this.avatarActions[this.actionTypeToAnimationName[name]],
        value
      ])
      .filter(a => a[0])
      .sort((a, b) => b[0].precedence - a[0].precedence)

    for (const [action, value] of actions) {
      actions = this.checkPrevents(action.prevents || '', actions, props)

      if (action.types && value in action.types) {
        const type = action.types[value]
        actions = this.checkPrevents(type.prevents || '', actions, props)
      }
    }

    return actions
  }
}
