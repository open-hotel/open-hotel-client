import { RequestOptions, ResponseOptions } from './adapter.interface'

export interface LoaderResource {
  name: string
  parsers?: string[]
  request: RequestOptions
  response?: ResponseOptions
  onResolve(data: any): void
  onReject(error: Error): void
}

export interface LoaderResourceRequest {
  name: string
  url: string
  parsers?: string[]
}
