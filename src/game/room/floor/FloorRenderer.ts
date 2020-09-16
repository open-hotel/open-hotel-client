import { IsoPoint, IsoPointObject } from "../../../engine/lib/IsoPoint"
import { createFloorTestFunction } from "../../../engine/lib/util/FloorUtils"
import { Matrix } from "../../../engine/lib/util/Matrix"
import { StairDirection } from "../../imager/room.imager"
import { PRIORITY } from "../room.constants"
import { RoomEngine } from "../Room.engine"
import { Floor } from "./Floor"
import ladders from "./ladders"

const {
  TOP_LEFT,
  TOP,
  TOP_RIGHT,
  LEFT,
  CENTER,
  RIGHT,
  BOTTOM_LEFT,
  BOTTOM,
  BOTTOM_RIGHT
} = Matrix.NEIGHBORS

const neighborsItems = [TOP_LEFT, TOP, TOP_RIGHT, LEFT, CENTER, RIGHT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT]
const NEIGHBOR_BOUNDS = 3

export class FloorRenderer {
  public tiles: Matrix<Floor | null>

  constructor (private roomEngine: RoomEngine) {}

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
    this.tiles = this.roomEngine.heightmap.map((z, x, y) => {
      if (z <= 0) return null

      const neighbors = Matrix.from(
        this.roomEngine.heightmap.neighborsOf(x, y, neighborsItems),
        NEIGHBOR_BOUNDS,
        NEIGHBOR_BOUNDS
      )
      const { stairType, offset } = this.getStairType(neighbors)

      const isStair = stairType === undefined
      const texture = isStair
        ? this.roomEngine.roomImager.generateFloorTileTexture()
        : this.roomEngine.roomImager.generateStairTexture(stairType)
      const zPos = isStair ? (z - 1) * 32 + 8 : z * 32
      const position = new IsoPoint(x * 32, y * 32, zPos)

      position.add(offset)

      const tile = new Floor(texture, position)
      const { wallRenderer }= this.roomEngine
      const isDoor = x === wallRenderer.door?.x && y === wallRenderer.door?.y
      const inBound = wallRenderer.walls.get(x + 1, y) || wallRenderer.walls.get(x, y + 1)
      const priority = isDoor && inBound ? PRIORITY.FLOOR_DOOR : PRIORITY.FLOOR

      if (wallRenderer.spawn?.x === x && wallRenderer.spawn?.y === y) tile.tint = 0xff0000

      tile.zIndex = (isDoor ? wallRenderer.walls.get(x + 1, y)?.zIndex : null) ?? this.roomEngine.calcZIndex(position, priority)

      this.roomEngine.container.addChild(tile)

      tile.addListener('pointertap', () => {
        this.roomEngine.currentUser.moveTo(position)
      })
      return tile
    })
  }
}
