import { RequestOptions, LoaderResponse } from './adapter.interface'

export interface LoaderResource {
  name: string
  parsers?: string[]
  request: RequestOptions
  response?: LoaderResponse
  onResolve(data: any): void
  onReject(error: Error): void
}

export interface LoaderResourceRequest {
  name: string
  url: string
  parsers?: string[]
}
