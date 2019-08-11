// import { Application } from "../engine/Application";
// import { SCALE_MODES } from "pixi.js";

export interface ProgressOptions {
    width?: number;
    height?: number;
    value?: number;
}
export class Progress extends PIXI.Container {
    private $options: ProgressOptions
    private $bar: PIXI.Graphics
    private $text: PIXI.Text

    constructor (options: ProgressOptions) {
        super()

        this.$options = Object.assign({
            width: 320,
            height: 32,
            value: .25
        }, options)
        
        this.createBg()
    }

    get value () {
        return Math.min(Math.max(this.$options.value, 0), 1)
    }
    
    set value (v) {
        this.$options.value = Math.min(Math.max(v, 0), 1)
        this.update()
    }

    get progress () {
        return Math.floor(this.value * 100) + '%'
    }

    private createBg (){
        const OUTLINE = 2
        
        const text = this.$text = new PIXI.Text(this.progress, new PIXI.TextStyle({
            fontSize: 18,
            fill: '#FFFFFF',
            fontWeight: 'bolder'
        }))

        const bg = new PIXI.Graphics()
        
        bg.lineStyle(OUTLINE, 0xFFFFFF, .82)
        bg.drawRoundedRect(0, 0, this.$options.width - 2, this.$options.height - 2, 3)

        // FILL BAR
        const margin = 3
        const COLOR_TOP = 0xBACAD3
        const COLOR_BOTTOM = 0x8CA1AD

        const bar = this.$bar = new PIXI.Graphics()

        bar.beginFill(COLOR_BOTTOM, 1)
        bar.drawRect(
            0,
            0,
            this.$options.width,
            this.$options.height,
        )
        bar.endFill()

        bar.beginFill(COLOR_TOP, 1)
        bar.drawRect(
            0,
            0,
            this.$options.width,
            this.$options.height / 2,
        )
        bar.endFill()

        bar.x += margin + OUTLINE
        bar.y += margin + OUTLINE

        bar.width -= (margin + OUTLINE) * 2
        bar.height -= (margin + OUTLINE) * 2
        bar.width *= this.value

        text.x = this.$options.width / 2
        text.y = bg.height + 8
        text.pivot.set(text.width / 1, 0)

        this.addChild(bg, bar, text)
    }

    update () {
        this.$text.text = this.progress
        this.$bar.width = (this.$options.width - 10) * this.value
        this.$bar.pivot.set(0, 0)
    }
}