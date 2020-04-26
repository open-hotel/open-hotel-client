import { Texture } from 'pixi.js'
import { Parser } from '../parser.interface'
import { ResponseOptions } from '../adapter.interface'
import { LoaderResource } from '../resource.interface'
import { Loader } from '../Loader'

declare module '../resource.interface' {
  export interface LoaderResource {
    texture: object
  }
}

export class TextureParser implements Parser {
  async parse(resource: LoaderResource, loader: Loader): Promise<object> {
    const result = await loader.adapter.readAsBlob(
      resource.response as ResponseOptions
    )
    const img = new Image()
    img.src = URL.createObjectURL(result)
    resource.texture = Texture.fromLoader(
      img,
      resource.request.url,
      resource.name
    )
    return result
  }
}
