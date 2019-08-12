import { GameObject } from '../../engine/lib/GameObject'
import { Floor } from './Floor'
import { Cube, CubeOptions } from '../../engine/lib/geometry/Cube'
import { Texture, SCALE_MODES } from 'pixi.js'
import { Application } from '../../engine/Application'
import { Matrix } from '../../engine/lib/utils/Matrix'
import { createFloorTestFunction } from '../../engine/lib/utils/FloorUtils'
import wallTests from './walls.json'
import { Vector3 } from '../../engine/lib/isometric'

// Defines if wall is facing X or Y axis
type RotationX = 1
type RotationY = 3
type RotationXY = 2

const RotationX = 1
const RotationY = 3
const RotationXY = 2

type WallDirection = RotationX | RotationY | RotationXY

export class Wall extends GameObject {
  private $app: Application

  constructor(private direction: WallDirection = RotationX) {
    super()
    this.$app = Application.get()
    this.texture = this.generateTexture()
  }

  public static fromFloor(floor: Floor): Wall[] {
    return floor.$map.reduce<Wall[]>((acc, el, x, y, map) => {
      const block = floor.$mapBlocks.get(x, y)

      if (!block) return acc

      const getWall = createFloorTestFunction(map.neighborsOf(x, y))
      const wallValue = wallTests.find(item => getWall(Matrix.from(item.test)))

      if (wallValue) {
        const wall = new Wall(wallValue.value as WallDirection)
        const position = block.isoPosition.clone().add(new Vector3(-8, 0, Wall.WALL_HEIGHT - 8))

        position.copyTo(wall.isoPosition)
        acc.push(wall)
      }

      return acc
    }, [])
  }

  public static WALL_HEIGHT = 128

  private static $cache: {
    1?: Texture
    2?: Texture
    3?: Texture
  } = {}

  private generateTexture(): PIXI.Texture {
    const { direction } = this
    const Cache = Wall.$cache
    const cached = Cache[direction]

    if (cached) return cached

    const g = new PIXI.Container()
    const walls: Cube[] = []

    const cubeOptions: CubeOptions = {
      height: Wall.WALL_HEIGHT,
      colors: {
        top: 0x6f717a,
        front: 0x9597a3,
        left: 0xb6b8c7,
      }
    }

    const wallA = new Cube({
      ...cubeOptions,
      width: 32,
      depth: 8,
    })

    const wallB = new Cube({
      ...cubeOptions,
      width: 8,
      depth: 32,
      position: new Vector3(-16,0,-8)
    })

    if (direction === 1) wallA.alpha = 0
    if (direction === 3) wallB.alpha = 0

    walls.push(wallB,wallA)

    g.addChild(...walls)
    return (Cache[direction] = this.$app.renderer.generateTexture(g, SCALE_MODES.NEAREST, 1))
  }
}
