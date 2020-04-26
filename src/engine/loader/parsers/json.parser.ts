import { Parser } from '../parser.interface'
import { ResponseOptions } from '../adapter.interface'
import { LoaderResource } from '../resource.interface'
import { Loader } from '../Loader'

declare module '../resource.interface' {
  export interface LoaderResource {
    json: any
  }
}

export class JsonParser implements Parser {
  async parse(resource: LoaderResource, loader: Loader): Promise<object> {
    const result = await loader.adapter.readAsJSON(
      resource.response as ResponseOptions
    )
    resource.json = result

    return result
  }
}
