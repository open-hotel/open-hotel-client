import { GameObject } from './GameObject'

interface GameEntityAttrs {
  type: number
  prefix: string
  action: string
  direction: number
}

export class GameEntity<T extends GameEntityAttrs> extends GameObject<T> {
  public sprite: PIXI.AnimatedSprite
  protected sheet: PIXI.Spritesheet

  constructor(protected layerName: string, protected resourcePath: string, attrs: GameEntityAttrs & T) {
    super(attrs)
    this.updateSheet()
    this.sprite = new PIXI.AnimatedSprite(this.getAnimation(attrs.action, attrs.direction))
    this.sprite.loop = true
    this.sprite.animationSpeed = 1 / 8
    this.sprite.onFrameChange = () => this.updateAnchor()

    this.attrs2.watch('type', () => {
      this.updateSheet()
      this.updateTexture()
    })
    this.attrs2.watch('action', () => this.updateTexture())
    this.attrs2.watch('direction', () => this.updateTexture())
    this.addChild(this.sprite)
  }

  private updateAnchor() {
    const animation = this.sprite && this.sprite.texture
    if (!animation) {
      return
    }
    const { defaultAnchor } = animation
    this.sprite.anchor.set(defaultAnchor.x, defaultAnchor.y)
  }

  protected getAnimation(action: string, direction: number, layerName = this.layerName): PIXI.Texture[] {
    const { animations, textures } = this.sheet
    const { type } = this.attrs2
    const animationName = `${this.attrs2.prefix}_${action}_${layerName}_${type}_${direction}`

    const frameName = `${animationName}_0.png`

    if (animationName in animations) return animations[animationName]
    else if (frameName in textures) return [textures[frameName]]
    else if (action === 'std') return []
    return this.getAnimation('std', 0)
  }

  protected updateSheet() {
    this.sheet = this.app.getSpriteSheet(`${this.resourcePath}/${this.attrs2.type}`)
  }

  updateTexture() {
    let { action, direction } = this.attrs2
    const animation = this.getAnimation(action, direction)
    if (animation.length) {
      this.sprite.visible = true
      this.sprite.textures = animation
    } else {
      this.sprite.visible = false
    }
    this.sprite.play()
  }
}
