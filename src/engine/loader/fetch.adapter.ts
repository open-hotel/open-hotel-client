import { LoaderAdapter, RequestOptions, LoaderResponse } from './adapter.interface'

class FetchResponse implements LoaderResponse {
  constructor(private readonly response: Response) {}

  get status() {
    return this.response.status
  }

  get headers() {
    const headers: Record<string, any> = {}

    this.response.headers.forEach((value, key) => {
      headers[key.toLocaleLowerCase()] = value
    })
    return headers
  }

  text(): Promise<string> {
    return this.response.text()
  }

  json(): Promise<any> {
    return this.response.json()
  }

  blob(): Promise<Blob> {
    return this.response.blob()
  }
}

export class FetchAdapter implements LoaderAdapter {
  async request(request: RequestOptions): Promise<LoaderResponse> {
    const headers = new Headers()

    for (let [key, value] of Object.entries(request.headers || {})) {
      headers.set(key, value)
    }

    return fetch(request.url, {
      method: request.method,
      headers,
      body: request.data,
      redirect: 'follow',
    }).then(async response => new FetchResponse(response))
  }
}
