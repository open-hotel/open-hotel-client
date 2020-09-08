import { SetType, HumanFigureProps } from './humanImagerTypes'
import { Container, Sprite } from 'pixi.js'
import { Loader } from '../../../engine/loader'
import { HumanFigure } from './figure.util'
import { HumanPart } from './HumanPart'


export class RenderTree {
  constructor (
    private loader: Loader,
    private actions: any[]
  ) {

  }

  groups: object
  canvas: any


  createRenderTree (setTypes: SetType[], options: HumanFigureProps) {
    const { actions } = this
    const lastAction = actions[actions.length - 1]
    const geometryType = this.loader.resources.geometry.json.type[lastAction.geometrytype]

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
          humanParts: []
        }
      }

      const libName = HumanFigure.getLib(
        this.loader.resources.figuremap.json,
        part.type,
        part.id
      )

      const humanPart = new HumanPart({
        id: part.id,
        tint: part.setType.colors[part.colorindex - 1],
        type: part.type,
        lib: libName,
        direction: HumanFigure.isFromPartSet(this.loader.resources.partsets.json, 'head', part.type)
          ? options.head_direction
          : options.direction
      })

      acc[geometryGroupName].parts[part.type].humanParts.push(humanPart)

      return acc
    }, {})

    this.groups = groupRenderTree,
    this.canvas = this.loader.resources.geometry.json.canvas[options.size || 'h'][lastAction.geometrytype]
    return this
  }

  createContainer (): Container {
    const mainContainer = new Container()
    for (const [groupName, group] of Object.entries(this.groups)) {
      const groupContainer = new Container()
      groupContainer.name = groupName
      groupContainer.zIndex = group.radius

      for (const [partName, part] of Object.entries(group.parts)) {
        const partContainer = new Container()
        partContainer.name = partName
        partContainer.zIndex = part.radius

        for (const humanPart of part.humanParts) {
          const sprite = this.createSprite(humanPart)
          partContainer.addChild(sprite)
        }

        groupContainer.addChild(partContainer)
      }
      mainContainer.addChild(groupContainer)
    }

    return mainContainer
  }

  createSprite (humanPart: HumanPart): Sprite {
    const { manifest, spritesheet } = this.loader.resources[`${humanPart.lib}/${humanPart.lib}.json`]
    const stateName = humanPart.buildState()
    const offsets: [number, number] = manifest.assets[stateName].offset.split(',').map(o => parseInt(o))
    const textures = spritesheet.textures[humanPart.buildFilenameName()]
    const sprite = new Sprite(textures)

    sprite.pivot.x = offsets[0]
    sprite.pivot.y = offsets[1]
    sprite.tint = humanPart.tint

    return sprite
  }

}
