import * as PIXI from 'pixi.js'
import { Logger, Log } from './lib/Logger'
import Tween from '@tweenjs/tween.js'

export interface ApplicationOptions {
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
  public readonly $logger = new Logger('Application')
  public worker: Worker

  constructor(options: ApplicationOptions = {}) {
    super({
      ...options,
      backgroundColor: 0x000000,
    })

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

  onResize() {
    // resize renderer
    this.renderer.resize(window.innerWidth, window.innerHeight)
    this.view.width = window.innerWidth
    this.view.height = window.innerHeight
    this.$logger.info(`As dimensões da tela mudaram para ${this.view.width}x${this.view.height}`)
  }
}
