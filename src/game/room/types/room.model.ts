import { Matrix } from "../../../engine/lib/util/Matrix";
import { PointLike } from "../wall/WallRenderer";
import { IUserModel } from "../../users/types";

export interface RoomModel {
  door?: PointLike
  heightmap: Matrix<number>
  roomUserDictionary: Record<string, IUserModel>
}
