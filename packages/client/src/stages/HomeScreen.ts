import * as PIXI from 'pixi.js'
import { Scene } from '../engine/lib/Scene'
import { Floor, FloorMapElevation } from '../gameobjects/room/Floor'
import { Viewport } from 'pixi-viewport'
import { Human } from '../gameobjects/human/Human'
import { Matrix } from '../engine/lib/utils/Matrix'
import { GameObject } from '../engine/lib/GameObject'
import { Observable } from '../engine/lib/Observable'
import MAP from './maps/airplane'
import { Furniture } from '@/gameobjects/furniture/Furniture'
import bus from '../event-bus'
import store, { RootState } from '@/UI/store'
import { IRoomMap } from './IRoomMap'
import { MutationPayload } from 'vuex'

const MAX_ZOOM = 4
const MIN_ZOOM = 1 / 4

export class HomeScreen extends Scene {
  protected $camera: Viewport
  private dragging = false
  protected floor: Floor = null
  protected currentRoom: IRoomMap = MAP
  protected human: Human

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

  private avoidDragMove() {
    const { floor } = this
    const moveListener = () => {
      this.dragging = true
      floor.removeListener('pointermove', moveListener)
    }

    floor.addListener('pointerdown', () => floor.addListener('pointermove', moveListener))
    floor.addListener('pointerup', () => {
      floor.removeListener('pointermove', moveListener)
      // Run microtask to update after pointertap
      Promise.resolve().then(() => (this.dragging = false))
    })
  }

  private setupFloor() {
    if (this.floor) {
      this.floor.destroy()
    }
    const { currentRoom } = this
    const mobis = currentRoom.mobis && []
    const floor = (this.floor = new Floor({
      map: Matrix.from(this.currentRoom.map as FloorMapElevation[][]),
      mobis: mobis.map(definition => new Furniture({ mobi: definition })),
      tintBlocks: false,
    }))

    const { human } = this

    human.floor = floor

    bus.$on('player:speak', time => human.speak(time))

    this.$camera.addChild(floor)

    floor.addChild(human)

    const [humanX, humanY] = floor.getFirstBlockIndexes()
    human.set('map_position', { x: humanX, y: humanY })
    human.attrs2.direction = 2

    floor.getPositionOf(humanX, humanY).copyTo(human.position)

    floor.position.set(this.$app.view.width / 2, this.$app.view.height / 2)

    this.avoidDragMove()

    let lastPosition = { x: humanX, y: humanY }
    let lastWalk = null
    let path = []

    floor.addListener('pointertap', async e => {
      if (e.target instanceof Floor || this.dragging) {
        return
      }

      floor.tintBlocks(path, 0xffffff)

      if (e.target instanceof GameObject) {
        await lastWalk
        /* eslint-disable require-atomic-updates */
        path = floor.pathFinder.find(human.mapPosition, e.target.mapPosition)
        floor.tintBlocks(path, 0xaaffff)

        human
          .followPath(path, async p => {
            const target = floor.$mapBlocks.get(p.x, p.y)
            floor.tintBlock(p, 0x00aaaa)
            human.zIndex = target.zIndex + 1
            human.walk()
            if (lastPosition) {
              const { x, y } = p
              const { x: lastX, y: lastY } = lastPosition
              let nextDirection = 0
              // Diagonal positions
              if (x < lastX && y > lastY) nextDirection = 1
              else if (x < lastX && y < lastY) nextDirection = 7
              else if (x > lastX && y > lastY) nextDirection = 3
              else if (x > lastX && y < lastY) nextDirection = 5
              // Cross positions
              else if (x < lastX) nextDirection = 0
              else if (x > lastX) nextDirection = 4
              else if (y < lastY) nextDirection = 6
              else if (y > lastY) nextDirection = 2
              human.attrs2.direction = nextDirection
            }
            lastWalk = human.moveTo(target.isoPosition.toVector2())
            await lastWalk
            human.mapPosition.set(p.x, p.y, 0)

            /* eslint-disable require-atomic-updates */
            lastPosition = p
          })
          .then(finished => {
            if (finished) human.stop()
          })
      }
    })
  }

  ready() {
    const mutationHandler: Record<string, (mutation: MutationPayload, state: RootState) => any> = {
      setCurrentRoom: (mutation, state) => {
        this.currentRoom = state.currentRoom
        this.setupFloor()
      },
    }
    this.human = new Human()
    this.setupFloor()

    store.subscribe((mutation, state) => {
      const { type } = mutation
      mutationHandler[type] && mutationHandler[type](mutation, state)
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
