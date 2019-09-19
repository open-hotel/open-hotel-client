export class Api {
  constructor (public prefix: string) {

  }

  private async request<T> (method: string, url: string, data: any): Promise<T> {
    // TODO: figure out how to pass just these parameters to fetch
    // @ts-ignore
    const response = await fetch({
      method,
      url: `${process.env.VUE_APP_API_URL}/${this.prefix}/${url || ''}`,
      body: data
    })

    return response.json()
  }

  get<T> (url?: string, data?: any) {
    return this.request<T>('get', url, data)
  }

  post<T> (url?: string, data?: any) {
    return this.request<T>('post', url, data)
  }

  patch<T> (url?: string, data?: any) {
    return this.request<T>('patch', url, data)
  }

  put<T> (url?: string, data?: any) {
    return this.request<T>('put', url, data)
  }

  delete<T> (url?: string, data?: any) {
    return this.request<T>('delete', url, data)
  }

  static api: Api
}
