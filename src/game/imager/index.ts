import { RoomImager } from "./Room.imager";
import { HumanImager } from "./human/Human.imager";

export class Imager {
  public room = new RoomImager()
  public human = new HumanImager()
}