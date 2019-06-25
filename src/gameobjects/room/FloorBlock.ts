import { Application } from "../../engine/Application";
import { Polygon, SCALE_MODES } from "pixi.js";
import { IsoPoint } from "../../engine/lib/IsoPoint";

export class FloorBlock extends PIXI.Sprite {
    private $app: Application;
    
    public isoZ = 0

    private $textures:{ [key:string]: PIXI.Texture } = {
        default: null,
        hover  : null
    }

    constructor () {
        super()

        this.$app = Application.get()

        this.$textures.default = this.$app.loader.resources.floor.texture
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
    }
}