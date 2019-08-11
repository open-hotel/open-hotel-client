import { HumanLayer } from "./HumanLayer";
import { Debug } from "../../engine/lib/utils/Debug";

interface HandLeftProps {
  type: number,
  direction: number,
  action: string
}

export class HumanLeftHand extends HumanLayer {
  static flips: {[k:number]: number} = {
    4: 2,
    5: 1,
    6: 0
  }

  constructor (attrs:HandLeftProps) {
    super('lh', 'human/left_hand', attrs)
    this.sprite.anchor.set(0, 0)

    this.sprite.onFrameChange = (f) => {
      // if(f === 3) {
      //   this.sprite.anchor.set(.75, 0)
      // } else {
      //   this.sprite.anchor.set(0, 0)
      // }
    }
  }
}