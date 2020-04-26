import { LoaderResource } from './resource.interface'
import { Loader } from './Loader'

export interface Parser {
  setup?(loader: Loader): void
  parse(resource: LoaderResource, loader: Loader): Promise<any>
}
