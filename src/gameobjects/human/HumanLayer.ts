import * as PIXI from 'pixi.js'
import { GameObject } from '../../engine/lib/GameObject'
import { Debug } from '../../engine/lib/utils/Debug'
import { GameEntity } from '@/engine/lib/GameEntity'
// import { HumanAnimation } from './HumanAnimation'

interface HumanLayerProps {
  type: number
  direction: number
  action: string
}

export interface HumanAsset {
  type: number
  direction?: number
  action?: string
  prefix: string
}

export const getDefaultAssetDefinition = (asset: HumanAsset) => ({
  direction: asset.direction || 2,
  action: asset.action || 'std',
  type: asset.type,
})

export abstract class HumanLayer extends GameEntity<HumanLayerProps> {
  static flips: {
    [k: number]: number
  } = {
    4: 2,
    5: 1,
    6: 0,
  }

  constructor(
    protected layerName: string,
    protected resourcePath: string,
    attrs: HumanLayerProps = {
      type: 1,
      action: 'std',
      direction: 0,
    },
    protected prefix: string = 'hh_human_body_h',
  ) {
    super(layerName, resourcePath, {
      prefix: prefix,
      type: attrs.type,
      action: attrs.action,
      direction: attrs.direction,
    })
    this.updateFlip()
    this.sprite.tint = 0xffe0bd
  }

  protected getAnimation(action: string, direction: number, layerName = this.layerName): PIXI.Texture[] {
    const flip = HumanLayer.flips[direction] >= 0
    const flipedDirection = flip ? HumanLayer.flips[direction] : direction
    return super.getAnimation(action, flipedDirection, layerName)
  }

  updateTexture() {
    super.updateTexture()
    this.updateFlip()
  }

  updateFlip(useValue?: boolean) {
    let { direction } = this.attrs2
    const flip = typeof useValue === 'boolean' ? useValue : HumanLayer.flips[direction] >= 0
    if (flip) this.sprite.scale.set(-1, 1)
    else this.sprite.scale.set(1)
  }
}
