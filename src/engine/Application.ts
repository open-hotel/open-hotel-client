import * as PIXI from 'pixi.js'
import { Navigation } from './navigation/Navigation'
import { Logger, Log } from './lib/Logger'
import Tween from '@tweenjs/tween.js'
import { Viewport } from 'pixi-viewport'
import { Game } from '../game/Game'
import { Scene } from './lib/Scene'
import { stat } from 'fs'
const GStats = require('gstats')

interface ApplicationOptions {
  game?: Game
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
  debug?: boolean
}

PIXI.settings.TARGET_FPMS = 24 / 1000

export class Application extends PIXI.Application {
  public game: Game
  public readonly $logger = new Logger('Application')
  public $router: Navigation
  public $camera: Viewport
  static $instance: Application
  public worker: Worker
  public scene: Scene

  constructor(options: ApplicationOptions = {}) {
    super({
      ...options,
      backgroundColor: 0xFF0000
    })

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

    if (options.debug) {
      // const pixiHooks = new GStats.PIXIHooks(this);
      // const stats = new GStats.StatsJSAdapter(pixiHooks);
      // const el = stats.stats.dom || stats.stats.domElement
      // el.style.position = 'fixed';
      // el.style.top = 0;
      // el.style.right = 0;
      // document.body.appendChild(el);
      // this.ticker.add(() => stats.update())
    }
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

  async getLibs(libs: string[]) {
    if (!libs.length) return []
    return this.getResource(
      libs.reduce((items, l) => {
        items[l] = `${l}/${l}.json`
        return items
      }, {}),
    )
  }

  queueLoader(...args) {
    return new Promise((resolve, reject) => {
      if (this.loader.loading) {
        this.loader.once('error', resolve)
        this.loader.once('complete', () => {
          resolve(this.loader.add(...args))
        })
      } else {
        resolve(this.loader.add(...args))
      }
    })
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
    const loader = this.loader

    return new Promise((resolve, reject) => {
      // String
      if (typeof idOrArrayOrObject === 'string') {
        if (loader.resources[idOrArrayOrObject]) {
          return resolve(loader.resources[idOrArrayOrObject])
        }
        this.queueLoader(idOrArrayOrObject, idOrArrayOrObject, {}, res => {
          if (res.name === idOrArrayOrObject) resolve(res[idOrArrayOrObject])
        })
      }

      // Array
      else if (Array.isArray(idOrArrayOrObject)) {
        let count = idOrArrayOrObject.length
        const resources = idOrArrayOrObject.filter(k => !loader.resources[k])
        resources.forEach(res => {
          this.queueLoader(res, {}, r => {
            if (r.name === res && --count === 0) {
              resolve(idOrArrayOrObject.map(r => loader.resources[r]))
            }
          })
        })
      }

      // Objects
      else if (typeof idOrArrayOrObject === 'object') {
        const entries = Object.entries(idOrArrayOrObject)

        let count = entries.length
        let hasResourcesToLoad = false

        for (const [key, url] of entries) {
          if (loader.resources[key]) continue
          hasResourcesToLoad = true
          this.queueLoader(key, url, {}, r => {
            if (r.name === key) count--
            if (count <= 0) {
              const resources = entries.reduce((obj, [k]) => {
                obj[k] = loader.resources[k]
                return obj
              }, {})
              resolve(resources)
            }
          })
        }

        if (!hasResourcesToLoad) {
          const resources = entries.reduce((obj, [k]) => {
            obj[k] = loader.resources[k]
            return obj
          }, {})
          resolve(resources)
        }
      }

      if (!loader.loading) {
        loader.load()
      }
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
