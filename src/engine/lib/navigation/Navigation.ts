import { Application } from '../../Application';
import { Class } from "../../types";
import { Scene } from '../Scene';
import { Logger } from '../Logger';
import * as TWEEN from '@tweenjs/tween.js'

interface NavigationRoutes {
    [key:string]: Class<Scene>
}

interface NavigationHistoryItem {
    key     : string,
    scene   : Scene
}

export class Navigation {
    protected currentRoute: NavigationHistoryItem;
    protected stack: NavigationHistoryItem[] = [];
    protected routes: NavigationRoutes = {}
    protected $logger: Logger
    
    constructor (
        protected $app: Application,
        protected target: PIXI.Container = $app.stage
    ) {
        this.$logger = $app.$logger.create('navigation')
        this.$app.ticker.add(() => {
            TWEEN.update(this.$app.ticker.lastTime)
        })
    }

    /**
     * Define all routes
     * @param routes Routes
     */
    setRoutes (routes: NavigationRoutes, initialRoute?:string) {
        this.$logger.debug(`Iniciando rotas...`)

        this.routes = {}

        for (let key in routes) {
            this.register(key, routes[key])
        }

        if (initialRoute) this.push(initialRoute)
        
        return this
    }

    /**
     * Register a new route
     * @param key Scene unique name
     * @param SceneContructor Scene Container
     */
    register (key:string, SceneContructorItem: Class<Scene>) {
        this.$logger.debug(`definindo ${SceneContructorItem.name} em /${key}...`)

        if (key in this.routes) {
            this.$logger.fatal(`Route "${key}" already registered!`)
        }
        this.routes[key] = SceneContructorItem
        return this
    }

    private mount (scene: Scene, key?:string, destroyPrevious:boolean = true, cb?:Function) {        
        this.$logger.debug('Renderizando cena...', scene)
        
        scene.x = scene.y = 0
        
        if (this.currentRoute) {
            const alphaTo = new PIXI.filters.AlphaFilter();
            const alphaFrom = new PIXI.filters.AlphaFilter();

            alphaTo.alpha = 0;
            alphaFrom.alpha = 1;

            scene.filters = [alphaTo]
            this.currentRoute.scene.filters = [alphaFrom]

            new TWEEN.Tween({ from: 1, to: 0 })
            .to({ from: 0, to: 1 }, 1000)
            .start()
            .onUpdate((alpha) => {
                alphaTo.alpha = alpha.to
                alphaFrom.alpha = alpha.from
            })
            .onComplete(() => {
                this.target.removeChild(this.currentRoute.scene)
                if (destroyPrevious) this.currentRoute.scene.destroy()
                this.currentRoute = { key, scene }
                if (cb) cb()
            })
        } else {
            this.currentRoute = { key, scene }
        }

        this.target.addChild(scene)
        
        return scene
    }

    private mountKey (key:string, data:any, destroyPrevious?:boolean, cb?:Function) {
        if (!(key in this.routes)) throw new Error(`Route "${key}" not defined!`)
        
        const scene = new this.routes[key]

        this.$logger.debug('Configurando cena...')
        
        scene.$initScene(this.$app, data)

        return this.mount(scene, key, destroyPrevious, cb)
    }

    push (key:string, data?:any, cb?: Function) {
        this.$logger.info('Navegando para', key)
        this.stack.push({ key, scene: this.mountKey(key, data, false, cb) })
        return this
    }

    pop (test?:Function) {
        this.$logger.debug('Pop!')
        if (!test) test = (
            item:NavigationHistoryItem,
            index:number,
            stack:NavigationRoutes[]
        ) => index === stack.length - 1

        let index = this.stack.length

        while (index > 0 && this.stack.length > 0 && test(this.stack[index--], index, this.stack)) {
            const stackItem = this.stack.pop()
            if (stackItem) stackItem.scene.destroy()
        }

        return this
    }

    replace(key:string, data?:any) {
        this.$logger.debug('A cena atual foi substituída por', key)
        
        const scene = this.stack.pop()

        return this.push(key, data, () => {
            if (scene) scene.scene.destroy()
        })
    }

    back () {
        this.$logger.debug('Voltando para a tela anterior...')

        const index = this.stack.lastIndexOf(this.currentRoute)
        
        if (index <= 0) return this

        const route = this.stack[index - 1]
        this.mount(route.scene, route.key, false)
        
        return this
    }

    go(index = 0) {
        this.$logger.debug(`Navegando ${index} cenas...`)

        index = this.stack.lastIndexOf(this.currentRoute) - index

        if (index <= 0) return this
        
        const route = this.stack[index - 1]
        this.mount(route.scene, route.key, false)
        
        return this
    }
}