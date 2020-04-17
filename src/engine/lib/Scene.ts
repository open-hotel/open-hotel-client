import { Application } from '../Application'
import { Logger } from './Logger'
import * as PIXI from 'pixi.js-legacy'

export interface SceneOptions {
  [key: string]: any
}

export abstract class Scene extends PIXI.Container {
  protected $app: Application
  protected $options: SceneOptions
  protected $logger: Logger

  async $initScene(app: Application, data: any) {
    this.$app = app

    this.$logger = this.$app.$logger.create(`scene:${this.constructor.name}`)
    this.$logger.debug('Instanciando cena...')

    this.$logger.debug('Configurando cena...')

    // Setup Scene
    if (this.setup) await this.setup(data)

    this.$logger.debug(`Renderizando ${this.constructor.name}...`)

    // Draw Scene
    if (this.ready) this.ready(data)

    return this
  }

  abstract setup(data: any): any;
  abstract ready(data: any): any;
}
