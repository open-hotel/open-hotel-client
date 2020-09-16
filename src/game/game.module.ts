import { Module, Inject } from 'injets'
import { PixiModule } from './pixi/pixi.module'
import { ImagerModule } from './imager/imager.module'
import { RoomModule } from './room/room.module'
import { Loader } from '../engine/loader'
import { SoundModule } from './sound/sound.module'

@Module({
  imports: [
    PixiModule,
    ImagerModule,
    RoomModule,
    SoundModule
  ],
})
export class GameModule {
  @Inject()
  loader: Loader
}
