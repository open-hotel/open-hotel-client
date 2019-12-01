import * as PIXI from 'pixi.js'
import { Navigation } from './navigation/Navigation'
import { Logger, Log } from './lib/Logger'
import Tween from '@tweenjs/tween.js'
import { Viewport } from 'pixi-viewport'
import { Game } from '../game/Game'
import { Scene } from './lib/Scene'

interface ApplicationOptions {
  game?: Game,
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
  public game: Game
  public readonly $logger = new Logger('Application')
  public $router: Navigation
  public $camera: Viewport
  static $instance: Application
  public worker: Worker
  public scene: Scene

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

    this.game = options.game

    this.$logger.context = options.logContext
    this.$logger.level = options.logLevel

    this.$router = new Navigation(this)

    window.addEventListener('resize', this.onResize.bind(this))
    this.tickerFallback()

    this.onResize()

    this.renderer.autoDensity = true

    this.ticker.add(() => Tween.update(this.ticker.lastTime))
  }

  tickerFallback() {
    this.worker = new Worker('./worker.js')
    this.worker.addEventListener('message', e => {
      if (e.data === 'ticker') {
        this.ticker.update()
      }
    })

    const updateTicker = () => {
      if (document.hidden) {
        this.worker.postMessage('startTicker')
      } else {
        this.worker.postMessage('stopTicker')
      }
    }

    updateTicker()
    document.addEventListener('visibilitychange', updateTicker)
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
