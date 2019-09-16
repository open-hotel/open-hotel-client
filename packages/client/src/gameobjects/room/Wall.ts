import * as PIXI from 'pixi.js'
import { GameObject } from '../../engine/lib/GameObject'
import { Floor } from './Floor'
import { FloorBlock } from './FloorBlock'
import { Cube, CubeOptions } from '../../engine/lib/geometry/Cube'
import { FloorLadder } from './FloorLadder'
import { SCALE_MODES } from 'pixi.js'
import { Application } from '../../engine/Application'
import { Matrix } from '../../engine/lib/utils/Matrix'
import { Vector3 } from '../../engine/lib/isometric'
import wallTestsJSON from './walls.json'
import { createFloorTestFunction } from '../../engine/lib/utils/FloorUtils'

const wallTests = wallTestsJSON.map(({ test, value }) => ({
  value,
  test: Matrix.from(test),
}))

// Defines if wall is facing X or Y axis
type RotationX = 2
type RotationY = 4
type RotationXY = 3
type Rotation = RotationX | RotationY | RotationXY

const RotationX = 2
const RotationY = 4
const RotationXY = 3

export class Wall extends GameObject {
  private $app: Application

  constructor(isoPosition: Vector3 = new Vector3(), private rotatedTo: Rotation = RotationX) {
    super()

    this.$app = Application.get()
    this.texture = this.generateTexture()

    isoPosition = isoPosition.clone()
    isoPosition.x -= 8
    isoPosition.z = Wall.CURRENT_HEIGHT + 28
    isoPosition.copyTo(this.isoPosition)
  }

  public static fromFloor(floor: Floor): Matrix<Wall> {
    type Block = FloorBlock | FloorLadder

    return floor.$map.map((value, x, y) => {
      // Não colocar parede se o bloco não existir
      if (!value) return null

      // If there're blocks in previous y and previous x at the same time, it should not have walls
      for (let row = y - 1; row >= 0; row--) {
        for (let col = 0; col <= x - 1; col++) {
          if (floor.$map.get(col, row)) {
            return
          }
        }
      }

      const neighbors = floor.$map.neighborsOf(x, y)
      const getWall = createFloorTestFunction(neighbors)
      const wall = wallTests.find(item => getWall(item.test))

      if (!wall) return null

      const block = floor.$mapBlocks.get(x, y)

      return new Wall(block.isoPosition, wall.value as Rotation)
    })
  }

  public static WALL_HEIGHT = 128
  public static CURRENT_HEIGHT = 128

  private static $cache: {
    [key: string]: PIXI.Texture
  } = {}

  private generateTexture(): PIXI.Texture {
    const { rotatedTo } = this
    const { z } = this.isoPosition
    const cacheKey = `${rotatedTo}_${z}_${Wall.CURRENT_HEIGHT}`
    const Cache = Wall.$cache

    const cached = Cache[cacheKey]

    if (cached) {
      return cached
    }

    const cubeOptions: CubeOptions = {
      height: Wall.CURRENT_HEIGHT,
      colors: {
        top: 0x6f717a,
        front: 0x9597a3,
        left: 0xb6b8c7,
      },
    }

    const walls = new PIXI.Container()

    const wallA = new Cube({
      ...cubeOptions,
      position: new Vector3(0, 0, 0),
      width: 40,
      depth: 8,
    })

    const wallB = new Cube({
      ...cubeOptions,
      position: new Vector3(0, 8, 0),
      width: 8,
      depth: 32,
    })

    if (this.rotatedTo === RotationX) wallA.alpha = 0
    if (this.rotatedTo === RotationY) wallB.alpha = 0

    walls.addChild(wallA, wallB)

    return (Cache[cacheKey] = this.$app.renderer.generateTexture(walls, SCALE_MODES.NEAREST, 1))
  }
}
