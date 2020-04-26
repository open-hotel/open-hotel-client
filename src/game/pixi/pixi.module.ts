import { DynamicModule, Module } from 'injets'
import { Application, ApplicationOptions } from '../../engine/Application'
import { Loader, JsonParser } from '../../engine/loader'

@Module({})
export class PixiModule {
  static forRoot(options?: ApplicationOptions): DynamicModule {
    return {
      module: this,
      global: true,
      providers: [
        {
          provide: Application,
          useValue: new Application(options),
        },
        {
          provide: Loader,
          useValue: new Loader({
            concurently: 1,
            baseURL: 'http://localhost:8888/dist',
            parsers: {
              json: new JsonParser()
            }
          }),
        },
      ],
      exports: [Application],
    }
  }
}
