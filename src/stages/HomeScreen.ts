import { Scene } from '../engine/lib/Scene'
import { Floor } from '../gameobjects/room/Floor'
import { Viewport } from 'pixi-viewport'
import { Human } from '../gameobjects/human/Human'
import { Matrix } from '../engine/lib/utils/Matrix'
import { GameObject } from '../engine/lib/GameObject'
import { Walkable } from '../engine/lib/utils/Walk'
import { Observable } from '../engine/lib/Observable'

const MAX_ZOOM = 4
const MIN_ZOOM = 1 / 4

export class HomeScreen extends Scene {
    protected $camera: Viewport

    setup() {
        this.$camera = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: window.innerWidth * 2,
            worldHeight: window.innerHeight * 2,
            interaction: this.$app.renderer.plugins.interaction,
        })
            .drag({
                reverse: false,
            })
            .pinch()
            .wheel()
            .clampZoom({
                maxHeight: window.innerHeight * MAX_ZOOM,
                maxWidth: window.innerWidth * MAX_ZOOM,
                minHeight: window.innerHeight * MIN_ZOOM,
                minWidth: window.innerWidth * MIN_ZOOM,
            })

        const bg = new PIXI.Graphics()

        bg.beginFill(0x000000, 1)
        bg.drawRect(0, 0, this.$app.view.width, this.$app.view.height)
        bg.endFill()

        bg.width = this.$app.view.width
        bg.height = this.$app.view.height

        this.addChild(bg, this.$camera)
    }

    ready() {
        const floor = new Floor({
            map: Matrix.from([
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            ]),
        })

        const human = new Human()
        human.floor = floor

        this.$camera.addChild(floor)

        floor.addChild(human)

        const [humanX, humanY] = floor.getFirstBlockIndexes()
        human.set('map_position', { x: humanX, y: humanY })
        human.attrs2.direction = 2

        floor.getPositionOf(humanX, humanY).copyTo(human.position)

        floor.position.set(this.$app.view.width / 2, this.$app.view.height / 2)

        let lastPosition: any = null
        floor.addListener('pointertap', async e => {
            if (e.target instanceof GameObject) {
                Walkable.walk(floor.pathFinder.find(human.mapPosition, e.target.mapPosition), async p => {
                    const target = floor.$mapBlocks.get(p.x, p.y)

                    human.zIndex = target.zIndex + 1
                    human.mapPosition.set(p.x, p.y, 0)
                    human.walk()

                    if (lastPosition) {
                        if (p.x < lastPosition.x) human.attrs2.direction = 0
                        else if (p.x > lastPosition.x) human.attrs2.direction = 4
                        else if (p.y < lastPosition.y) human.attrs2.direction = 6
                        else if (p.y > lastPosition.y) human.attrs2.direction = 2
                    }

                    await human.moveTo(target.isoPosition)

                    human.stop()
                    lastPosition = p
                })
            }
        })
    }
}

interface ObjProps {
    x: number
    y: number
    pessoa: {
        nome: string
        idade: number
    }
}
const obj = Observable.create<ObjProps>({
    x: 0,
    y: 0,
    pessoa: {
        nome: null,
        idade: null,
    },
})

obj.addListener((_: any, __: any, path: any) => console.log('ALTEROU %s', path))
obj.watch('x', (n: any, old: any) => console.log('O X Mudou de %s para %s!', old, n))

//@ts-ignore
window.obj = obj
