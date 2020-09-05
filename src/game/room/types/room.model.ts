import { Matrix } from "../../../engine/lib/util/Matrix";
import { PointLike } from "../../../engine/lib/util/Walk";
import { RoomUserOptions } from "../users/RoomUser";

export interface RoomModel {
  door?: PointLike
  heightmap: Matrix<number>
  roomUserDictionary: Record<string, RoomUserOptions>
}
