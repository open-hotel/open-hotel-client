import { Application } from "../../engine/Application";
import { Debug } from "../../engine/lib/utils/Debug";
import { Polygon, ObservablePoint } from "pixi.js";
import { IsoPoint } from "../../engine/lib/IsoPoint";

export class FloorBlock extends PIXI.Sprite {
    private $app: Application;
    
    public isoZ = 0

    private $textures:{ [key:string]: PIXI.Texture } = {
        default: null,
        hover  : null
    }

    get iso () {
        return IsoPoint.from(new PIXI.Point(this.x, this.y), false, this.isoZ)
    }

    set iso (v:IsoPoint) {
        this.isoZ = v.z
        v.toPoint().copyTo(this.position)
    }

    constructor () {
        super()

        this.$app = Application.get()

        this.$textures.default = this.$app.loader.resources.floor.texture
        this.$textures.hover = this.$app.loader.resources.floor_selected.texture

        this.texture = this.$textures.default
        this.interactive = true

        const size = this.height - 8
        const left = this.width / 4
        const top = this.height / 4

        this.hitArea = new Polygon([
            new PIXI.Point(this.width / 2, 0),
            new PIXI.Point(this.width, (this.height / 2) - 4),
            new PIXI.Point(this.width / 2 , this.height - 8),
            new PIXI.Point(0 , (this.height / 2) - 4),
        ])

        console.log(this.$textures.default.width, this.$textures.default.height)

        this.addListener('mouseover', () => {
            this.texture = this.$textures.hover
        }).addListener('mouseout', () => {
            this.texture = this.$textures.default
        })
    }
}