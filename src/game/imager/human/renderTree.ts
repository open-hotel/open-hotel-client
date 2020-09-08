import { SetType, HumanFigureProps } from './humanImagerTypes'


export class RenderTree {
  constructor (
    private geometry: any,
    private actions: any[]
  ) {

  }


  createRenderTree (setTypes: SetType[], options: HumanFigureProps) {
    const { actions } = this
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

    return {
      groups: groupRenderTree,
      canvas: this.geometry.canvas[options.size || 'h'][lastAction.geometrytype]
    }
  }
}
