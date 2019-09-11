import { GameObject } from '../../engine/lib/GameObject'
import { FloorBlock } from '../room/FloorBlock'
import { MobiDefinition } from '@/stages/IRoomMap'

// export interface FurnitureAttrs<StateType = any> extends MobiDefinition {
//   id: boolean
//   canSit: boolean
//   canWalk: boolean
//   canLay: boolean
//   canStack: boolean
//   type: 'wall' | 'floor'
//   possibleStates: StateType[]
//   currentState: StateType
//   block: [number, number]
//   name: string
// }

export class Furniture<StateType = any> extends GameObject {
  public blockCoordinates = [0, 0]
  constructor(options: MobiDefinition<StateType>) {
    super(options)
    // this.blockCoordinates = options.
  }
}
