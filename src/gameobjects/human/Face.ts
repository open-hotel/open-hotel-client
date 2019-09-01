import { HumanLayer, HumanAsset, getDefaultAssetDefinition } from './HumanLayer'

export class HumanFace extends HumanLayer {
  constructor(attrs: HumanAsset) {
    super('ey', 'human/face', getDefaultAssetDefinition(attrs), 'hh_human_face_h')

    const anim = this.humanAnimation

    // this.sprite.anchor.set(10, 10)

    // anim.turns({
    //   front: this.anchorsC(0.55, 0.9),
    //   right: this.anchorsC(0.66, 0.9),
    // })
  }
}
