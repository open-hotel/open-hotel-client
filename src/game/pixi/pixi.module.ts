import { Module } from 'injets'
import { Loader, JsonParser, SpritesheetParser } from '../../engine/loader'
import { ApplicationProvider } from './application.provider'
import { LibaryParser } from '../../engine/loader/parsers/library.parser'

@Module(
  {
    global: true,
    providers: [
      {
        provide: Loader,
        useValue: new Loader({
          concurently: 20,
          baseURL: process.env.RESOURCES_BASE,
        }),
      },
      ApplicationProvider,
    ],
    exports: [ApplicationProvider, Loader],
  }
)
export class PixiModule {}
