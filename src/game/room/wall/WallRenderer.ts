import { IsoPoint } from "../../../engine/lib/IsoPoint"
import { Matrix } from "../../../engine/lib/util/Matrix"
import { PRIORITY } from "../room.constants"
import { RoomEngine } from "../Room.engine"
import { Wall } from "./Wall"

const WALL_HEIGHT = 92
const WALL_SIZE = 32
const WALL_THICKNESS = 8

export type PointLike = {
  x: number,
  y: number
}

export class WallRenderer {
  constructor (private roomEngine: RoomEngine) {}

  public walls: Matrix<Wall | null>
  public door: PointLike
  public spawn: PointLike
  private maxHeight: number

  get heightmap () {
    return this.roomEngine.heightmap
  }

  renderWalls() {
    this.walls = new Matrix(this.heightmap.width, this.heightmap.height)

    this.setupDoor()
    this.maxHeight = this.heightmap.reduce((max, z) => Math.max(max, z * 32), -Infinity)
    this.renderHorizontalWalls()
    this.renderVerticalWalls()
  }

  private setupDoor () {
    this.door = this.getExistentDoor() || this.lookForArbitraryDoor()
    if (!this.spawn) this.spawn = this.door
  }

  private getExistentDoor () {
    if (!this.spawn) {
      return
    }
    const spawnBlock = this.heightmap.get(this.spawn.x, this.spawn.y)

    // Descartar a localização do spawn se não houver bloco no local
    if (!spawnBlock) {
      this.spawn = null
      return
    }
    // Verifica se é um local válido para a renderização de uma porta
    let spawnIsDoor: boolean = false

    // Vertical wall
    spawnIsDoor =
      spawnIsDoor ||
      this.heightmap
        .neighborsOf(this.spawn.x, this.spawn.y, [
          Matrix.NEIGHBORS.TOP,
          Matrix.NEIGHBORS.LEFT,
          Matrix.NEIGHBORS.BOTTOM,
        ])
        .every(b => !b)

    // Horizontal Wall
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
      return this.spawn
    }
  }

  private lookForArbitraryDoor () {
    const maxDoorX = this.heightmap.width
    let door: PointLike

    // Procurando porta apenas na parede vertical
    for (let y = 0; y < this.heightmap.height; y++) {
      for (let x = 0; x <= maxDoorX; x++) {
        const z = this.heightmap.get(x, y)

        // Don't test with falsy valued blocks
        if (!z) continue

        if (this.isValidDoorBlock(x, y)) {
          door = { x, y }
          return door
        }
        break
      }
    }
    return door
  }

  private isValidDoorBlock (x: number, y: number) {
    return this.heightmap
      .neighborsOf(x, y, [Matrix.NEIGHBORS.TOP, Matrix.NEIGHBORS.BOTTOM, Matrix.NEIGHBORS.LEFT])
      .every(b => !b)
  }

  private renderHorizontalWalls () {
    let maxWallY = this.heightmap.height

    // Paredes Horizontais
    for (let x = 0; x < this.heightmap.width; x++) {
      // Percorre as colunas até o primeiro bloco vertical
      for (let y = 0; y <= maxWallY; y++) {
        if (x === this.door?.x && y === this.door?.y) continue
        const z = this.heightmap.get(x, y)
        // Se for 0, não inserir paredes
        if (!z) continue

        let wallLength = 1

        // Se o bloco atual deve renderizar uma porta
        const isDoor = x === this.door?.x && y - 1 === this.door?.y

        // Se o bloco atual não for uma porta, calcula o tamanho da parede
        if (!isDoor) {
          wallLength = this.calcHorizontalConnectedWallsLength(x, y)
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

        const height = this.maxHeight + WALL_HEIGHT - minZElevation
        const width = WALL_SIZE * wallLength

        // Elevação relativa a elevação do bloco com o menor z
        const relativeElevation = elevation - minZElevation

        // Renderiza
        const texture = this.roomEngine.roomImager.generateWallTexture(
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

        wall.zIndex = this.roomEngine.calcZIndex(
          {
            x,
            y,
            z,
          },
          PRIORITY.WALL_H,
        )

        this.walls.set(x, y, wall)

        this.roomEngine.container.addChild(wall)

        // Pula para o x apos a ultima parede inserida
        x += wallLength - 1
      }
    }
  }

  private calcHorizontalConnectedWallsLength (x: number, y: number) {
    let wallLength = 1
    for (let neighborX = x + 1; neighborX < this.heightmap.width; neighborX++) {

      const neighborZ = this.heightmap.get(neighborX, y)
      const isBlockEmpty = !neighborZ
      if (isBlockEmpty) break

      // Stops verifying for connected walls if there's a block behind
      const blockBehind = this.heightmap.get(neighborX, y - 1)
      if (blockBehind) break

      wallLength++
    }

    return wallLength
  }

  private renderVerticalWalls () {
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

        const height = this.maxHeight + WALL_HEIGHT - minZElevation
        const width = wallLength * WALL_SIZE
        const isConner = !!this.walls.get(x, y)

        // Elevação relativa a elevação do bloco com o menor z
        const relativeElevation = elevation - minZElevation

        // Renderiza
        const texture = this.roomEngine.roomImager.generateWallTexture(
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

        wall.zIndex = this.roomEngine.calcZIndex(
          {
            x,
            y,
            z,
          },
          PRIORITY.WALL_V,
        )

        this.walls.set(x, y, wall)

        this.roomEngine.container.addChild(wall)

        // Pula para o y depois da parede gerada
        y += wallLength - 1
      }
    }
  }
}
