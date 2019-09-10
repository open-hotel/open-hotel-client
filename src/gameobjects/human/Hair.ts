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
    super('hrb', 'human/hair', getDefaultAssetDefinition(assetProps), assetProps.prefix)
    this.sprite.tint = 0x905424
  }

  protected getAnimation(action: string, direction: number) {
    const animation = super.getAnimation(action, direction)
    if (!animation.length) {
      return super.getAnimation(action, direction, 'hr')
    }
    return animation
  }
}
