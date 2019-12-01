
export interface IRoomMap {
  name: string
  map: Array<number[]>
  mobis?: any[]
  door: {
    coordinates: [number, number]
    direction: 0 | 2 | 4 | 6
  }
}
