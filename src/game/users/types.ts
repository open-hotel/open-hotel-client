import { HumanDirection } from "../imager/avatar/util/directions";

export interface IUserModel {
  id: string
  name: string
  motto?: string
  look: string
  action: string
  direction: HumanDirection
  head_direction: HumanDirection
  is_ghost?: boolean
  x: number
  y: number
  z: number
}