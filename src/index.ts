import 'reflect-metadata'
import { Game } from './game/Game'
import { Scene } from './engine/lib/Scene'
import { Matrix } from './engine/lib/util/Matrix'
import { RoomModel, RoomFloorHeight } from './game/room/Room.model'
import { Viewport } from 'pixi-viewport'
import resources from '../todo/stages/preload'
import { Human } from './game/users/human/Human'
import { Figure, Action } from './game/imager/human/Human.imager'

// import Vue from 'vue'
// import App from './ui/App.vue'
// import router from './ui/router'
// import './ui/components'

// new Vue({
//   el: '#app',
//   router,
//   render: h => h(App)
// })

const game = new Game()

function mapObject(obj: any, fn: Function, path: string[] = []) {
  for (let k in obj) {
    const currentPath = path.concat(k)
    if (obj[k].constructor === Object) {
      mapObject(obj[k], fn, currentPath)
    } else {
      fn(obj[k], currentPath)
    }
  }
}

class RoomScene extends Scene {
  map = Matrix.fromLegacyString<RoomFloorHeight>(`
  xxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxx33333333333333
  xxxxxxxxxxx33333333333333
  xxxxxxxxxxx33333333333333
  xxxxxxxxxx333333333333333
  xxxxxxxxxxx33333333333333
  xxxxxxxxxxx33333333333333
  xxxxxxx333333333333333333
  xxxxxxx333333333333333333
  xxxxxxx333333333333333333
  xxxxxxx333333333333333333
  xxxxxxx333333333333333333
  xxxxxxx333333333333333333
  x4444433333xxxxxxxxxxxxxx
  x4444433333xxxxxxxxxxxxxx
  x44444333333222xx000000xx
  x44444333333222xx000000xx
  xxx44xxxxxxxx22xx000000xx
  xxx33xxxxxxxx11xx000000xx
  xxx33322222211110000000xx
  xxx33322222211110000000xx
  xxxxxxxxxxxxxxxxx000000xx
  xxxxxxxxxxxxxxxxx000000xx
  xxxxxxxxxxxxxxxxx000000xx
  xxxxxxxxxxxxxxxxx000000xx
  xxxxxxxxxxxxxxxxxxxxxxxxx
`)

  camera = new Viewport().drag({ wheelScroll: 0 }).wheel({
    reverse: false,
    smooth: 10,
  })

  setup() {
    this.$app.loader.baseUrl = process.env.RESOURCES_BASE
    return new Promise((resolve) => {
      // mapObject(resources, (filename: string, path: string[]) => {
      //   const id = path.join('/')
      //   const url = ['resources', id, filename].join('/')
      //   this.$app.loader.add(id, url)
      // })
      
      this.$app.loader
        .add('figuremap', 'dist/figuremap.json')
        .add('figuredata', 'dist/figuredata.json')
        .add('partsets', 'dist/partsets.json')
        .add('draworder', 'raw/draworder.json')
        ;
      for (const lib of [
        'hh_human_body',
      ]) {
        this.$app.loader.add(lib, `dist/${lib}/${lib}.json`)
      }
  
      this.$app.loader.once('complete', resolve)
      this.$app.loader.load()
    })
  }

  ready() {
    const d = 2;
    const human = new Human({
      action:{
        'std': true
      },
      figure: 'hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61',
      direction: d,
      head_direction: d,
      frame: 0,
      is_ghost: false
    })

    human.position.set(0, 80)
    
    this.$app.scene.addChild(this.camera)
    
    Game.current.setCurrentRoom(new RoomModel(this.map, 10, 4))
    
    this.camera.addChild(Game.current.currentRoom.engine.container)
    this.camera.addChild(human)

    this.camera.moveCenter(0, 100);
  }

  init() {}
}

game.app.$router.setRoutes({
  room: RoomScene,
})