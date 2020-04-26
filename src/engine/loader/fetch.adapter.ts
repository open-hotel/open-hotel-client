import {
  LoaderAdapter,
  RequestOptions,
  ResponseOptions
} from './adapter.interface'

export class FetchAdapter implements LoaderAdapter {
  async readAsText(response: ResponseOptions<Response>): Promise<string> {
    return response.data.text()
  }

  async readAsJSON(response: ResponseOptions<Response>): Promise<object> {
    return response.data.json()
  }

  async readAsBlob(response: ResponseOptions<any>): Promise<Blob> {
    return response.data.blob()
  }

  async request(request: RequestOptions): Promise<ResponseOptions> {
    const headers = new Headers()

    for (let [key, value] of Object.entries(request.headers || {})) {
      headers.set(key, value)
    }

    return fetch(request.url, {
      method: request.method,
      headers,
      body: request.data,
      redirect: 'follow'
    }).then(async response => {
      return {
        data: response,
        headers: response.headers,
        status: response.status
      }
    })
  }
}
