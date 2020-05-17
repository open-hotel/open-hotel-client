import { LoaderMiddleware } from '../parser.interface'
import { LoaderResource } from '../resource'

declare module '../resource' {
  export interface LoaderResource {
    json?: any
  }
}

export class JsonParser implements LoaderMiddleware {
  priority = 0

  async use(resource: LoaderResource): Promise<any> {
    const type = String(resource.response.headers['content-type'] || '')
    if (type.startsWith('application/json') || type.startsWith('text/plain')) {
      resource.json = await resource.response.json()
    }
  }
}
