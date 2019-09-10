import { HumanLayer, HumanAsset, getDefaultAssetDefinition } from './HumanLayer'

export class HumanEyes extends HumanLayer {
  constructor(attrs: HumanAsset) {
    super('ey', 'human/face', getDefaultAssetDefinition(attrs), 'hh_human_face_h')
    this.sprite.tint = 0xffffff
    console.log(this)
    this.sprite.zIndex = 100000
  }
}
