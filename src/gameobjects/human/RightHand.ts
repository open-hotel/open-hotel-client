import { HumanLayer } from "./HumanLayer";
import { Debug } from "../../engine/lib/utils/Debug";

interface HandRightProps {
  type: number,
  direction: number,
  action: string
}

export class HumanRightHand extends HumanLayer {
  static flips: {[k:number]: number} = {
    4: 2,
    5: 1,
    6: 0
  }

  constructor (attrs:HandRightProps) {
    super('rh', 'human/right_hand', attrs)
    
    this.sprite.anchor.set(.75, .25)

    this.sprite.onFrameChange = (f) => {
      if(f === 3) {
        this.sprite.anchor.set(.5, 0)
      }
      // else {
      //   this.sprite.anchor.set(.75, 0)
      // }
    }
  }
}