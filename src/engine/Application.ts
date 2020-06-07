import * as PIXI from 'pixi.js'
import { Logger, Log } from './lib/Logger'
import Tween from '@tweenjs/tween.js'
import { Viewport } from 'pixi-viewport'

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
  public camera: Viewport
  public readonly $logger = new Logger('Application')
  public worker: Worker

  constructor(options: ApplicationOptions = {}) {
    super({
      resizeTo: window,
      backgroundColor: 0x000000,
      antialias: true,
      ...options,
    })

    window.addEventListener('resize', () => {
      this.resize()
      if (this.camera && this.camera.visible) {
        this.camera.resize(window.innerWidth, window.innerHeight)
      }
    })
    this.tickerFallback()

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
}
