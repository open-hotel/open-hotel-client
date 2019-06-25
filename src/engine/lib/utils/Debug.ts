type DebugAreaOptions = {
    borderColor?: number,
    borderWidth?: number,
    borderOpacity?: number,
    background?: number,
    backgroundOpacity?: number
}

type DebugSpriteOptions = {
    hitArea?: DebugAreaOptions,
    dimensions?: DebugAreaOptions,
}

type DebugRectLike = {
    x: number,
    y: number,
    width: number,
    height: number
}

export class Debug {
    static hitArea (sprite: PIXI.Sprite, options:DebugAreaOptions = {}) {
        options = Object.assign({
            borderColor: 0x00FFFF,
            borderWidth: 2,
            borderOpacity: .75,
            background: 0x00FFFF,
            backgroundOpacity: .25
        }, options)

        const area = new PIXI.Graphics()

        area.lineStyle(options.borderWidth, options.borderColor, options.borderOpacity)
        area.beginFill(options.background, options.backgroundOpacity)
        area.drawShape(sprite.hitArea)
        area.endFill()

        sprite.addChild(area)

        return this
    }

    static rect (
        sprite: DebugRectLike & { addChild:Function },
        options?: DebugAreaOptions
    ) {
        options = Object.assign({
            borderColor: 0x00FF00,
            borderWidth: 2,
            borderOpacity: .75,
            background: 0xFF0000,
            backgroundOpacity: 0
        }, options)

        const area = new PIXI.Graphics()

        area.lineStyle(options.borderWidth, options.borderColor, options.borderOpacity)
        area.beginFill(options.background, options.backgroundOpacity)
        area.drawRect(sprite.x, sprite.y, sprite.width, sprite.height)
        area.endFill()

        sprite.addChild(area)

        return this
    }

    static sprite(sprite: PIXI.Sprite, options: DebugSpriteOptions = {}) {
        this.rect(sprite, options.dimensions)
        
        if(sprite.hitArea) this.hitArea(sprite, options.hitArea)
    }
}