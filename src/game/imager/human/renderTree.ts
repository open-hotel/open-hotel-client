import { SetType, HumanFigureProps } from './humanImagerTypes'
import { Container, Sprite } from 'pixi.js'
import { Loader } from '../../../engine/loader'
import { HumanFigure } from './figure.util'
import { HumanPart, calcFlip } from './HumanPart'
import { HumanDirection } from './direction.enum'
import { Vector3 } from '../../../engine/isometric'
import { Viewport } from 'pixi-viewport'


export class RenderTree {
  constructor(
    private loader: Loader,
    private actions: any[],
    private camera: Viewport,
  ) {

  }

  groups: object
  canvas: any


  createRenderTree(setTypes: SetType[], options: HumanFigureProps) {
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
            ...geometryGroup,
            parts: {}
          }
        }

        if (!acc[geometryGroupName].parts[part.type]) {
          acc[geometryGroupName].parts[part.type] = {
            ...geometryGroup.items[part.type],
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

  createContainer(options: HumanFigureProps): Container {

    const mainContainer = new Container()
    mainContainer.sortableChildren = true

    for (const [groupName, group] of Object.entries(this.groups)) {
      const groupContainer = new Container()
      groupContainer.sortableChildren = true
      groupContainer.name = groupName
      const direction = groupName === 'head' ? options.head_direction : options.direction
      groupContainer.zIndex = group.zIndex = this.calcPointZIndex(direction, group)

      for (const [partName, part] of Object.entries(group.parts)) {
        const partContainer = new Container()
        // partContainer.sortableChildren = true
        partContainer.name = partName
        // @ts-ignore
        partContainer.zIndex = part.zIndex = this.calcPointZIndex(direction, part)

        // @ts-ignore
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

  calcPointZIndex(direction: number, point): number {
    const angle = HumanDirection.DirectionAngles[direction]

    var angleInRad = ((angle * Math.PI) / 180)
    var cos: number = Math.cos(angleInRad);
    var sin: number = Math.sin(angleInRad);
    const vec4 = [cos, 0, sin, 0, 1, 0, -(sin), 0, cos]

    const vecMult = (vector4D, vector3D: any) => {
      var _local_2: Number = (((vector3D.x * vector4D[0]) + (vector3D.y * vector4D[3])) + (vector3D.z * vector4D[6]));
      var _local_3: Number = (((vector3D.x * vector4D[1]) + (vector3D.y * vector4D[4])) + (vector3D.z * vector4D[7]));
      var _local_4: Number = (((vector3D.x * vector4D[2]) + (vector3D.y * vector4D[5])) + (vector3D.z * vector4D[8]));
      return { x: _local_2, y: _local_3, z: _local_4 }
    }

    const vec3 = vecMult(vec4, point)

    const getDistance = (vec3) => {
      var min = Math.abs(((vec3.z - point.z) - point.radius));
      var max = Math.abs(((vec3.z - point.z) + point.radius));
      return (Math.min(min, max))
    }
    return getDistance(vec3)
  }

  createSprite(humanPart: HumanPart): Sprite {
    const { manifest, spritesheet } = this.loader.resources[`${humanPart.lib}/${humanPart.lib}.json`]
    const stateName = humanPart.buildState()
    const offsets: [number, number] = manifest.assets[stateName].offset.split(',').map(o => parseInt(o))
    let texture = spritesheet.textures[humanPart.buildFilenameName()]
    const sprite = new Sprite()

    if (!texture) {
      if (humanPart.type === 'ey' && humanPart.assetpartdefinition == 'std') {
        texture = spritesheet.textures[
          humanPart.buildFilenameName({ assetpartdefinition: 'sml' })
        ]
      }
    }

    sprite.texture = texture;
    sprite.pivot.x = offsets[0]
    sprite.pivot.y = offsets[1]

    if(humanPart.type !== 'ey') sprite.tint = humanPart.tint

    return sprite
  }

}
