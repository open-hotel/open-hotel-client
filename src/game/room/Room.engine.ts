import { Container } from 'pixi.js'
import { Provider } from 'injets'
import { ApplicationProvider } from '../pixi/application.provider'
import { Matrix } from '../../engine/lib/util/Matrix'
import { Floor } from './floor/Floor'
import { RoomImager } from '../imager/room.imager'
import { IsoPoint, IsoPointObject } from '../../engine/lib/IsoPoint'
import { RoomModel } from './types/room.model'
import { Wall } from './wall/Wall'
import { PointLike } from '../../engine/lib/util/Walk'
import { HumanImager } from '../imager/human.imager'
import { RoomUser, RoomUserOptions } from './users/RoomUser'
import { PRIORITY } from './room.constants'
import { FloorRenderer } from './floor/FloorRenderer'
import { WallRenderer } from './wall/WallRenderer'

@Provider('TRANSIENT')
export class RoomEngine {
  public readonly container = new Container()
  public heightmap: Matrix<number>
  public floorRenderer: FloorRenderer
  public wallRenderer: WallRenderer

  constructor(
    private readonly app: ApplicationProvider,
    public readonly roomImager: RoomImager,
    private readonly humanImager: HumanImager,
  ) {}

  calcZIndex({ x, y, z }: IsoPointObject, priority = 1) {
    return (x + y + z) * priority
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
    if (this.wallRenderer.door) {
      const spawnBlock = this.floorRenderer.tiles.get(this.wallRenderer.door.x, this.wallRenderer.door.y)
      sprite.x = spawnBlock.x
      sprite.y = spawnBlock.y
    }

    sprite.zIndex = this.calcZIndex({
      x: sprite.x,
      y: sprite.y,
      z: 80
    }, PRIORITY.USER)
  }

  private renderWalls (roomModel: RoomModel) {
    this.wallRenderer = new WallRenderer(this)
    this.wallRenderer.spawn = roomModel.door
    this.wallRenderer.renderWalls()
  }

  private renderFloor () {
    this.floorRenderer = new FloorRenderer(this)
    this.floorRenderer.renderFloor()
  }

  async init(roomModel: RoomModel) {
    this.heightmap = roomModel.heightmap
    this.container.sortableChildren = true
    this.renderWalls(roomModel)
    this.renderFloor()
    await Promise.all(this.putUsers(roomModel.roomUserDictionary))
    this.putFurni()
    this.container.sortChildren()
  }
}
