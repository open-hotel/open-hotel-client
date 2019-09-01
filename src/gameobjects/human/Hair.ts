import { HumanLayer, HumanAsset, getDefaultAssetDefinition } from './HumanLayer'

export const hairs: HumanAsset[] = [
  {
    prefix: 'hair_F_backbun_h',
    type: 2321,
  },
]

interface HairProps {
  direction: number
  action: string
}

export class HumanHair extends HumanLayer {
  constructor(private assetProps: HumanAsset = hairs[0]) {
    super('hr', 'human/hair', getDefaultAssetDefinition(assetProps), assetProps.prefix)

    const anim = this.humanAnimation

    anim.turns({
      front: this.anchorsC(0.55, 0.9),
      right: this.anchorsC(0.66, 0.9),
    })
  }
}
