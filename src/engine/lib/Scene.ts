import { Application } from "../Application";
import { Logger } from "./Logger";

export abstract class Scene extends PIXI.Container {
    protected $app: Application
    protected $logger: Logger

    constructor () {
        super()
    }

    async $initScene(app: Application, data: any) {
        this.$app = app

        this.$logger = this.$app.$logger.create(`scene:${this.constructor.name}`)
        this.$logger.debug('Instanciando cena...')

        this.$logger.debug('Configurando cena...')

        // Setup Scene
        this.setup(data)

        this.$logger.debug(`Renderizando ${this.constructor.name}...`)
        // Draw Scene
        this.ready(data)

        return this
    }

    // eslint-disable-next-line
    setup (data: any) {}
    // eslint-disable-next-line
    ready (data: any) {}
}