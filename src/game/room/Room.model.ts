import { Matrix } from "../../engine/lib/util/Matrix";

export type RoomFloorHeight = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export class RoomModel {
  constructor (
    public map: Matrix<RoomFloorHeight>,
    public doorX: number,
    public doorY: number
  ) {}

  isValidTile (x: number, y:number) {
    return this.map.get(x, y, 0) !== 0
  }
}