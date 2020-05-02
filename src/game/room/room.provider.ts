import { Provider, Inject, CURRENT_MODULE, ModuleRef } from 'injets'
import { Viewport, BounceOptions } from 'pixi-viewport'
import { ApplicationProvider } from '../pixi/application.provider'
import { GameModule } from '../game.module'
import { RoomEngine } from './Room.engine'
import { RoomModel } from './types/room.model'
import Culling from 'pixi-cull'
import * as PIXI from 'pixi.js'

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

    const bounds = room.container.getBounds()

    const camera = new Viewport({
      worldWidth: bounds.width,
      worldHeight: bounds.height,
      interaction: this.appProvider.app.renderer.plugins.interaction,
    })
      .drag({ wheelScroll: 0 })
      .wheel({
        reverse: false,
        smooth: 10,
      })
      .pinch()
      .clampZoom({
        maxScale: 2,
        minScale: 0.5,
      })
      .bounce({
        // @ts-ignore
        bounceBox: {
          x: bounds.left - bounds.width / 1.5,
          y: bounds.top - bounds.height / 4.5,
          width: bounds.width * 1.5,
          height: bounds.height / 1.5,
        },
      })

    this.appProvider.app.stage.addChild(camera)

    camera.addChild(room.container)

    this.setupCulling(camera, room)
  }

  setupCulling(camera: Viewport, room: RoomEngine) {
    var cull = new Culling.Simple()
    cull.addList(room.container.children)

    cull.cull(this.getCullingBoundingBox(camera))

    // cull whenever the viewport moves
    this.appProvider.app.ticker.add(() => {
      if (camera.dirty) {
        cull.cull(this.getCullingBoundingBox(camera))
        camera.dirty = false
      }
    })
  }

  private getCullingBoundingBox(camera: Viewport) {
    const cameraRect = camera.getVisibleBounds()
    const BOUND_MARGIN = 64

    // Adiciona uma margem para o culling
    cameraRect.x -= BOUND_MARGIN
    cameraRect.y -= BOUND_MARGIN
    cameraRect.width += BOUND_MARGIN * 2
    cameraRect.height += BOUND_MARGIN * 2
    return cameraRect
  }

  dispose() {}
}
