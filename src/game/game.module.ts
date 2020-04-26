import { Module, OnModuleInit, Inject } from 'injets'
import { PixiModule } from './pixi/pixi.module'
import { ImagerModule } from './imager/imager.module'
import { JsonParser } from '../engine/loader'
import { Loader } from '../engine/loader'
import { ApplicationProvider } from './applicaiton.provider'

@Module({
  imports: [
    PixiModule.forRoot({
      view: document.getElementById('game') as HTMLCanvasElement,
    }),
    ImagerModule,
    //Loader
  ],
  providers: [
    {
      provide: 'LOADER',
      useValue: new Loader({
        concurently: 1,
        baseURL: process.env.RESOURCES_BASE,
        parsers: {
          json: new JsonParser()
        }
      }),
    },
    ApplicationProvider
  ],
})
export class GameModule implements OnModuleInit {
  // @Inject() readonly loader: Loader

  onModuleInit() {
   
  }
}
