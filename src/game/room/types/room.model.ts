import { Matrix } from "../../../engine/lib/util/Matrix";
import { PointLike } from "../../../engine/lib/util/Walk";

export interface RoomModel {
  door?: PointLike
  heightmap: Matrix<number>
  users: Record<string, any>
}
