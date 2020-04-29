import { Module } from 'injets'
import { Loader, JsonParser } from '../../engine/loader'
import { ApplicationProvider } from './application.provider'

@Module(
  {
    global: true,
    providers: [
      {
        provide: Loader,
        useValue: new Loader({
          concurently: 20,
          baseURL: process.env.RESOURCES_BASE,
          parsers: {
            json: new JsonParser()
          }
        }),
      },
      ApplicationProvider,
    ],
    exports: [ApplicationProvider, Loader],
  }
)
export class PixiModule {}
