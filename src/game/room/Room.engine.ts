import { Container, Graphics } from 'pixi.js'
import { Provider, Inject } from 'injets'
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
  FLOOR_DOOR: 1,
  WALL_V: 1,
  WALL_H: 3,
  FLOOR: 4,
}

@Provider('TRANSIENT')
export class RoomEngine {
  public readonly container = new Container()
  private heightmap: Matrix<number>
  private tiles: Matrix<Floor | null>
  private walls: Matrix<Wall | null>
  private door: PointLike
  private spawn: PointLike

  constructor(private readonly app: ApplicationProvider, private readonly roomImager: RoomImager) {}

  private getStairType(blocks: Matrix<number>) {
    const hasLadder = createFloorTestFunction(blocks)
    const l = ladders.find(l => hasLadder(l.test))
    const stairType = l && (l.value as StairDirection)
    const offset = l && l.offset

    return {
      stairType,
      offset: Object.assign({ x: 0, y: 0, z: 0 }, {}, offset) as IsoPointObject,
    }
  }

  renderFloor() {
    const { TOP_LEFT, TOP, TOP_RIGHT, LEFT, CENTER, RIGHT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT } = Matrix.NEIGHBORS
    const neighborsItems = [TOP_LEFT, TOP, TOP_RIGHT, LEFT, CENTER, RIGHT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT]

    this.tiles = this.heightmap.map((z, x, y) => {
      if (z <= 0) return null

      const neighbors = Matrix.from(this.heightmap.neighborsOf(x, y, neighborsItems), 3, 3)
      const { stairType, offset } = this.getStairType(neighbors)

      const isStair = stairType === undefined
      const texture = isStair
        ? this.roomImager.generateFloorTileTexture()
        : this.roomImager.generateStairTexture(stairType)
      const zPos = isStair ? (z - 1) * 32 + 8 : z * 32
      const position = new IsoPoint(x * 32, y * 32, zPos)

      position.add(offset)

      const tile = new Floor(texture, position)
      const isDoor = x === this.door.x && y === this.door.y
      const inBound = this.walls.get(x + 1, y) || this.walls.get(x, y + 1)
      const priority = isDoor && inBound ? PRIORITY.FLOOR_DOOR : PRIORITY.FLOOR

      if (this.spawn.x === x && this.spawn.y === y) tile.tint = 0xff0000

      tile.zIndex = this.calcZIndex(position, priority)

      this.container.addChild(tile)
      return tile
    })
  }

  calcZIndex({ x, y, z }: IsoPointObject, priority = 1) {
    return (x + y + z) * priority
  }

  renderWalls() {
    const WALL_HEIGHT = 92
    const MAX_HEIGHT = this.heightmap.reduce((max, z) => Math.max(max, z * 32), -Infinity)

    this.walls = new Matrix(this.heightmap.width, this.heightmap.height)

    let maxVX = Infinity

    if (this.spawn) {
      const spawnIsDoor = this.heightmap
        .neighborsOf(this.spawn.x, this.spawn.y, [Matrix.NEIGHBORS.TOP, Matrix.NEIGHBORS.BOTTOM, Matrix.NEIGHBORS.LEFT])
        .every(b => !b)

      if (spawnIsDoor) {
        this.door = this.spawn
      }
    }
    // Procurando porta na parede vertical
    loopDoor: for (let y = 0; !this.door && y < this.heightmap.height; y++) {
      for (let x = 0; x < this.heightmap.width; x++) {
        const z = this.heightmap.get(x, y)

        // Não testar blocos com 0
        if (!z) continue

        // Não enfileirar paredes verticais
        // horizontalmente
        if (x > maxVX) break

        // Define a posição X máxima para o bloco atual
        maxVX = x

        const notHasX = this.heightmap
          .neighborsOf(x, y, [Matrix.NEIGHBORS.TOP, Matrix.NEIGHBORS.BOTTOM, Matrix.NEIGHBORS.LEFT])
          .every(b => !b)

        if (notHasX) {
          this.door = {
            x,
            y,
          }
          if (!this.spawn) this.spawn = this.door
          break loopDoor
        }
      }
    }

    maxVX = Infinity

    // Paredes Horizontais
    wallsH: for (let y = 0; y < this.heightmap.height; y++) {
      // Percorre as colunas até o primeiro bloco vertical
      for (let x = 0; x < this.heightmap.width; x++) {
        if (x === this.door.x && y === this.door.y) continue
        const z = this.heightmap.get(x, y)
        // Se for 0, não inserir paredes
        if (!z) continue

        // Não enfileirar paredes horizontais verticalmente
        for (let wy = y; wy >= 0; wy--) {
          const block = this.walls.get(x, wy)
          if (block) continue wallsH
        }

        const elevation = (z - 1) * 32
        const height = MAX_HEIGHT + WALL_HEIGHT
        const isDoor = x === this.door.x && y - 1 === this.door.y

        // Renderiza
        const texture = this.roomImager.generateWallTexture(1, 32, height, isDoor, 8, false, elevation)
        const position = new IsoPoint((x + 1) * 32, y * 32, height + 20)
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
        if (x === this.door.x && y === this.door.y) continue
        const z = this.heightmap.get(x, y)
        // Não testar blocos com 0
        if (!z) continue

        // Não enfileirar paredes verticais
        // horizontalmente
        if (x > maxVX) break

        // Define a posição X máxima para o bloco atual
        maxVX = x

        let elevation = (z - 1) * 32

        // Bloco com canto se já existir
        // um bloco horizontal nesta posição
        // let conner = walls[y][x] === WH

        let neighY = [Matrix.NEIGHBORS.TOP, Matrix.NEIGHBORS.BOTTOM].map(r => {
          const nx = r.x + x
          const ny = r.y + y
          return {
            x: nx,
            y: ny,
            z: this.heightmap.get(x, y)
          }
        })
        let minZ = z

        let [top, bottom] = neighY

        while (top?.z) {
          minZ = Math.min(top.z, minZ)

          top = {
            x: top.x,
            y: top.y - 1,
            z: this.heightmap.get(top.x, top.y - 1),
          }
        }

        while (bottom?.z) {
          minZ = Math.min(bottom.z, minZ)

          bottom = {
            x: bottom.x,
            y: bottom.y + 1,
            z: this.heightmap.get(bottom.x, bottom.y + 1),
          }
        }

        const minZElevation = (minZ - 1) * 32;

        const isDoor = x - 1 === this.door.x && y === this.door.y
        const height = MAX_HEIGHT + WALL_HEIGHT
        const isConner = !!this.walls.get(x, y)

        // Renderiza
        const texture = this.roomImager.generateWallTexture(0, 32, height, isDoor, 8, isConner, elevation)
        const position = new IsoPoint(x * 32 - 8, y * 32, height)
        const wall = new Wall(texture, position)

        if (isConner)
          position
            .add(0, 0, 4)
            .toPoint()
            .copyTo(wall.position)

        wall.zIndex = this.calcZIndex(position, PRIORITY.WALL_V)

        this.walls.set(x, y, wall)

        this.container.addChild(wall)
      }
    }
  }

  init(room: RoomModel) {
    this.spawn = room.door
    this.heightmap = room.heightmap
    this.container.sortableChildren = true
    this.renderWalls()
    this.renderFloor()
    this.container.sortChildren()
  }
}
