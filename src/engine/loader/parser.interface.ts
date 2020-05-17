import { LoaderResource } from './resource'
import { Loader } from './Loader'

export interface LoaderMiddleware {
  priority: number;
  pre?(resource: LoaderResource, loader?: Loader): Promise<any>
  use?(resource: LoaderResource, loader?: Loader): Promise<any>
}
