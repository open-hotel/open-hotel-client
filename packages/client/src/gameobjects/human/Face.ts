import { HumanLayer, getDefaultAssetDefinition, HumanAsset } from './HumanLayer'

export class HumanFace extends HumanLayer {
  constructor(attrs: HumanAsset) {
    super('fc', 'human/face', getDefaultAssetDefinition(attrs), 'hh_human_face_h')
  }
}
