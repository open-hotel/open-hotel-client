import { Module } from 'injets'
import { HumanImager } from './human.imager'
import { RoomImager } from './room.imager'

@Module({
  providers: [HumanImager, RoomImager],
  exports: [HumanImager, RoomImager],
})
export class ImagerModule {}
