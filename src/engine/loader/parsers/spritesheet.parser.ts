import { Spritesheet, SpritesheetLoader } from 'pixi.js'
import { Parser } from '../parser.interface'
import { LoaderResource } from '../resource.interface'
import { Loader } from '../Loader'
import { JsonParser } from './json.parser'
import { TextureParser } from './texture.parser'

declare module '../resource.interface' {
  export interface LoaderResource {
    spritesheet: Spritesheet
  }
}

export class SpritesheetParser implements Parser {
  setup(loader: Loader) {
    loader.parser('json', new JsonParser())
    loader.parser('texture', new TextureParser())
  }

  async parse(resource: LoaderResource, loader: Loader): Promise<any> {
    return new Promise(async resolve => {
      await loader.parse('json', resource)
      const baseURL = resource.request.url.replace(/[^/]+$/, '')
      const imageResource = await loader.add({
        name: `${resource.name}_image`,
        url: `${baseURL}/${resource.json.meta.image}`,
        parsers: ['texture']
      })

      resource.spritesheet = new Spritesheet(
        imageResource.texture.baseTexture,
        resource.json
      )

      resource.spritesheet.parse(() => resolve(resource))
    })
  }
}
