import { Scene } from "../engine/lib/Scene";
import { Floor } from "../gameobjects/room/Floor";
import { FloorBlock } from "../gameobjects/room/FloorBlock";
import { IsoPoint } from "../engine/lib/IsoPoint";

export class HomeScreen extends Scene {
    ready () {
        const bg = new PIXI.Graphics()

        bg.beginFill(0x000000, 1)
        bg.drawRect(0, 0, this.$app.view.width, this.$app.view.height)
        bg.endFill()

        bg.width = this.$app.view.width
        bg.height = this.$app.view.height

        this.addChild(bg)

        this.addChild(
            new Floor({
                map: [
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0],
                ]
            })
            
        )
    }
}