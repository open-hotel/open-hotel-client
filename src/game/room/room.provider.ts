import { Provider, Inject, CURRENT_MODULE, ModuleRef } from 'injets'
import { Viewport, BounceOptions } from 'pixi-viewport'
import { ApplicationProvider } from '../pixi/application.provider'
import { GameModule } from '../game.module'
import { RoomEngine } from './Room.engine'
import { RoomModel } from './types/room.model'

@Provider()
export class RoomProvider {
  constructor(
    @Inject(CURRENT_MODULE)
    private readonly gameModule: ModuleRef<GameModule>,
    private readonly appProvider: ApplicationProvider,
  ) {}

  async create(options: RoomModel) {
    const room = await this.gameModule.get<RoomEngine>(RoomEngine)

    room.init(options)

    this.appProvider.camera.addChild(room.container)
    this.appProvider.culling.addList(room.container.children)
  }

  dispose() {}
}
