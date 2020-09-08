import { Container } from 'pixi.js'
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
import { HumanImager } from '../imager/human.imager'
import { RoomUser, RoomUserOptions } from './users/RoomUser'

const PRIORITY = {
  FLOOR_DOOR: 1,
  WALL_V: 1,
  WALL_H: 2,
  FLOOR: 3,
  USER: 4,
}

@Provider('TRANSIENT')
export class RoomEngine {
  public readonly container = new Container()
  private heightmap: Matrix<number>
  private tiles: Matrix<Floor | null>
  private walls: Matrix<Wall | null>
  private door: PointLike
  private spawn: PointLike

  constructor(
    private readonly app: ApplicationProvider,
    private readonly roomImager: RoomImager,
    private readonly humanImager: HumanImager,
  ) {}

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
      const isDoor = x === this.door?.x && y === this.door?.y
      const inBound = this.walls.get(x + 1, y) || this.walls.get(x, y + 1)
      const priority = isDoor && inBound ? PRIORITY.FLOOR_DOOR : PRIORITY.FLOOR

      if (this.spawn?.x === x && this.spawn?.y === y) tile.tint = 0xff0000

      tile.zIndex = (isDoor ? this.walls.get(x + 1, y)?.zIndex : null) ?? this.calcZIndex(position, priority)

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
    const WALL_SIZE = 32
    const WALL_THICKNESS = 8

    this.walls = new Matrix(this.heightmap.width, this.heightmap.height)

    // Verifica se há um local de porta definido, e se este local
    // é uma porta válida para ser renderizada
    if (this.spawn) {
      const spawnBlock = this.heightmap.get(this.spawn.x, this.spawn.y)

      // Descartar a localização do spawn se não houver bloco no local
      if (!spawnBlock) this.spawn = null
      else {
        // Verifica se é um local válido para a renderização de uma porta
        let spawnIsDoor: boolean = false

        // Parede vertical
        spawnIsDoor =
          spawnIsDoor ||
          this.heightmap
            .neighborsOf(this.spawn.x, this.spawn.y, [
              Matrix.NEIGHBORS.TOP,
              Matrix.NEIGHBORS.LEFT,
              Matrix.NEIGHBORS.BOTTOM,
            ])
            .every(b => !b)

        // Parede horizontal
        spawnIsDoor =
          spawnIsDoor ||
          this.heightmap
            .neighborsOf(this.spawn.x, this.spawn.y, [
              Matrix.NEIGHBORS.LEFT,
              Matrix.NEIGHBORS.TOP,
              Matrix.NEIGHBORS.RIGHT,
            ])
            .every(b => !b)

        if (spawnIsDoor) {
          this.door = this.spawn
        }
      }
    }

    // Procura um local válido para a porta caso não tenha sido definida
    if (!this.door) {
      // X máximo onde a porta poderá ser encontrada
      let maxDoorX = this.heightmap.width

      // Procurando porta apenas na parede vertical
      loopDoor: for (let y = 0; y < this.heightmap.height; y++) {
        for (let x = 0; x <= maxDoorX; x++) {
          const z = this.heightmap.get(x, y)

          // Não testar blocos com 0
          if (!z) continue

          // Define a posição X máxima para o bloco atual
          maxDoorX = x

          // Verificação de um bloco válido para renderização da porta
          const validDoorBlock = this.heightmap
            .neighborsOf(x, y, [Matrix.NEIGHBORS.TOP, Matrix.NEIGHBORS.BOTTOM, Matrix.NEIGHBORS.LEFT])
            .every(b => !b)

          if (validDoorBlock) {
            this.door = { x, y }

            // Se não houver um spawn definido ele será o local da porta encontrada
            if (!this.spawn) this.spawn = this.door
            break loopDoor
          }
          break
        }
      }
    }

    // Y máximo onde pode haver paredes
    let maxWallY = this.heightmap.height

    // Paredes Horizontais
    for (let x = 0; x < this.heightmap.width; x++) {
      // Percorre as colunas até o primeiro bloco vertical
      for (let y = 0; y <= maxWallY; y++) {
        if (x === this.door?.x && y === this.door?.y) continue
        const z = this.heightmap.get(x, y)
        // Se for 0, não inserir paredes
        if (!z) continue

        // Comprimento da parede
        let wallLength = 1

        // Se o bloco atual deve renderizar uma porta
        const isDoor = x === this.door?.x && y - 1 === this.door?.y

        // Se o bloco atual não for uma porta, calcula o tamanho da parede
        if (!isDoor) {
          let neighY = y
          let neighX = x + 1
          do {
            // Para a verificação de paredes conexas ao encontrar um bloco nulo
            let neighZ = this.heightmap.get(neighX, neighY)
            if (!neighZ) break

            // Para a verificação de paredes conexas ao encontrar uma possível parede atras
            const backBlock = { x: neighX, y: neighY - 1 }
            if (this.heightmap.get(backBlock.x, backBlock.y)) break

            wallLength++
            neighX++
          } while (neighX < this.heightmap.width)
        }

        // Não enfileirar paredes horizontais verticalmente
        maxWallY = y

        const elevation = (z - 1) * 32

        // Encontra os vizinhos de cima e de baixo sucessivamente para encontrar
        // o menor Z ligado ao bloco atual
        let minNeighborZ = z
        Array.from([Matrix.NEIGHBORS.LEFT, Matrix.NEIGHBORS.RIGHT])
          .map(r => {
            const nx = r.x + x
            const ny = r.y + y
            return {
              x: nx,
              y: ny,
              z: this.heightmap.get(nx, ny),
              next: r,
            }
          })
          .forEach(neigh => {
            while (neigh?.z) {
              minNeighborZ = Math.min(neigh.z, minNeighborZ)

              // Se houver um bloco para tras para a verificação
              // Se houver um bloco para tras para a verificação
              const backBlock = { x: neigh.x, y: neigh.y - 1 }
              if (
                this.heightmap.get(backBlock.x, backBlock.y) &&
                !(backBlock.x == this.door?.x && backBlock.y == this.door?.y)
              )
                break

              const nextNeighX = neigh.x + neigh.next.x
              const nextNeighY = neigh.y + neigh.next.y
              neigh = {
                ...neigh,
                x: nextNeighX,
                y: nextNeighY,
                z: this.heightmap.get(nextNeighX, nextNeighY),
              }
            }
          })

        // Calcula a menor elevação ligada ao bloco atual
        const minZElevation = (minNeighborZ - 1) * WALL_SIZE

        const height = MAX_HEIGHT + WALL_HEIGHT - minZElevation
        const width = WALL_SIZE * wallLength

        // Elevação relativa a elevação do bloco com o menor z
        const relativeElevation = elevation - minZElevation

        // Renderiza
        const texture = this.roomImager.generateWallTexture(
          1,
          width,
          height,
          isDoor,
          WALL_THICKNESS,
          isDoor,
          relativeElevation,
        )

        // Calcula a posição de renderização da parede
        const posX = (x + 1) * WALL_SIZE
        const posY = y * WALL_SIZE
        const posZ = height + 20 + minZElevation // + (wallLength - 1) * (WALL_SIZE / 2)
        const position = new IsoPoint(posX, posY, posZ)

        const wall = new Wall(texture, position)

        wall.zIndex = this.calcZIndex(
          {
            x,
            y,
            z,
          },
          PRIORITY.WALL_H,
        )

        this.walls.set(x, y, wall)

        this.container.addChild(wall)

        // Pula para o x apos a ultima parede inserida
        x += wallLength - 1
      }
    }

    // X máximo onde pode haver paredes
    let maxWallX = this.heightmap.width

    // Paredes Verticais
    for (let y = 0; y < this.heightmap.height; y++) {
      for (let x = 0; x <= maxWallX; x++) {
        // Se for o bloco da porta ignora
        if (x === this.door?.x && y === this.door?.y) continue

        // Não testa blocos com 0
        const z = this.heightmap.get(x, y)
        if (!z) continue

        // Verifica so o bloco atual deve renderizar uma porta
        const isDoor = x - 1 === this.door?.x && y === this.door?.y

        // Comprimento da parede
        let wallLength = 1

        // Se o bloco atual não for uma porta, calcula o tamanho da parede
        if (!isDoor) {
          let neighY = y + 1
          let neighX = x
          do {
            // Para a verificação de paredes conexas ao encontrar um bloco nulo
            let neighZ = this.heightmap.get(neighX, neighY)
            if (!neighZ) break

            // Para a verificação de paredes conexas ao encontrar uma possível parede atras
            const backBlock = { x: neighX - 1, y: neighY }
            if (this.heightmap.get(backBlock.x, backBlock.y)) break

            wallLength++
            neighY++
          } while (neighY < this.heightmap.height)
        }

        const elevation = (z - 1) * WALL_SIZE

        // Define a posição X máxima para o bloco atual
        maxWallX = x

        // Encontra os vizinhos de cima e de baixo sucessivamente para encontrar
        // o menor Z ligado ao bloco atual
        let minNeighborZ = z
        Array.from([Matrix.NEIGHBORS.TOP, Matrix.NEIGHBORS.BOTTOM])
          .map(r => {
            const nx = r.x + x
            const ny = r.y + y
            return {
              x: nx,
              y: ny,
              z: this.heightmap.get(nx, ny),
              next: r,
            }
          })
          .forEach(neigh => {
            while (neigh?.z) {
              minNeighborZ = Math.min(neigh.z, minNeighborZ)

              // Se houver um bloco para tras para a verificação
              const backBlock = { x: neigh.x - 1, y: neigh.y }
              if (
                this.heightmap.get(backBlock.x, backBlock.y) &&
                !(backBlock.x == this.door?.x && backBlock.y == this.door?.y)
              )
                break

              const nextNeighX = neigh.x + neigh.next.x
              const nextNeighY = neigh.y + neigh.next.y
              neigh = {
                ...neigh,
                x: nextNeighX,
                y: nextNeighY,
                z: this.heightmap.get(nextNeighX, nextNeighY),
              }
            }
          })

        // Calcula a menor elevação ligada ao bloco atual
        const minZElevation = (minNeighborZ - 1) * WALL_SIZE

        const height = MAX_HEIGHT + WALL_HEIGHT - minZElevation
        const width = wallLength * WALL_SIZE
        const isConner = !!this.walls.get(x, y)

        // Elevação relativa a elevação do bloco com o menor z
        const relativeElevation = elevation - minZElevation

        // Renderiza
        const texture = this.roomImager.generateWallTexture(
          0,
          width,
          height,
          isDoor,
          WALL_THICKNESS,
          isConner,
          relativeElevation,
        )

        // Calcula a posição de renderização da parede
        const posX = x * WALL_SIZE - WALL_THICKNESS
        const posY = (y + wallLength - 1) * WALL_SIZE
        const posZ = height + minZElevation + (wallLength - 1) * (WALL_SIZE / 2)
        const position = new IsoPoint(posX, posY, posZ)

        const wall = new Wall(texture, position)

        if (isConner)
          position
            .add(0, 0, 4)
            .toPoint()
            .copyTo(wall.position)

        wall.zIndex = this.calcZIndex(
          {
            x,
            y,
            z,
          },
          PRIORITY.WALL_V,
        )

        this.walls.set(x, y, wall)

        this.container.addChild(wall)

        // Pula para o y depois da parede gerada
        y += wallLength - 1
      }
    }
  }

  /**
   * TODO: Render Furni
   */
  putFurni() {}

  private roomUserIdToRoomUser: Record<string, RoomUser>
  putUsers (userOptionsDictionary: Record<string, RoomUserOptions>) {
    this.roomUserIdToRoomUser = {}

    return Object.entries(userOptionsDictionary)
      .map(([userId, roomUserOptions]) => {
        const roomUser = new RoomUser(roomUserOptions, this.humanImager)
        this.roomUserIdToRoomUser[userId] = roomUser
        return this.addUserSprite(roomUser)
      })
  }

  private async addUserSprite (roomUser: RoomUser) {
    const sprite = await roomUser.initSprite()
    this.container.addChild(sprite)
  }

  async init(roomModel: RoomModel) {
    this.spawn = roomModel.door
    this.heightmap = roomModel.heightmap
    this.container.sortableChildren = true
    this.renderWalls()
    this.renderFloor()
    await Promise.all(this.putUsers(roomModel.roomUserDictionary))
    this.putFurni()
    this.container.sortChildren()
  }
}
