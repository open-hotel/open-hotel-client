import { Container } from 'pixi.js'
import { Provider } from 'injets'
import { Matrix } from '../../engine/lib/util/Matrix'
import { RoomImager } from '../imager/room.imager'
import { IsoPointObject } from '../../engine/lib/IsoPoint'
import { RoomModel } from './types/room.model'
import { AvatarImager } from '../imager/avatar/human-imager'
import { RoomUser } from './users/RoomUser'
import { PRIORITY } from './room.constants'
import { FloorRenderer } from './floor/FloorRenderer'
import { WallRenderer } from './wall/WallRenderer'
import { IUserModel } from '../users/types'
import { ApplicationProvider } from '../pixi/application.provider'

@Provider()
export class RoomEngine {
  public readonly container = new Container()
  public heightmap: Matrix<number>
  public floorRenderer: FloorRenderer
  public wallRenderer: WallRenderer
  private users = new Map<string, RoomUser>()

  constructor(
    public readonly appProvider: ApplicationProvider,
    public readonly roomImager: RoomImager,
    public readonly avatarImager: AvatarImager
  ) {
    this.appProvider.app.ticker.add((delta) => this.tick(delta))
  }

  // TODO: GET CURRENT USER
  get currentUser () {
    return this.users.get('abc')
  }

  calcZIndex({ x, y, z }: IsoPointObject, priority = 1) {
    return (x + y + z) * priority
  }

  destroy () {
    this.container.removeChild()
    this.users.clear()
  }

  /**
   * TODO: Render Furni
   */
  putFurni() { }

  putUsers(userOptionsDictionary: Record<string, IUserModel>) {
    this.users.clear()

    return Object.entries(userOptionsDictionary)
      .map(([userId, userModel]) => {
        const roomUser = new RoomUser(userModel, this)
        this.users.set(userId, roomUser)
        return this.addUserSprite(roomUser)
      })
  }

  updateUsersZIndex() {
    this.users.forEach(roomUser => {
      if (!roomUser.container) return;
      roomUser.container.zIndex = this.calcZIndex(roomUser.iso, PRIORITY.USER)
    })
  }

  tick(delta: number) {
    this.updateUsersZIndex()
  }

  private async addUserSprite(roomUser: RoomUser) {
    await roomUser.initSprite()

    this.container.addChild(roomUser.container)
  }

  private renderWalls(roomModel: RoomModel) {
    this.wallRenderer = new WallRenderer(this)
    this.wallRenderer.spawn = roomModel.door
    this.wallRenderer.renderWalls()
  }

  private renderFloor() {
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
