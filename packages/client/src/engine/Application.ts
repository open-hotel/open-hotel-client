import * as PIXI from 'pixi.js'
import { Navigation } from './lib/navigation/Navigation'
import { Logger, Log } from './lib/Logger'
import Tween from '@tweenjs/tween.js'
import { Viewport } from 'pixi-viewport'
import { Socket } from '@open-hotel/core'

interface ApplicationOptions {
  autoStart?: boolean
  width?: number
  height?: number
  view?: HTMLCanvasElement
  transparent?: boolean
  autoDensity?: boolean
  antialias?: boolean
  preserveDrawingBuffer?: boolean
  resolution?: number
  forceCanvas?: boolean
  backgroundColor?: number
  clearBeforeRender?: boolean
  forceFXAA?: boolean
  powerPreference?: string
  sharedTicker?: boolean
  sharedLoader?: boolean
  resizeTo?: Window | HTMLElement
  logLevel?: Log | number
  logContext?: string[]
  websocketServer?: string
}

export class Application extends PIXI.Application {
  public readonly $logger = new Logger('Application')
  public $router: Navigation
  public $camera: Viewport
  public $ws: Socket
  static $instance: Application

  constructor(options: ApplicationOptions = {}) {
    super(options)

    options = Object.assign(
      {
        logLevel: Log.ERROR,
        logContext: null,
        websocketServer: 'ws://localhost:65432/orion',
      },
      options,
    )

    this.$logger.context = options.logContext
    this.$logger.level = options.logLevel

    this.$router = new Navigation(this)

    window.addEventListener('resize', this.onResize.bind(this))

    this.onResize()

    this.renderer.autoDensity = true

    this.ticker.add(() => Tween.update(this.ticker.lastTime))
    this.initWebSocket(options)
  }

  private initWebSocket(options) {
    this.$ws = new Socket(options.websocketServer)

    const wsLogger = this.$logger.create('WebSocket')

    this.$ws.on('ws:connect', () => wsLogger.info('Connected!'))
    this.$ws.on('ws:disconnect', () => wsLogger.error('Disconnected!'))
    this.$ws.on('ws:error', e => wsLogger.error('ws:error', e))
    this.$ws.on('ws:input', packet =>
      wsLogger.info(
        `[${packet.event}] <= #${packet.uuid} (${packet.toBuffer().byteLength} B) => `,
        JSON.stringify(packet.payload),
      ),
    )
    this.$ws.on('ws:output', packet =>
      wsLogger.info(
        `[${packet.event}] => #${packet.uuid} (${packet.toBuffer().byteLength} B) => `,
        JSON.stringify(packet.payload),
      ),
    )

    this.$ws.connect()
  }

  static get(options?: ApplicationOptions) {
    if (!this.$instance) this.$instance = new Application(options)
    return this.$instance
  }

  /**
   * load a resource or get from loader cache
   * @param name Resource name
   */
  getResource(name: string)
  /**
   * load resources or get from loader cache
   * @param names Resource names
   */
  getResource(names: string[])
  /**
   * load resources or get from loader cache
   * @param items Resource names aliases
   */
  getResource(items: { [key: string]: string })
  getResource(idOrArrayOrObject: string | string[] | { [key: string]: string }) {
    const loader = new PIXI.Loader('/', 20)
    return new Promise((resolve, reject) => {
      // String
      if (typeof idOrArrayOrObject === 'string') {
        return loader.add(idOrArrayOrObject).load((_, r) => resolve(r[idOrArrayOrObject]))
      }

      // Array
      if (Array.isArray(idOrArrayOrObject)) {
        return loader.add(idOrArrayOrObject).load((_, r) => resolve(idOrArrayOrObject.map(name => r[name])))
      }

      // Objects
      return loader.add(idOrArrayOrObject).load((_, r) => {
        const result = {}

        for (let k in idOrArrayOrObject) {
          result[k] = r[k]
        }

        resolve(result)
      })
    })
  }

  getTexture(id: any) {
    const resource = this.loader.resources[id]
    return resource && resource.texture
  }

  getSpriteSheet(id: any) {
    const resource = this.loader.resources[id]
    return resource && resource.spritesheet
  }

  onResize() {
    // resize renderer
    this.renderer.resize(window.innerWidth, window.innerHeight)
    this.view.width = window.innerWidth
    this.view.height = window.innerHeight
    this.$logger.info(`As dimensões da tela mudaram para ${this.view.width}x${this.view.height}`)
  }
}
