import 'reflect-metadata'
import { Game } from './game/Game'
import { Scene } from './engine/lib/Scene'
import { Matrix } from './engine/lib/util/Matrix'
import { RoomModel, RoomFloorHeight } from './game/room/Room.model'
import { Viewport } from 'pixi-viewport'
import resources from '../todo/stages/preload'
import { Human } from './game/users/human/Human'

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
  map = Matrix.from<RoomFloorHeight>([
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
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
  ])

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
        .add('figuremap', 'raw/figuremap.json')
        .add('figuredata', 'raw/figuredata.json')
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
    const figure = {
      hd: {
        id: '1',
        color: '1'
      },
      // ea: {
      //   id: '6',
      //   color: '1'
      // },
      ey: {
        id: '1',
      },
      hr: {
        id: '1',
        color: '1'
      },
      he: {
        id: '2'
      },
      fc: {
        id: '1',
        color: '1'
      },
      ha: {
        id: '6',
        color: '1'
      }
    };

    const human = new Human({
      action: {
        spk: false
      },
      figure: figure,
      direction: 2,
      head_direction: 2,
      frame: 1,
      is_ghost: false
    })

    human.position.set(0, 80)
    
    this.$app.scene.addChild(this.camera)
    
    Game.current.setCurrentRoom(new RoomModel(this.map, 3, 0))
    
    this.camera.addChild(Game.current.currentRoom.engine.container)
    this.camera.addChild(human)

    this.camera.moveCenter(0, 100);
  }

  init() {}
}

game.app.$router.setRoutes({
  room: RoomScene,
})
