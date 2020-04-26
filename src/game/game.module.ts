import { Module, OnModuleInit, Inject } from 'injets'
import { PixiModule } from './pixi/pixi.module'
import { ImagerModule } from './imager/imager.module'
import { Application } from '../engine/Application'
import { Loader } from '../engine/loader'

@Module({
  imports: [
    PixiModule.forRoot({
      view: document.getElementById('game') as HTMLCanvasElement,
    }),
    ImagerModule,
  ],
})
export class GameModule implements OnModuleInit {
  @Inject() readonly app: Application
  @Inject() readonly loader: Loader

  onModuleInit() {
    // Download assets
    this.loader.add(
      [
        { name: 'figuremap', url: 'figuremap.json', parsers: ['json'] },
        { name: 'figuredata', url: 'figuredata.json', parsers: ['json'] },
        { name: 'partsets', url: 'partsets.json', parsers: ['json'] },
        { name: 'draworder', url: 'draworder.json', parsers: ['json'] },
        { name: 'avatarActions', url: 'HabboAvatarActions.json', parsers: ['json'] },
        { name: 'geometry', url: 'geometry.json', parsers: ['json'] },
        { name: 'animations', url: 'animations.json', parsers: ['json'] },
        { name: 'effectmap', url: 'effectmap.json', parsers: ['json'] },
      ],
      (loaded, total) => console.log('Progresso', ((loaded / total) * 100).toFixed(1)+'%'),
    ).then(() => {
      console.log('Tudo foi carregado!', this.loader)
    })
  }
}
