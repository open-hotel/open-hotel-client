import { GameObject } from '../../engine/lib/GameObject'
import { FloorBlock } from '../room/FloorBlock'

export interface FurnitureAttrs<StateType = any> {
  id: boolean
  canSit: boolean
  canWalk: boolean
  canLay: boolean
  canStack: boolean
  type: 'wall' | 'floor'
  possibleStates: StateType[]
  currentState: StateType
  block: [number, number]
  name: string
}

export class Furniture<StateType = any> extends GameObject {
  public blockCoordinates = [0, 0]
  constructor(options: FurnitureAttrs<StateType>) {
    super(options)
    this.blockCoordinates = options.block
  }
}
