import { SetType, HumanFigureProps, PartType, HumanGroupName, HumanGroup, HumanItem } from './types'
import { Container, Sprite, Texture } from 'pixi.js'
import { HumanFigure } from './util/figure'
import { HumanPart, HumanChunkProps, calcFlip } from './AvatarChunk'
import { HumanDirection } from './util/directions'
import { AvatarImager } from './human-imager'
import { ZIndexUtils } from '../../../engine/isometric/ZIndexUtils'

export class AvatarStructure {
  constructor(
    private humanImager: AvatarImager,
    public actions: any[]
  ) { }

  groups: Record<PartType, HumanPart[]>
  canvas: any
  container: Container

  build(setTypes: SetType[], options: HumanFigureProps) {
    const { actions } = this
    const lastAction = actions[actions.length - 1][0]

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
          return acc
        }

        if (!acc[part.type]) {
          acc[part.type] = []
        }

        const libName = HumanFigure.getLib(
          this.humanImager.figuremap,
          part.type,
          part.id
        )

        const isHeadPart = HumanFigure.isFromPartSet(this.humanImager.partsets, 'head', part.type)

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
      }, <Record<PartType, HumanPart[]>>{})

    this.groups = groupRenderTree;
    this.canvas = this.humanImager.geometry.canvas[options.size || 'h'][lastAction.geometrytype]
    this.applyActions()

    return this
  }

  partTypeToContainer = <Record<PartType, Container>>{}

  get geometry (): Record<HumanGroupName, HumanGroup> {
    const [lastAction] = this.actions[this.actions.length - 1]
    return this.humanImager.geometry.type[lastAction.geometrytype]
  }

  createContainer(options: HumanFigureProps): Container {
    const mainContainer = new Container()

    mainContainer.sortableChildren = true

    for (const [groupName, group] of Object.entries(this.geometry)) {
      const groupContainer = new Container()

      groupContainer.sortableChildren = true
      groupContainer.name = groupName

      const direction = groupName === 'head' ? options.head_direction : options.direction

      // TODO: how to fix indexes?
      if (groupName === 'rightarm' || groupName === 'leftarm') {
        group.z = -1
      }
      groupContainer.zIndex = group.zIndex = this.calcGroupZIndex(direction, group)

      for (const [partType, groupItem] of Object.entries(group.items)) {
        const partGroup = this.groups[partType]

        if (!partGroup?.length) continue;

        const partContainer = new Container()
        this.partTypeToContainer[partType] = partContainer

        partContainer.name = partType
        partContainer.zIndex = groupItem.zIndex = this.calcPartZIndex(direction, groupItem)

        for (const humanPart of partGroup) {
          const sprite = new Sprite()
          this.updateSprite(sprite, humanPart)
          partContainer.addChild(sprite)
        }

        groupContainer.addChild(partContainer)
      }

      mainContainer.addChild(groupContainer)
    }

    mainContainer.pivot.x = 2
    mainContainer.pivot.y -= 14

    return this.container = mainContainer
  }

  calcGroupZIndex(direction: HumanDirection, humanGroup: HumanGroup) {
    const angle = HumanDirection.DirectionAngles[direction]
    const yRotationMatrix = ZIndexUtils.getYRotationMatrix(angle)
    const vec3: any = ZIndexUtils.multiply4x4Matrix(yRotationMatrix, humanGroup)
    vec3.radius = humanGroup.radius

    const distance = ZIndexUtils.getDistance(vec3, this.humanImager.geometry.camera)
    return -distance
  }

  calcPartZIndex(direction: HumanDirection, humanItem: HumanItem): number {
    const angle = HumanDirection.DirectionAngles[direction]
    const yRotationMatrix = ZIndexUtils.getYRotationMatrix(angle)
    const vec3 = ZIndexUtils.multiply4x4Matrix(yRotationMatrix, humanItem)

    return ZIndexUtils.getDistance(humanItem, vec3)
  }

  getOffsetOf(humanPart: HumanPart, overrides: Partial<HumanChunkProps> = {}): [number, number] | undefined {
    const { manifest } = this.humanImager.loader.resources[humanPart.lib]
    const stateName = humanPart.buildPartName(overrides)
    const { offset = null } = manifest.assets[stateName] ?? {}
    return offset?.split(',').map(o => parseInt(o))
  }

  getTextureOf(humanPart: HumanPart, overrides: Partial<HumanChunkProps> = {}): Texture | undefined {
    const { spritesheet } = this.humanImager.loader.resources[humanPart.lib]
    return spritesheet.textures[
      humanPart.buildFilenameName(overrides)
    ]
  }

  getPartset(partType: string) {
    return this.humanImager.partsets.partSets[partType]
  }

  private applyActions() {
    for (const [action, value] of this.actions) {
      const activePartset = this.humanImager.partsets.activePartSets[action.activepartset] || []

      for (const partType of activePartset) {
        this.groups[partType]?.forEach((part: HumanPart) => part.assetpartdefinition = action.assetpartdefinition)
      }
    }
  }

  updateSprite(sprite: Sprite, humanPart: HumanPart) {
    let offsets = this.getOffsetOf(humanPart)
    let texture = this.getTextureOf(humanPart)
    let flipped = false

    if (!texture) {
      if (humanPart.type === 'ey' && humanPart.assetpartdefinition === 'std') {
        texture = this.getTextureOf(humanPart, { assetpartdefinition: 'sml' })
      }
      const partset = this.getPartset(humanPart.type)

      // Fliped texture and offsets
      if (!texture && humanPart.direction > 3 && humanPart.direction < 7) {
        const opts: Partial<HumanChunkProps> = {
          type: partset['flipped-set-type'] ?? humanPart.type,
          direction: calcFlip(humanPart.direction)
        }

        texture = this.getTextureOf(humanPart, opts)
        offsets = this.getOffsetOf(humanPart, opts)

        if (!texture) {
          Object.assign(opts, { assetpartdefinition: 'std', frame: 0 })
          offsets = this.getOffsetOf(humanPart, opts)
          texture = this.getTextureOf(humanPart, opts)
        }

        flipped = true
      }

      if (!texture) {
        const opts = { assetpartdefinition: 'std', frame: 0 }
        offsets = this.getOffsetOf(humanPart, opts)
        texture = this.getTextureOf(humanPart, opts)
      }
    }

    sprite.texture = texture;

    if (offsets) {
      sprite.pivot.x = offsets[0] - Number(humanPart.dx || 0)
      sprite.pivot.y = offsets[1] + Number(humanPart.dy || 0)
    }

    if (flipped) {
      sprite.scale.x = -1
      sprite.pivot.x += 68
    }

    if (humanPart.tint !== null && humanPart.type !== 'ey') sprite.tint = humanPart.tint
  }

}
