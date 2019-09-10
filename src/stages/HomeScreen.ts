import * as PIXI from 'pixi.js'
import { Scene } from '../engine/lib/Scene'
import { Floor, FloorMapElevation } from '../gameobjects/room/Floor'
import { Viewport } from 'pixi-viewport'
import { Human } from '../gameobjects/human/Human'
import { Matrix } from '../engine/lib/utils/Matrix'
import { GameObject } from '../engine/lib/GameObject'
import { Walkable } from '../engine/lib/utils/Walk'
import { Observable } from '../engine/lib/Observable'
import MAP from './maps/airplane'

const MAX_ZOOM = 4
const MIN_ZOOM = 1 / 4

export class HomeScreen extends Scene {
  protected $camera: Viewport

  setup() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.$camera = new Viewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width * 2,
      worldHeight: height * 2,
      interaction: this.$app.renderer.plugins.interaction,
    })
      .drag({
        reverse: false,
      })
      .pinch({
        percent: 20,
      })
      .wheel()
      .clampZoom({
        maxHeight: height * MAX_ZOOM,
        maxWidth: width * MAX_ZOOM,
        minHeight: height * MIN_ZOOM,
        minWidth: width * MIN_ZOOM,
      })
    if (screen.width < 768) {
      this.$camera.fit()
    }

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
      map: Matrix.from(MAP as FloorMapElevation[][]),
    })

    const human = new Human()
    human.floor = floor

    this.$camera.addChild(floor)

    floor.addChild(human)

    const [humanX, humanY] = floor.getFirstBlockIndexes()
    human.set('map_position', { x: humanX, y: humanY })
    // human.attrs2.direction = 2

    floor.getPositionOf(humanX, humanY).copyTo(human.position)

    floor.position.set(this.$app.view.width / 2, this.$app.view.height / 2)

    let dragging = false

    const moveListener = () => {
      dragging = true
      floor.removeListener('pointermove', moveListener)
    }

    floor.addListener('pointerdown', () => floor.addListener('pointermove', moveListener))
    floor.addListener('pointerup', () => {
      floor.removeListener('pointermove', moveListener)
      // Run microtask to update after pointertap
      Promise.resolve().then(() => (dragging = false))
    })

    let lastPosition = null

    floor.addListener('pointertap', async e => {
      console.log('pointer tap')
      if (e.target instanceof Floor || dragging) {
        return
      }
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

          /* eslint-disable require-atomic-updates */
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
