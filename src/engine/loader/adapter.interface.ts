export interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  url: string
  data?: any
  headers?: Record<string, any>
}

export interface ResponseOptions<T = any> {
  data: T
  status: number
  headers: Record<string, any>
}

export interface LoaderAdapter {
  request(request: RequestOptions): Promise<ResponseOptions>

  readAsText(response: ResponseOptions): Promise<string>
  readAsJSON(response: ResponseOptions): Promise<object>
  readAsBlob(response: ResponseOptions): Promise<Blob>
}
