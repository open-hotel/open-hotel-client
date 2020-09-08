import { Texture } from 'pixi.js'
import { LoaderMiddleware } from '../parser.interface'
import { LoaderResource } from '../resource'

declare module '../resource' {
  export interface LoaderResource {
    texture?: PIXI.Texture
  }
}

export class TextureParser implements LoaderMiddleware {
  priority = 1

  async use(resource: LoaderResource): Promise<void> {
    if (!String(resource.response.headers['content-type'] || '').startsWith('image/')) {
      return
    }
    return new Promise(async (resolve, reject) => {
      const blob = await resource.response.blob()
      const img = new Image()

      img.src = window.URL.createObjectURL(blob)

      img.onload = () => {
        resource.texture = Texture.fromLoader(img, resource.request.url, resource.name)
        window.URL.revokeObjectURL(img.src)
        resolve()
      }
    })
  }
}
