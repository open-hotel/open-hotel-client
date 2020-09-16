import { Module } from 'injets'
import { AvatarImager } from './avatar'
import { RoomImager } from './room.imager'

@Module({
  providers: [AvatarImager, RoomImager],
  exports: [AvatarImager, RoomImager],
})
export class ImagerModule {}
