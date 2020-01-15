import { NetworkManager } from './network/NetworkManager'
import { GenericGateway } from './network/incoming/Generic.gateway'
import { Imager } from './imager'
import { Application } from '../engine/Application'
import Room from './room/Room'
import { RoomModel } from './room/Room.model'
import { SoundManager } from './sound/Sound.manager'
import { GameSounds } from './sound/GameSounds'

export class Game {
  static current: Game

  app: Application
  
  net = new NetworkManager({
    game: this,
    url: 'http://localhost:3000',
    gateways: [GenericGateway],
  })

  imager = new Imager()
  sound = new SoundManager()

  currentRoom: Room

  constructor() {
    if (Game.current) return Game.current

    const canvas = document.getElementById('game') as HTMLCanvasElement

    this.app = Application.get({
      game: this,
      view: canvas,
      debug: true,
      resizeTo: canvas.parentElement,
      resolution: window.devicePixelRatio || 1,
    })

    Game.current = this
  }

  setCurrentRoom (roomModel: RoomModel) {
    if (this.currentRoom) this.currentRoom.dispose()
    this.currentRoom = new Room(roomModel)
    this.sound.play(GameSounds.CREDITS)
    return this
  }
}
