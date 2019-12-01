import { ServerEvent } from '../protocol/events/server.enum'
import { Subscribe } from '../decorators/subscribe.decorator'
import { NetworkPacket } from '../protocol/NetworkPacket'
import { Game } from '../../Game'
import { RoomEngine } from '../../room/Room.engine'
import Room from '../../room/Room'
import { RoomModel, RoomFloorHeight } from '../../room/Room.model'
import { Matrix } from '../../../engine/lib/util/Matrix'

export class GenericGateway {
  @Subscribe(ServerEvent.CONNECT)
  handleConnect(message: NetworkPacket<ServerEvent>) {
    Game.current.app.$router.replace('room')
  }

  @Subscribe(ServerEvent.LOGIN_OK)
  handleLoginOk(message: NetworkPacket<ServerEvent>) {
    console.log('LOGIN OK: ', message)
  }
}
