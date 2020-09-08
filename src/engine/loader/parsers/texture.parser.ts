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

  // async pre (resource: LoaderResource) {
  //   resource.loaded = /\.(png|gif|jpe?g|)$/.test(resource.request.url)
  //   if (resource.loaded) await this.createTexture(resource)
  // }

  createTexture(resource: LoaderResource) {
    return new Promise<void>(async (resolve, reject) => {
      const img = new Image()
      
      img.src = resource.request.url
      img.crossOrigin = resource.options?.crossOrigin ?? 'anonymous'
      
      img.onerror = () => reject(new Error(`Failed to load image ${resource.request.url}`))
      img.onload = () => {
        resource.texture = Texture.fromLoader(img, resource.request.url, resource.name)
        resolve()
      }
    })
  }

  async use(resource: LoaderResource): Promise<void> {
    if (!resource.texture && String(resource.response.headers['content-type'] || '').startsWith('image/')) {
      return this.createTexture(resource)
    }
  }
}
