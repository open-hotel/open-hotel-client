import { HumanLayer, HumanAsset, getDefaultAssetDefinition } from './HumanLayer'

export class HumanEyes extends HumanLayer {
  private last_action

  constructor(attrs: HumanAsset) {
    super('ey', 'human/face', getDefaultAssetDefinition(attrs), 'hh_human_face_h')
    this.sprite.tint = 0xffffff
    this.sprite.zIndex = 100000
  }

  close() {
    this.last_action = this.attrs2.action
    this.attrs2.action = 'eyb'
    return this
  }

  open() {
    this.attrs2.action = this.last_action
    return this
  }

  blink(time = 500) {
    this.close()
    setTimeout(() => this.open(), time)
  }
}
