interface DebugAreaOptions {
    borderColor?: number
    borderWidth?: number
    borderOpacity?: number
    background?: number
    backgroundOpacity?: number
}

interface DebugSpriteOptions {
    hitArea?: DebugAreaOptions
    dimensions?: DebugAreaOptions
}

export class Debug {
    static hitArea(sprite: PIXI.Sprite, options: DebugAreaOptions = {}) {
        if (!sprite.hitArea) return this
        options = Object.assign(
            {
                borderColor: 0x00ffff,
                borderWidth: 2,
                borderOpacity: 0.75,
                background: 0x00ffff,
                backgroundOpacity: 0.25,
            },
            options,
        )

        const area = new PIXI.Graphics()

        area.lineStyle(options.borderWidth, options.borderColor, options.borderOpacity)
        area.beginFill(options.background, options.backgroundOpacity)
        area.drawShape(sprite.hitArea)
        area.endFill()

        sprite.addChild(area)

        // @ts-ignore
        sprite.$__DEBUG_HIT_AREA_ = area

        return this
    }

    static rect(sprite: PIXI.Container, options?: DebugAreaOptions) {
        options = Object.assign(
            {
                borderColor: 0x00ff00,
                borderWidth: 2,
                borderOpacity: 0.75,
                background: 0xff0000,
                backgroundOpacity: 0,
            },
            options,
        )

        const rect = sprite.getBounds()

        const area = new PIXI.Graphics()

        area.lineStyle(options.borderWidth, options.borderColor, options.borderOpacity)
        area.beginFill(options.background, options.backgroundOpacity)
        area.drawRect(rect.x, rect.y, rect.width, rect.height)
        area.endFill()

        sprite.addChild(area)

        // @ts-ignore
        sprite.$__DEBUG_RECT__ = area

        return this
    }

    static clear(sprite: PIXI.Container) {
        // @ts-ignore
        sprite.removeChild(sprite.$__DEBUG_RECT__, sprite.$__DEBUG_HIT_AREA_)
    }

    static sprite(sprite: PIXI.Sprite, options: DebugSpriteOptions = {}) {
        this.rect(sprite, options.dimensions)

        if (sprite.hitArea) this.hitArea(sprite, options.hitArea)
    }
}
