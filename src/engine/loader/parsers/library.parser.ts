import { LoaderMiddleware } from '../parser.interface'
import { Loader } from '../Loader'
import { SpritesheetParser } from './spritesheet.parser'
import { LoaderResource } from '../resource'

declare module '../resource' {
  export interface LoaderResource {
    manifest?: any
  }
}

export class LibaryParser implements LoaderMiddleware {
  priority = 10

  async use(resource: LoaderResource, loader: Loader): Promise<any> {
    if (resource?.json?.manifest) {
      resource.manifest = resource.json.manifest

      if ('spritesheet' in resource.json) {
        resource.spritesheet = await SpritesheetParser.fromJSON(resource.json.spritesheet, loader, resource)
      }
    }
  }
}
