import { Spritesheet } from 'pixi.js'
import { LoaderMiddleware } from '../parser.interface'
import { LoaderResource } from '../resource'
import { Loader } from '../Loader'

declare module '../resource' {
  export interface LoaderResource {
    spritesheet?: Spritesheet
  }
}

export class SpritesheetParser implements LoaderMiddleware {
  priority = 2

  static fromJSON(data: any, loader: Loader, resource: LoaderResource): Promise<Spritesheet> {
    return new Promise(async resolve => {
      const baseURL = resource.request.url.replace(/[^/]+$/, '')
      const imageResource = await loader.add(`${resource.name}_image`, `${baseURL}/${data.meta.image}`).wait()

      const spritesheet = new Spritesheet(imageResource.texture, data, resource.request.url)

      spritesheet.parse(() => resolve(spritesheet))
    })
  }

  async use(resource: LoaderResource, loader: Loader): Promise<any> {
    if (resource.json && resource.json.frames) {
      resource.spritesheet = await SpritesheetParser.fromJSON(resource.json, loader, resource)
    }
  }
}
