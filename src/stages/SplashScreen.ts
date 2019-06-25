import { Scene } from "../engine/lib/Scene";
import { Progress } from "../gameobjects/Progress";

export class SplashScreen extends Scene {
    private $progress:Progress
    private $loading: PIXI.Text

    setup () {
        this.$app.loader.add([
            'resources/images/splash/stack.png',
            'resources/images/splash/frame.png',
            'resources/images/splash/photo.png',
        ])

        this.$loading = new PIXI.Text('Aguarde...', new PIXI.TextStyle({
            fill: '#FFFFFF'
        }))
        this.addChild(this.$loading)
    }

    downloadAssets() {
        this.$app.loader
        .add('door', 'resources/images/room/door.png')
        .add('door_floor', 'resources/images/room/door_floor.png')
        .add('floor', 'resources/images/room/floor.png')
        .add('floor_selected', 'resources/images/room/floor_selected.png')
        .add('wall_left', 'resources/images/room/wall_left.png')
        .add('wall_right', 'resources/images/room/wall_right.png')
        .load(() => {
            setTimeout(() => this.$app.$router.replace('home'), 500)
        }).on('progress', (loader: PIXI.Loader) => {
            this.$progress.value = loader.progress
        })
    }

    ready () {
        this.removeChild(this.$loading)
        this.downloadAssets()
        this.renderScreen()
    }

    renderScreen() {
        this.$app.renderer.backgroundColor = 0x0e151c

        const container = new PIXI.Container()
        const message = new PIXI.Text(
            'O tempo é apenas uma ilusão...',
            new PIXI.TextStyle({
                fill: '#FFFFFFEE',
                fontSize: 28,
                wordWrap: true,
                wordWrapWidth: 480
            })
        )
        const stack = PIXI.Sprite.from('resources/images/splash/stack.png')
        const frame = PIXI.Sprite.from('resources/images/splash/frame.png')
        const image = PIXI.Sprite.from('resources/images/splash/photo.png')

        image.width = 500
        image.height = 434
        image.scale.set(1)

        const progress = this.$progress = new Progress({
            width: 300,
            value: 0
        })

        image.position.set(95, 51)

        container.addChild(
            stack,
            image,
            frame,
            message,
            progress
        )

        message.style.wordWrapWidth = container.width
        message.width = container.width
        message.height = container.height

        message.x = container.width / 2
        message.y = container.height + 16

        message.scale.set(1)
        message.anchor.set(.5, .5)

        progress.pivot.set(
            progress.width,
            progress.height / 2,
        )

        progress.x = container.width / 2
        progress.y = container.height + 16


        container.x = this.$app.view.width / 2
        container.y = this.$app.view.height / 2

        container.pivot.set(
            container.width / 2,
            container.height / 2
        )
        this.addChild(container)
    }
}