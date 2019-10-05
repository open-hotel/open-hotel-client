import './ws/teste'

export class Api {
  constructor(protected prefix: string) {}

  private async request<T>(method: string, url: string, data: any): Promise<T> {
    console.log(process.env)
    if (process.env.VUE_APP_DUMMIES) {
      return (await import(`./dummies/${this.prefix}.dummy.ts`))[url]
    }
    const response = await fetch(`${process.env.VUE_APP_API_URL}/${this.prefix}/${url || ''}`, {
      method,
      body: data,
    })

    return response.json()
  }

  get<T>(url?: string, data?: any) {
    return this.request<T>('get', url, data)
  }

  post<T>(url?: string, data?: any) {
    return this.request<T>('post', url, data)
  }

  patch<T>(url?: string, data?: any) {
    return this.request<T>('patch', url, data)
  }

  put<T>(url?: string, data?: any) {
    return this.request<T>('put', url, data)
  }

  delete<T>(url?: string, data?: any) {
    return this.request<T>('delete', url, data)
  }

  static api: Api
}
