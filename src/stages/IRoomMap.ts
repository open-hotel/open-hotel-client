interface MobiDefinition {
  area: Array<number[]>
  canLay: boolean
  canSit: boolean
  canStack: boolean
  canWalk: boolean
  currentState: number
  id: boolean
  possibleStates: number[]
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
