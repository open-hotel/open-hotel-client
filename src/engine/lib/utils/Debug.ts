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
  static hitArea(sprite: PIXI.Sprite | PIXI.Container, options: DebugAreaOptions = {}) {
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
    sprite.$__DEBUG_HIT_AREA__ = area

    return this
  }

  static anchor(sprite: PIXI.Sprite) {
    const point = new PIXI.Graphics()

    point.beginFill(0x0000ff)
    point.drawCircle(sprite.anchor.x - 2, sprite.anchor.y - 2, 2)
    point.endFill()
    sprite.addChild(point)

    // @ts-ignore
    sprite.$__DEBUG_ANCHOR__ = point
  }

  static rect(sprite: PIXI.Container, options?: DebugAreaOptions) {
    options = Object.assign(
      {
        borderColor: 0xff0000,
        borderWidth: 1,
        borderOpacity: 0.75,
        background: 0xff0000,
        backgroundOpacity: 0,
      },
      options,
    )

    const { x, y, width, height } = sprite.getLocalBounds()

    const area = new PIXI.Graphics()

    area.lineStyle(options.borderWidth, options.borderColor, options.borderOpacity)
    area.beginFill(options.background, options.backgroundOpacity)
    area.drawRect(x, y, width, height)
    area.endFill()

    sprite.addChild(area)

    // @ts-ignore
    sprite.$__DEBUG_RECT__ = area

    return this
  }

  static clear(
    sprite: PIXI.Container & {
      $__DEBUG_RECT__?: any
      $__DEBUG_HIT_AREA__?: any
      $__DEBUG_ANCHOR__?: any
    },
  ) {
    sprite.removeChild(sprite.$__DEBUG_RECT__, sprite.$__DEBUG_HIT_AREA__, sprite.$__DEBUG_ANCHOR__)
  }

  static sprite(sprite: PIXI.Sprite, options: DebugSpriteOptions = {}) {
    this.clear(sprite)
    this.rect(sprite, options.dimensions)
    this.anchor(sprite)

    if (sprite.hitArea) this.hitArea(sprite, options.hitArea)
  }
}
