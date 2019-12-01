import { NetworkPacket } from "../protocol/NetworkPacket";
import { ClientEvent } from "../protocol/events/client.enum";

export class MessageRequestUserMovement extends NetworkPacket<ClientEvent.REQUEST_MOVEMENT> {
  constructor (x:number, y: number) {
    super(ClientEvent.REQUEST_MOVEMENT, [x, y])
  }
}