import { Module } from 'injets'
import { PixiModule } from './pixi/pixi.module'
import { ImagerModule } from './imager/imager.module'
import { RoomModule } from './room/room.module'

@Module({
  imports: [
    PixiModule,
    ImagerModule,
    RoomModule
  ],
})
export class GameModule {}
