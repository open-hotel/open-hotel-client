import { Module } from 'injets'
import { ImagerModule } from '../imager/imager.module'
import { RoomProvider } from './room.provider'
import { RoomEngine } from './Room.engine'

@Module({
  imports: [ImagerModule],
  providers: [RoomProvider, RoomEngine],
  exports: [RoomProvider, RoomEngine],
})
export class RoomModule {}
