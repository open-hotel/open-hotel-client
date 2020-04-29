import { ServerEvent } from '../protocol/events/server.enum'
import { Subscribe } from '../decorators/subscribe.decorator'
import { NetworkPacket } from '../protocol/NetworkPacket'

export class GenericGateway {
  @Subscribe(ServerEvent.CONNECT)
  handleConnect(message: NetworkPacket<ServerEvent>) {
   
  }

  @Subscribe(ServerEvent.LOGIN_OK)
  handleLoginOk(message: NetworkPacket<ServerEvent>) {
    console.log('LOGIN OK: ', message)
  }
}
