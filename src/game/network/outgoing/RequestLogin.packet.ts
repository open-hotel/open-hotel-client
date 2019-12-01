import { NetworkPacket } from "../protocol/NetworkPacket";
import { ClientEvent } from "../protocol/events/client.enum";

export class RequestLoginPacket extends NetworkPacket<ClientEvent> {
  constructor (username: string, password: string) {
    super(ClientEvent.REQUEST_LOGIN, [username, password])
  }
}