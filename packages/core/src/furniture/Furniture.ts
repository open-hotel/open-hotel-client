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

export interface FloorMobi<StateType = any> extends MobiDefinition<StateType> {
    type: 'floor'
}

export interface WallMobi<StateType = any> extends MobiDefinition<StateType> {
    type: 'wall'
    canLay: false
    canSit: false
    canWalk: false
}

