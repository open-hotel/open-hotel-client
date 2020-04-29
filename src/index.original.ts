import 'reflect-metadata'
import { Game } from './game/Game'
import { Scene } from './engine/lib/Scene'
import { Matrix } from './engine/lib/util/Matrix'
import { RoomModel, RoomFloorHeight } from './game/room/Room.model'
import { Viewport } from 'pixi-viewport'
import { Human } from './game/users/human/Human'
import { Action } from './game/imager/human/action.util'
import { Figure } from './game/imager/human/figure.util'
import { Sprite } from 'pixi.js-legacy'
import { HumanFigureProps } from './game/imager/human.imager'

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
    return new Promise(resolve => {
      // mapObject(resources, (filename: string, path: string[]) => {
      //   const id = path.join('/')
      //   const url = ['resources', id, filename].join('/')
      //   this.$app.loader.add(id, url)
      // })

      this.$app.loader
        .add('figuremap', 'figuremap.json')
        .add('figuredata', 'figuredata.json')
        .add('partsets', 'partsets.json')
        .add('draworder', 'draworder.json')
        .add('avatarActions', 'HabboAvatarActions.json')
        .add('geometry', 'geometry.json')
        .add('animations', 'animations.json')
        .add('effectmap', 'effectmap.json')

      this.$app.loader.once('complete', resolve)
      this.$app.loader.load()
    })
  }

  async ready() {
    const sleep = time => new Promise(resolve => setTimeout(resolve, time))
    const qt = 2
    const state: HumanFigureProps = {
      actions: Action.decode('dance=3'),
      // figure: Figure.decode('hd-180-1'),
      figure: Figure.decode('hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61'),
      direction: 7,
      head_direction: 0,
      is_ghost: false,
    }

    const sprites = new Array(qt).fill(null).map(() => {
      const sprite = new PIXI.AnimatedSprite([PIXI.Texture.EMPTY])
      sprite.animationSpeed = 0.5
      return sprite
    })

    // const sprite = new PIXI.AnimatedSprite([PIXI.Texture.EMPTY]);
    // sprite.animationSpeed = 0.5;
    // sprite.name = "mizerave"

    // sprite.scale.set(3)

    // sprite.textures = await Game.current.imager.human.createAnimation(state);
    // this.addChild(sprite)
    // sprite.play()

    async function changeHead (v = 1) {
      state.head_direction += v;

      if (state.head_direction > 7) {
        state.head_direction = 0;
      } else if (state.head_direction < 0) {
        state.head_direction = 7;
      }
    }

    async function changeBody (v = 1) {
      state.direction += v;

      if (state.direction > 7) {
        state.direction = 0;
      } else if (state.direction < 0) {
        state.direction = 7;
      }

    }

    async function change() {
      changeHead()
      changeBody()
      for (let i = 0; i < qt; i++) {
        const sprite = sprites[i]
        sprite.textures = await Game.current.imager.human.createAnimation({
          ...state,
          actions: {
            ...state.actions,
            ...(i == 1 ? { fx: '1' } : {}),
            // dance: String((i % 4) + 1),
          },
        })
        sprite.scale.set(1)
        sprite.position.x = sprite.width * i
      }
    }

    this.addChild(...sprites)
    await change()

    // while (true) {
    //   await change()
    //   await sleep(3000)
    // }

    window.addEventListener('keydown', e => {
      // let dHead = e.key === 'a' ? 1 : e.key === 'd' ? -1 : 0
      // let dBody = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0
      // if (dHead) changeHead(dHead)
      // if (dBody) changeBody(dBody)
      change()
    })

    // const human = new Human({
    //   actions: Action.decode('std'),
    //   gesture: 'std',
    //   figure: Figure.decode('hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61'),
    //   direction: d,
    //   head_direction: d,
    //   frame: 0,
    //   is_ghost: false
    // })

    // human.position.set(0, 80)

    // this.$app.scene.addChild(this.camera)

    // Game.current.setCurrentRoom(new RoomModel(this.map, 10, 4))

    // this.camera.addChild(Game.current.currentRoom.engine.container)
    // this.camera.addChild(human)

    // this.camera.moveCenter(0, 100);
  }

  init() {}
}

game.app.$router.setRoutes({
  room: RoomScene,
})
