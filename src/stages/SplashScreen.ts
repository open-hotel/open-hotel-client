import { Scene } from '../engine/lib/Scene'
import { Progress } from '../gameobjects/Progress'
import resources from './preload'
import { Log } from '../engine/lib/Logger'

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

export class SplashScreen extends Scene {
  private $progress: Progress
  private $loading: PIXI.Text
  private $container: PIXI.Container
  private onResize: EventListener

  setup() {
    this.$app.loader
      .add('splash/stack', `resources/splash/splash_stack.png`)
      .add('splash/frame', `resources/splash/splash_frame.png`)
      .add('splash/photo', `resources/splash/splash_photo_${Math.floor(Math.random() * 20)}.png`)
      .load(this.downloadAssets.bind(this))

    this.$loading = new PIXI.Text(
      'Aguarde...',
      new PIXI.TextStyle({
        fill: '#FFFFFF',
      }),
    )
    this.addChild(this.$loading)
    this.$logger.info('Setup...')
  }

  downloadAssets() {
    this.removeChild(this.$loading)
    this.renderSplash()
    const { loader } = this.$app

    mapObject(resources, (filename: string, path: string[]) => {
      const id = path.join('/')
      const url = ['resources', id, filename].join('/')
      loader.add(id, url)
    })

    this.$app.loader
      .load(() => {
        this.$app.$router.replace('home')
        // setTimeout(() => this.$app.$router.replace('home'), 500)
      })
      .on('progress', (loader: PIXI.Loader, resource) => {
        this.$logger.log(Log.INFO, `[${loader.progress}%] Downloading ${resource.url}`)
        this.$progress.value = loader.progress
      })
  }

  renderSplash() {
    const { resources } = this.$app.loader

    this.$app.renderer.backgroundColor = 0x0e151c

    const progress = (this.$progress = new Progress({
      width: 300,
      value: 0,
    }))

    const stack = PIXI.Sprite.from(resources['splash/stack'].texture)
    const image = PIXI.Sprite.from(resources['splash/photo'].texture)
    const frame = PIXI.Sprite.from(resources['splash/frame'].texture)

    const message = new PIXI.Text(
      'O tempo é apenas uma ilusão...',
      new PIXI.TextStyle({
        fontFamily: ['Ubuntu', 'Arial'],
        fill: '#FFFFFFEE',
        fontSize: 32,
        wordWrap: true,
        wordWrapWidth: 480,
      }),
    )

    const container = (this.$container = new PIXI.Container())

    container.addChild(stack, image, frame, message, progress)

    image.position.set(95, 51)

    message.style.wordWrapWidth = container.width
    message.position.set(container.width / 2, container.height)
    message.pivot.set(message.width / 2, -40)

    progress.position.set(container.width / 2, container.height)
    progress.pivot.set(progress.width / 2, -16)

    this.addChild(container)

    this.onResize = () => {
      container.position.set(this.$app.view.width / 2, this.$app.view.height / 2)
      container.pivot.set(container.width / 2, container.height / 2)
    }

    window.addEventListener('resize', this.onResize)

    this.onResize(null)
  }

  destroy() {
    window.removeEventListener('resize', this.onResize)
    super.destroy()
  }
}
