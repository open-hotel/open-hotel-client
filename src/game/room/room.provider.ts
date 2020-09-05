import { Provider, Inject, CURRENT_MODULE, ModuleRef } from 'injets'
import { Viewport, BounceOptions } from 'pixi-viewport'
import { ApplicationProvider } from '../pixi/application.provider'
import { GameModule } from '../game.module'
import { RoomEngine } from './Room.engine'
import { RoomModel } from './types/room.model'
import { Container } from 'pixi.js-legacy'

@Provider()
export class RoomProvider {
  constructor(
    @Inject(CURRENT_MODULE)
    private readonly gameModule: ModuleRef<GameModule>,
    private readonly appProvider: ApplicationProvider,
  ) {}

  private currentRoomContainer: Container

  private removeCurrentRoom () {
    if (!this.currentRoomContainer) {
      return
    }
    this.appProvider.camera.removeChild(this.currentRoomContainer)
  }

  async create (roomModel: RoomModel) {
    this.removeCurrentRoom()
    const roomEngine = await this.gameModule.get<RoomEngine>(RoomEngine)
    await roomEngine.init(roomModel)
    this.currentRoomContainer = roomEngine.container

    this.appProvider.camera.addChild(roomEngine.container)
    this.appProvider.culling.addList(roomEngine.container.children)
  }

  dispose() {}
}
