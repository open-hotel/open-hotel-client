import { Application } from "../../engine/Application";
import { Polygon, SCALE_MODES, Graphics, RenderTexture } from "pixi.js";
import { Vector3 } from "../../engine/lib/isometric/Vector3";
import { Cube } from "../../engine/lib/geometry/Cube";
import { GameObject } from "../../engine/lib/GameObject";
import { Debug } from "../../engine/lib/utils/Debug";

export class FloorBlock extends GameObject {
    private $app: Application;
    private static $cache:{
        default?: PIXI.Texture,
        hover?: PIXI.Texture,
        shape?: PIXI.Graphics,
    } = {}

    constructor (position: Vector3 = new Vector3()) {
        super()

        position.copyTo(this.isoPosition)

        this.$app = Application.get()


        this.texture = this.generateTexture()
        this.interactive = true
        this.buttonMode = true

        this.hitArea = new Polygon([
            new PIXI.Point(this.width / 2, 0),
            new PIXI.Point(this.width, (this.height / 2) - 4),
            new PIXI.Point(this.width / 2 , this.height - 8),
            new PIXI.Point(0 , (this.height / 2) - 4),
        ])

        this.addListener('pointerover', () => {
            this.texture = this.generateHoverTexture()
        }).addListener('pointerout', () => {
            this.texture = FloorBlock.$cache.default
        })
    }

    private generateTexture (): PIXI.Texture {
        if (FloorBlock.$cache.default) return FloorBlock.$cache.default

        const floor = new Cube({
            depth: 32,
            height: 8,
            width: 32
        })
        
        const borderStroke = new PIXI.Polygon([
            new Vector3(1, 31, 0).toVector2(),
            new Vector3(1, 1, 0).toVector2(),
            new Vector3(31, 1, 0).toVector2(),
        ])

        borderStroke.closeStroke = false

        floor.lineStyle(2, 0x000000, .05)
        floor.drawShape(borderStroke)

        FloorBlock.$cache.shape = floor
        return FloorBlock.$cache.default = this.$app.renderer.generateTexture(floor, SCALE_MODES.NEAREST, 1)
    }

    private generateHoverTexture () {
        if (FloorBlock.$cache.hover) return FloorBlock.$cache.hover

        const select = FloorBlock.$cache.shape.clone()        

        select.lineStyle(3, 0xFFFFFF, .75, 0)
        select.drawPolygon([
            new Vector3(2, 2, 0).toVector2(),
            new Vector3(32, 2, 0).toVector2(),
            new Vector3(32, 32, 0).toVector2(),
            new Vector3(2, 32, 0).toVector2(),
        ])

        return FloorBlock.$cache.hover = this.$app.renderer.generateTexture(select, SCALE_MODES.NEAREST, 1)
    }
}