import { SetType, HumanFigureProps } from './humanImagerTypes'
import { Container, Sprite, Texture } from 'pixi.js'
import { Loader } from '../../../engine/loader'
import { HumanFigure } from './figure.util'
import { HumanPart, HumanChunkProps, calcFlip } from './HumanPart'
import { HumanDirection } from './direction.enum'

export class RenderTree {
  constructor(
    private loader: Loader,
    public actions: any[]
  ) { }

  groups: object
  canvas: any
  container: Container

  build(setTypes: SetType[], options: HumanFigureProps) {
    const { actions } = this
    const lastAction = actions[actions.length - 1]

    const hiddenLayers = new Set<string>()

    const groupRenderTree = setTypes
      .flatMap(setType => {
        if (setType.set.hiddenLayers) {
          setType.set.hiddenLayers.forEach(part => hiddenLayers.add(part))
        }

        return setType.set.parts.map(part => ({ ...part, setType }))
      })
      .reduce((acc, part) => {
        if (hiddenLayers.has(part.type)) {
          return acc;
        }

        if (!acc[part.type]) {
          acc[part.type] = []
        }

        const libName = HumanFigure.getLib(
          this.loader.resources.figuremap.json,
          part.type,
          part.id
        )

        const isHeadPart = HumanFigure.isFromPartSet(this.loader.resources.partsets.json, 'head', part.type)

        const humanPart = new HumanPart({
          id: part.id,
          tint: part.colorable ? part.setType.colors[part.colorindex - 1] : null,
          type: part.type,
          lib: libName,
          part,
          direction: isHeadPart
            ? options.head_direction
            : options.direction
        })

        acc[part.type].push(humanPart)

        return acc
      }, {})

    this.groups = groupRenderTree;
    this.canvas = this.loader.resources.geometry.json.canvas[options.size || 'h'][lastAction.geometrytype]
    this.applyActions()

    return this
  }

  partTypeToContainer: Record<string, Container> = {}

  createContainer(options: HumanFigureProps): Container {
    const lastAction = this.actions[this.actions.length - 1]
    const geometryType = this.loader.resources.geometry.json.type[lastAction.geometrytype]

    const mainContainer = new Container()

    mainContainer.sortableChildren = true

    for (const [groupName, group] of Object.entries<any>(geometryType)) {
      const groupContainer = new Container()

      groupContainer.sortableChildren = true
      groupContainer.name = groupName

      const direction = groupName === 'head' ? options.head_direction : options.direction

      // TODO: why????
      if (groupName === 'rightarm' || groupName === 'leftarm') {
        group.z = -1
      }
      groupContainer.zIndex = group.zIndex = this.calcPointZIndex(direction, group)

      for (const [partType, groupItem] of Object.entries<any>(group.items)) {
        const partGroup = this.groups[partType]

        if (!partGroup?.length) continue;

        const partContainer = new Container()
        this.partTypeToContainer[partType] = partContainer

        partContainer.name = partType
        partContainer.zIndex = groupItem.zIndex = this.calcPointZIndex(direction, groupItem)

        for (const humanPart of partGroup) {
          const sprite = this.createSprite(humanPart)
          partContainer.addChild(sprite)
        }

        groupContainer.addChild(partContainer)
      }

      mainContainer.addChild(groupContainer)
    }

    return this.container = mainContainer
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

  getOffsetOf(humanPart: HumanPart, overrides: Partial<HumanChunkProps> = {}): [number, number] | undefined {
    const { manifest } = this.loader.resources[`${humanPart.lib}/${humanPart.lib}.json`]
    const stateName = humanPart.buildState(overrides)
    const { offset = null } = manifest.assets[stateName] ?? {}
    return offset?.split(',').map(o => parseInt(o))
  }

  getTextureOf(humanPart: HumanPart, overrides: Partial<HumanChunkProps> = {}): Texture | undefined {
    const { spritesheet } = this.loader.resources[`${humanPart.lib}/${humanPart.lib}.json`]
    return spritesheet.textures[
      humanPart.buildFilenameName(overrides)
    ]
  }

  getPartset(partType: string) {
    return this.loader.resources.partsets.json.partSets[partType]
  }

  private applyActions () {
    for (const action of this.actions) {
      const activePartset = this.loader.resources.partsets.json.activePartSets[action.activepartset]
      for (const partType of activePartset) {
        this.groups[partType]?.forEach((part: HumanPart) => part.assetpartdefinition = action.assetpartdefinition)
      }
    }
  }

  createSprite(humanPart: HumanPart): Sprite {
    const partset = this.getPartset(humanPart.type)
    let offsets = this.getOffsetOf(humanPart)
    let texture = this.getTextureOf(humanPart)
    let flipped = false
    const sprite = new Sprite()

    if (!texture) {
      if (humanPart.type === 'ey' && humanPart.assetpartdefinition == 'std') {
        texture = this.getTextureOf(humanPart, { assetpartdefinition: 'sml' })
      }

      // Fliped texture and offsets
      if (!texture && humanPart.direction > 3 && humanPart.direction < 7) {
        const opts: Partial<HumanChunkProps> = {
          type: partset['flipped-set-type'] ?? humanPart.type,
          direction: calcFlip(humanPart.direction)
        }

        texture = this.getTextureOf(humanPart, opts)
        offsets = this.getOffsetOf(humanPart, opts)
        flipped = true
      }
    }

    sprite.texture = texture;

    if (offsets) {
      sprite.pivot.x = offsets[0]
      sprite.pivot.y = offsets[1]
    }

    if (flipped) {
      sprite.scale.x = -1
      sprite.x += this.canvas.width
    }

    if (humanPart.tint !== null && humanPart.type !== 'ey') sprite.tint = humanPart.tint

    return sprite
  }

}
