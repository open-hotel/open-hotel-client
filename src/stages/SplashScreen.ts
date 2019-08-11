import { Scene } from "../engine/lib/Scene";
import { Progress } from "../gameobjects/Progress";

export class SplashScreen extends Scene {
    private $progress: Progress;
    private $loading: PIXI.Text;
    private $container: PIXI.Container
    private onResize: EventListener;

    setup() {
        this.$app.loader
            .add("splash_stack", "resources/splash/splash_stack.png")
            .add("splash_frame", "resources/splash/splash_frame.png")
            .add(
                "splash_photo",
                `resources/splash/splash_photo_${Math.floor(Math.random() * 20)}.png`
            )
            .load(this.downloadAssets.bind(this));

        this.$loading = new PIXI.Text(
            "Aguarde...",
            new PIXI.TextStyle({
                fill: "#FFFFFF"
            })
        );
        this.addChild(this.$loading);
        this.$logger.info("Setup...");
    }

    downloadAssets() {
        this.removeChild(this.$loading);
        this.renderSplash();
        this.$app.loader
        // .add("door", "resources/images/room/door.png")
        // .add("door_floor", "resources/images/room/door_floor.png")
        // .add("floor", "resources/images/room/floor.png")
            .add("floor_selected", "resources/images/room/floor_selected.png")
        // .add("wall_left", "resources/images/room/wall_left.png")
        // .add("wall_right", "resources/images/room/wall_right.png")
            .load(() => {
                setTimeout(() => this.$app.$router.replace("home"), 500);
            })
            .on("progress", (loader: PIXI.Loader) => {
                this.$progress.value = loader.progress;
            });
        this.$logger.debug("Downloading...");
    }

    renderSplash() {
        const { splash_stack, splash_photo, splash_frame } = this.$app.loader.resources

        this.$app.renderer.backgroundColor = 0x0e151c;
    
        const progress = this.$progress = new Progress({
            width: 300,
            value: 0
        });

        const stack = PIXI.Sprite.from(splash_stack.texture);
        const image = PIXI.Sprite.from(splash_photo.texture);
        const frame = PIXI.Sprite.from(splash_frame.texture);

        const message = new PIXI.Text(
            "O tempo é apenas uma ilusão...",
            new PIXI.TextStyle({
                fontFamily: ["Ubuntu", "Arial"],
                fill: "#FFFFFFEE",
                fontSize: 32,
                wordWrap: true,
                wordWrapWidth: 480
            })
        );

        const container = this.$container = new PIXI.Container();

        container.addChild(stack, image, frame, message, progress);

        image.position.set(95, 51)
    
        message.style.wordWrapWidth = container.width
        message.position.set(container.width / 2, container.height)
        message.pivot.set(message.width / 2, -40)

        progress.position.set(container.width / 2, container.height)
        progress.pivot.set(progress.width / 2, -16)

        this.addChild(container);

        this.onResize = () => {
            container.position.set(this.$app.view.width / 2, this.$app.view.height / 2)
            container.pivot.set(container.width / 2, container.height / 2)
        }

        window.addEventListener('resize', this.onResize)

        this.onResize(null)
    }

    destroy () {
        window.removeEventListener('resize', this.onResize)
        super.destroy()
    }
}
