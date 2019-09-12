export interface MobiDefinition<StateType = any> {
  area: Array<number[]>
  canLay: boolean
  canSit: boolean
  canStack: boolean
  canWalk: boolean
  currentState: StateType
  id: number
  possibleStates: StateType[]
  type: 'floor' | 'wall'
  name: string
}

export interface IRoomMap {
  map: Array<number[]>
  mobis?: MobiDefinition[]
  door: {
    coordinates: [number, number]
    direction: 0 | 2 | 4 | 6
  }
}
