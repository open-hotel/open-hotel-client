import { GameObject } from '../../engine/lib/GameObject'
import { Debug } from '../../engine/lib/utils/Debug'
import { HumanAnimation } from './HumanAnimation'

interface HumanLayerProps {
  type: number
  direction: number
  action: string
}

export abstract class HumanLayer extends GameObject<HumanLayerProps> {
  static flips: {
    [k: number]: number
  } = {
    4: 2,
    5: 1,
    6: 0,
  }

  public sprite: PIXI.AnimatedSprite
  protected sheet: PIXI.Spritesheet
  protected humanAnimation: HumanAnimation

  constructor(
    private layerName: string,
    private resourcePath: string,
    attrs: HumanLayerProps = {
      type: 1,
      action: 'std',
      direction: 0,
    },
    private prefix: string = 'hh_human_body_h',
  ) {
    super({
      type: attrs.type,
      action: attrs.action,
      direction: attrs.direction,
    })
    this.updateSheet()

    this.sprite = new PIXI.AnimatedSprite(this.getAnimation(attrs.action, attrs.direction))
    this.sprite.loop = true
    this.sprite.animationSpeed = 1 / 6
    this.attrs2.watch('type', () => {
      this.updateSheet()
      this.updateTexture()
    })
    this.attrs2.watch('action', () => this.updateTexture())
    this.attrs2.watch('direction', () => this.updateTexture())
    this.updateFlip()
    this.addChild(this.sprite)
    this.humanAnimation = new HumanAnimation(this)
  }

  private updateSheet() {
    this.sheet = this.app.getSpriteSheet(`${this.resourcePath}/${this.attrs2.type}`)
  }

  protected getAnimation(action: string, direction: number): PIXI.Texture[] {
    const { animations, textures } = this.sheet
    const { type } = this.attrs2
    const flip = HumanLayer.flips[direction] >= 0
    const flipedDirection = flip ? HumanLayer.flips[direction] : direction
    const animationName = `${this.prefix}_${action}_${this.layerName}_${type}_${flipedDirection}`
    const frameName = `${animationName}_0.png`

    if (animationName in animations) return animations[animationName]
    else if (frameName in textures) return [textures[frameName]]
    else if (action === 'std') return []
    return this.getAnimation('std', 0)
  }

  /**
   * Shorthand for HumanLayer.prototype.sprite.anchor.set(x, y)
   */
  protected anchors(x: number, y: number) {
    this.sprite.anchor.set(x, y)
  }

  /**
   * Returns a callback that calls HumanLayer.prototype.anchors
   */
  protected anchorsC(x: number, y: number) {
    return () => this.anchors(x, y)
  }

  updateTexture() {
    let { action, direction } = this.attrs2
    const animation = this.getAnimation(action, direction)
    if (animation.length) {
      this.sprite.textures = animation
    }
    this.sprite.play()

    this.updateFlip()
  }

  updateFlip(useValue?: boolean) {
    let { direction } = this.attrs2
    const flip = typeof useValue === 'boolean' ? useValue : HumanLayer.flips[direction] >= 0
    if (flip) this.sprite.scale.set(-1, 1)
    else this.sprite.scale.set(1)
  }

  render(renderer: PIXI.Renderer) {
    Debug.anchor(this)
    return super.render(renderer)
  }
}
