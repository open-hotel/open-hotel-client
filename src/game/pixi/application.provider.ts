import { Provider } from 'injets'
import { Application, ApplicationOptions } from '../../engine/Application'
import { Viewport } from 'pixi-viewport'
import * as Culling from 'pixi-cull'

@Provider()
export class ApplicationProvider {
  public app: Application
  public camera: Viewport
  public culling = new Culling.Simple()

  createApp(options: ApplicationOptions) {
    this.app = new Application(options)

    // Camera
    this.camera = new Viewport({ divWheel: this.app.view, disableOnContextMenu: true })
      .drag({ wheelScroll: 0 })
      .wheel({ reverse: false, smooth: 10 })
      .clampZoom({ maxScale: 2, minScale: 0.5 })
      .pinch()
    //   .bounce({
    //     // @ts-ignore
    //     bounceBox: {
    //       x: bounds.left - bounds.width / 1.5,
    //       y: bounds.top - bounds.height / 4.5,
    //       width: bounds.width * 1.5,
    //       height: bounds.height / 1.5,
    //     },
    //   })

    // Camera Resize
    window.addEventListener('resize', () => {
      this.app.resize()
      if (this.camera && this.camera.visible) {
        this.camera.resize(window.innerWidth, window.innerHeight)
      }
    })

    // Cull whenever the viewport moves
    this.app.ticker.add(() => {
      if (this.camera.dirty) {
        this.culling.cull(this.cullingBox)
        this.camera.dirty = false
      }
    })

    // Add camera do stage
    this.app.stage.addChild(this.camera)
  }

  private get cullingBox() {
    const cameraRect = this.camera.getVisibleBounds()
    const BOUND_MARGIN = 0

    // Adiciona uma margem para o culling
    cameraRect.x -= BOUND_MARGIN
    cameraRect.y -= BOUND_MARGIN
    cameraRect.width += BOUND_MARGIN * 2
    cameraRect.height += BOUND_MARGIN * 2
    return cameraRect
  }
}
