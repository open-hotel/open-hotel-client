import * as PIXI from 'pixi.js'
import { Scene } from '../engine/lib/Scene'
import { Viewport } from 'pixi-viewport'
import { GameObject } from '../engine/lib/GameObject'
import { Observable } from '../engine/lib/Observable'
import { Matrix } from '../engine/lib/utils/Matrix'
import MAP from './maps/airplane'
import { IRoomMap } from './IRoomMap'
import { MutationPayload } from 'vuex'
import { Human } from '../objects/human/Human'
import { Floor, FloorMapElevation } from '../objects/room/Floor'
import { GameFurniture } from '../objects/furniture/GameFurniture'

const MAX_ZOOM = 4
const MIN_ZOOM = 1 / 4

export class RoomStage extends Scene {
  protected $camera: Viewport
  private dragging = false
  protected floor: Floor = null
  protected currentRoom: IRoomMap = MAP
  protected users: Map<string, Human> = new Map()

  setup() {
    this.configureCamera()
    this.configureEvents()
  }

  get human() {
    return this.users.get(this.$app.$ws.id)
  }

  private configureEvents() {
    const ws = this.$app.$ws.removeAllListeners()

    ws.emit('room:join', { roomId: 'default' }, result => {
      console.log(result)
    })

    ws.on('room:state', ({ map, mobis, users }) => {
      for (const user of users) {
        const newHuman = this.buildHuman(user)
        this.users.set(user.socketId, newHuman)
      }
    })

    ws.on('user:leave', ({ socketId }) => {
      const oldUser = this.users.get(socketId)
      this.floor.removeChild(oldUser)
      oldUser.destroy()
      oldUser.removeAllListeners()
      this.users.delete(socketId)
    })

    ws.on('user:walk', ({ path, socketId }) => {
      const user = this.users.get(socketId)
      user.walk(path)
    })

    ws.on('room:join', userState => {
      const human = this.buildHuman(userState)
      this.users.set(userState.socketId, human)
    })

    ws.on('disconnect', () => {
      alert('You were disconnected. Reloading page...')
      window.location.reload()
    })
  }

  private configureCamera() {
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

  private buildHuman(user: { position: [number, number]; socketId: string }) {
    const human = new Human()
    const { floor } = this

    human.floor = floor

    floor.addChild(human)

    const [humanX, humanY] = user.position
    human.set('map_position', { x: humanX, y: humanY })
    human.attrs2.direction = 2
    floor.getPositionOf(humanX, humanY).copyTo(human.position)

    return human
  }

  private setupFloor() {
    if (this.floor) {
      this.floor.destroy()
    }
    const { currentRoom } = this
    const mobis = currentRoom.mobis && []
    const floor = (this.floor = new Floor({
      map: Matrix.from(this.currentRoom.map as FloorMapElevation[][]),
      mobis: mobis.map(definition => new GameFurniture({
        mobi: definition,
        action: '',
        direction: 0,
        prefix: 'aa',
        type: 1
      })),
      tintBlocks: true,
    }))

    this.$camera.addChild(floor)

    floor.position.set(this.$app.view.width / 2, this.$app.view.height / 2)

    this.avoidDragMove()

    floor.addListener('pointertap', async e => {
      if (e.target instanceof Floor || this.dragging) {
        return
      }

      if (!(e.target instanceof GameObject)) {
        return
      }
      const { x, y } = e.target.mapPosition
      this.$app.$ws.emit('user:walk', [x, y])
    })
  }

  ready() {
    this.setupFloor()
  }
}
