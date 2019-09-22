import { MobiDefinition } from '@open-hotel/core'

export interface IRoomMap {
  name: string
  map: Array<number[]>
  mobis?: MobiDefinition[]
  door: {
    coordinates: [number, number]
    direction: 0 | 2 | 4 | 6
  }
}
