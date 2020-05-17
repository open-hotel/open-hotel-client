export interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  url: string
  data?: any
  headers?: Record<string, any>
}

export interface LoaderResponse {
  status: number
  headers?: Record<string, any>
  text(): Promise<string>
  json(): Promise<any>
  blob(): Promise<Blob>
}

export interface LoaderAdapter {
  request(request: RequestOptions): Promise<LoaderResponse>
}
