import { Module, OnModuleInit, Inject } from 'injets'
import { PixiModule } from './pixi/pixi.module'
import { ImagerModule } from './imager/imager.module'
import { JsonParser } from '../engine/loader'
import { Loader } from '../engine/loader'
import { RoomProvider } from './room/room.provider'

@Module({
  imports: [
    PixiModule,
    ImagerModule,
    //Loader
  ],
  providers: [
    RoomProvider
  ],
})
export class GameModule implements OnModuleInit {
  // @Inject() readonly loader: Loader

  onModuleInit() {
   
  }
}
