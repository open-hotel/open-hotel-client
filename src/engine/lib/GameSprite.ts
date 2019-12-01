import { GameObject } from './GameObject'

export interface GameEntityAttrs {
  lib: string
  type: number | null
  action: string
  direction: number
}

export class GameEntity<T extends GameEntityAttrs> extends GameObject<T> {
  public sprite: PIXI.AnimatedSprite
  protected sheet: PIXI.Spritesheet

  constructor(
    protected part: string,
    protected resourcePath: string,
    attrs: T
  ) {
    super(attrs)

    this.updateSheet()
    
    this.sprite = new PIXI.AnimatedSprite(this.getAnimation(attrs.action, attrs.direction))

    this.sprite.loop = true
    this.sprite.animationSpeed = 1 / 8

    this.attrs.watch('type', () => {
      this.updateSheet()
      this.updateTexture()
    })
    
    this.attrs.watch('action', () => this.updateTexture())
    this.attrs.watch('direction', () => this.updateTexture())

    this.addChild(this.sprite)
  }

  static getResourceName (
    lib: string,
    action: string = 'std',
    part: string,
    type: number = 1, 
    rot: number = 0,
    frame?: number
  ) {
    const name: any[] = [lib, action, part]

    if (type) name.push(type)
    if (rot >= 0 && rot <= 7) name.push(rot)
    if (typeof frame === 'number') name.push(frame)
    
    return name.join('_')
  }

  protected getAnimation(action: string, direction: number, part = this.part): PIXI.Texture[] {
    if (!this.sheet) return [PIXI.Texture.EMPTY]

    const { animations, textures } = this.sheet
    const { type } = this.attrs

    const animationName = GameEntity.getResourceName(this.attrs.lib, action, part, type, direction)
    const animation = animations[animationName]

    if (animation) return animation
    
    const frameName = `${animationName}_0.png`
    const texture = textures[frameName]
    
    if (texture) return [texture]

    if (action === 'std') return [PIXI.Texture.EMPTY]

    return this.getAnimation('std', 0)
  }

  protected updateSheet() {
    const { type } = this.attrs
    const path = type !== null ? `${this.resourcePath}/${type}` : this.resourcePath
    this.sheet = this.app.getSpriteSheet(path)
  }

  updateTexture() {
    const { action, direction } = this.attrs
    const animation = this.getAnimation(action, direction)

    this.sprite.visible = true
    this.sprite.textures = animation

    this.sprite.play()
  }
}
