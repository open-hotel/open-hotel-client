import { Provider, Inject, CURRENT_MODULE, ModuleRef } from 'injets'
import { Viewport } from 'pixi-viewport'
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
    const camera = new Viewport().drag({ wheelScroll: 0 }).wheel({
      reverse: false,
      smooth: 10,
    })

    this.appProvider.app.stage.addChild(camera)

    room.init(options)

    camera.addChild(room.container)
  }

  dispose() {}
}
