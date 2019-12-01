import io, { Socket as Client } from 'socket.io-client'
import { ServerEvent } from './protocol/events/server.enum'
import { ClientEvent } from './protocol/events/client.enum'
import { NetworkPacket } from './protocol/NetworkPacket'
import { Game } from '../Game'

export interface MessageHandler {
  event: ServerEvent
  handler: Function
}

export class NetworkManager {
  public io: typeof Client
  public game: Game

  constructor ({ game, gateways = [], url }) {
    this.game = game
    this.io = io(url)
    gateways.forEach(g => this.addGateway(g))
  }

  addGateway(Gateway) {
    
    const instance = new Gateway()
    instance.net = this
    const subscribers: Array<MessageHandler> = Reflect.getMetadata('net:incoming_subscribers', Gateway) || []
    subscribers.forEach((sub) => this.addHandler(sub))
    return this
  }

  addHandler (messageHandler: MessageHandler) {
    this.io.on(String(messageHandler.event), messageHandler.handler)
    return this
  }

  send (message: NetworkPacket<ClientEvent>) {
    this.io.emit(String(message.op), message.body)
  }
}
