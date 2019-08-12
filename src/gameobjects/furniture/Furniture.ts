import { GameObject } from '../../engine/lib/GameObject'

export interface FurnitureAttrs<StateType = any> {
  id: boolean
  canSit: boolean
  canWalk: boolean
  canLay: boolean
  canStack: boolean
  type: 'wall' | 'floor'
  possibleStates: StateType[]
  currentState: StateType
}

export class Furniture<StateType = any> extends GameObject {
  constructor(options: FurnitureAttrs<StateType>) {
    super(options)
  }
}
