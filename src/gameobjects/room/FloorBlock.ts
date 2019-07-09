import { Application } from "../../engine/Application";
import { Polygon, SCALE_MODES, Graphics } from "pixi.js";
import { IsoPoint } from "../../engine/lib/IsoPoint";
import { Cube } from "../../engine/lib/geometry/Cube";
import { GameObject } from "../../engine/lib/GameObject";

export class FloorBlock extends GameObject {
    public static $textureCache: PIXI.Texture;
    private $app: Application;
    private $textures:{ [key:string]: PIXI.Texture } = {
        default: null,
        hover  : null
    }

    constructor (public $position: IsoPoint = new IsoPoint()) {
        super()

        this.$app = Application.get()

        this.$textures.default = this.generateTexture()
        this.$textures.hover = this.$app.loader.resources.floor_selected.texture

        this.texture = this.$textures.default
        this.interactive = true
        this.buttonMode = true

        this.hitArea = new Polygon([
            new PIXI.Point(this.width / 2, 0),
            new PIXI.Point(this.width, (this.height / 2) - 4),
            new PIXI.Point(this.width / 2 , this.height - 8),
            new PIXI.Point(0 , (this.height / 2) - 4),
        ])

        this.addListener('pointerover', () => {
            this.texture = this.$textures.hover
        }).addListener('pointerout', () => {
            this.texture = this.$textures.default
        })

        this.$position.toPoint().copyTo(this.position)
    }

    private generateTexture () {
        if (FloorBlock.$textureCache) return FloorBlock.$textureCache

        const floor = new Cube({
            depth: 32,
            height: 8,
            width: 32
        })
        
        const borderStroke = new PIXI.Polygon([
            new IsoPoint(1, 31, 0).toPoint(),
            new IsoPoint(1, 1, 0).toPoint(),
            new IsoPoint(31, 1, 0).toPoint(),
        ])

        borderStroke.closeStroke = false

        floor.lineStyle(2, 0x000000, .05)
        floor.drawShape(borderStroke)

        return FloorBlock.$textureCache = this.$app.renderer.generateTexture(floor, SCALE_MODES.NEAREST, 1)
    }
}