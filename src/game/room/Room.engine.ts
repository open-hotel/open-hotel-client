import { Container } from 'pixi.js-legacy'
import { Provider } from 'injets'
import { ApplicationProvider } from '../pixi/application.provider'
import { Matrix } from '../../engine/lib/util/Matrix'
import { Floor } from './floor/Floor'
import { RoomImager, StairDirection } from '../imager/room.imager'
import { IsoPoint, IsoPointObject } from '../../engine/lib/IsoPoint'
import { RoomModel } from './types/room.model'
import { createFloorTestFunction } from '../../engine/lib/util/FloorUtils'
import ladders from './floor/ladders'
import { Wall } from './wall/Wall'
import { PointLike } from '../../engine/lib/util/Walk'

const PRIORITY = {
  WALL_H: 2,
  WALL_V: 1,
  FLOOR: 3,
  FLOOR_DOOR: 1
}

@Provider('TRANSIENT')
export class RoomEngine {
  public readonly container = new Container()
  private heightmap: Matrix<number>
  private tiles: Matrix<Floor | null>
  private walls: Matrix<Wall | null>
  private door: PointLike

  constructor(private readonly app: ApplicationProvider, private readonly roomImager: RoomImager) {}

  private getStairType(blocks: Matrix<number>): StairDirection | undefined {
    const hasLadder = createFloorTestFunction(blocks)
    const l = ladders.find(l => hasLadder(l.test))
    return l && (l.value as StairDirection)
  }

  renderFloor() {
    this.tiles = this.heightmap.map((z, x, y) => {
      if (z <= 0) return null

      const neighbors = this.heightmap.neighborsOf(x, y)
      const stairType = this.getStairType(neighbors)
      const isStair = stairType === undefined
      const texture = isStair
        ? this.roomImager.generateFloorTileTexture()
        : this.roomImager.generateStairTexture(stairType)
      const zPos = isStair ? (z - 1) * 32 + 8 : z * 32
      const position = new IsoPoint(x * 32, y * 32, zPos)
      const tile = new Floor(texture, position)
      const isDoor = x === this.door.x && y === this.door.y
      const inBound = x === 0 || y === 0
      const priority = isDoor && inBound ? PRIORITY.FLOOR_DOOR : PRIORITY.FLOOR

      if(inBound && isDoor) tile.tint = 0xff0000

      tile.zIndex = this.calcZIndex(position, priority)

      this.container.addChild(tile)

      return tile
    })
  }

  calcZIndex({ x, y, z }: IsoPointObject, priority = 1) {
    return (x + y + z) * priority
  }

  renderWalls() {
    const WALL_HEIGHT = 128
    const MAX_HEIGHT = this.heightmap.reduce((max, z) => Math.max(max, z * 32), -Infinity)

    this.walls = new Matrix(this.heightmap.width, this.heightmap.height)

    let maxVX = Infinity

    // Paredes Horizontais
    wallsH: for (let y = 0; y < this.heightmap.height; y++) {
      if (y === this.door.y) continue
      // Percorre as colunas até o primeiro bloco vertical
      for (let x = 0; x < this.heightmap.width; x++) {
        const z = this.heightmap.get(x, y)
        // Se for 0, não inserir paredes
        if (!z) continue

        // Não enfileirar paredes horizontais verticalmente
        for (let wy = y; wy >= 0; wy--) {
          const block = this.walls.get(x, wy)
          if (block) continue wallsH
        }

        const elevation = (z - 1) * 32
        const height = MAX_HEIGHT - elevation + WALL_HEIGHT
        const isDoor = x === this.door.x && y - 1 === this.door.y

        // Renderiza
        const texture = this.roomImager.generateWallTexture(1, 32, height, isDoor)
        const position = new IsoPoint((x + 1) * 32, y * 32, elevation + height + 20)
        const wall = new Wall(texture, position)

        wall.zIndex = this.calcZIndex(
          {
            ...position,
            z: elevation,
          },
          PRIORITY.WALL_H,
        )

        this.walls.set(x, y, wall)

        this.container.addChild(wall)
      }
    }

    // Paredes Verticais
    for (let y = 0; y < this.heightmap.height; y++) {
      for (let x = 0; x < this.heightmap.width; x++) {
        if (x === this.door.x) continue
        const z = this.heightmap.get(x, y)
        // Não testar blocos com 0
        if (!z) continue

        // Não enfileirar paredes verticais
        // horizontalmente
        if (x > maxVX) break

        // Define a posição X máxima para o bloco atual
        maxVX = x

        // Bloco com canto se já existir
        // um bloco horizontal nesta posição
        // let conner = walls[y][x] === WH

        let elevation = (z - 1) * 32
        const height = MAX_HEIGHT - elevation + WALL_HEIGHT
        const isConner = !!this.walls.get(x, y)
        const isDoor = (x - 1) === this.door.x && y === this.door.y

        if (isConner) elevation += 4

        // Renderiza
        const texture = this.roomImager.generateWallTexture(0, 32, height, isDoor, 8, isConner)
        const position = new IsoPoint(x * 32 - 8, y * 32, elevation + height)
        const wall = new Wall(texture, position)

        wall.zIndex = this.calcZIndex(
          {
            ...position,
            z: elevation,
          },
          PRIORITY.WALL_V,
        )

        this.walls.set(x, y, wall)

        this.container.addChild(wall)
      }
    }
  }

  init(room: RoomModel) {
    this.door = {
      ...room.door,
    }
    this.heightmap = room.heightmap
    this.container.sortableChildren = true
    this.renderWalls()
    this.renderFloor()
    this.container.sortChildren()
  }
}
