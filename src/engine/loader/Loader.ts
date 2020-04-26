import { FetchAdapter } from './fetch.adapter'
import { Parser } from './parser.interface'
import { LoaderAdapter } from './adapter.interface'
import { LoaderResource, LoaderResourceRequest } from './resource.interface'
import urlJoin from 'url-join'

interface LoaderOptions {
  baseURL: string
  adapter: LoaderAdapter
  concurently: number
  parsers: Record<string, Parser>
}

type LoaderProgressCallback = (loaded: number, total: number) => void

function isURL(str: string) {
  try {
    new URL(str);
    return true
  } catch (_) {
    return false;  
  }
}

function joinURL (baseURL: string, url:string) {
  return isURL(url) ? url : urlJoin(baseURL, url)
}

export class Loader {
  private options: LoaderOptions
  private queue: LoaderResource[] = []
  private countLoading: number = 0
  private parsers: Record<string, Parser> = {}
  public adapter: LoaderAdapter
  public resources: Record<string, LoaderResource> = {}

  constructor(options: Partial<LoaderOptions> = {}) {
    this.options = Object.assign({ concurently: 10 }, options) as LoaderOptions
    this.adapter = this.options.adapter || new FetchAdapter()
    Object.assign(this.parsers, {}, options.parsers)
  }

  add(url: string): Promise<any>
  add(name: string, url: string): Promise<any>
  add(resource: LoaderResourceRequest): Promise<any>
  add(resources: LoaderResourceRequest[], cbProgress?: LoaderProgressCallback): Promise<any>
  add(
    urlOrNameOrResource: string | LoaderResourceRequest | LoaderResourceRequest[] | string[],
    url?: string | LoaderProgressCallback,
  ) {
    if (Array.isArray(urlOrNameOrResource)) {
      const resources = urlOrNameOrResource as LoaderResourceRequest[]
      const cbProgress = (url as LoaderProgressCallback) || (() => null)
      let loaded = 0
      const total = urlOrNameOrResource.length
      return Promise.all(resources.map(r => this.add(r).finally(() => cbProgress(++loaded, total))))
    }
    return new Promise((resolve, reject) => {
      let resourceRequest: LoaderResourceRequest

      if (typeof urlOrNameOrResource === 'string') {
        resourceRequest = {
          name: urlOrNameOrResource,
          url: url as string || urlOrNameOrResource,
        }
      } else {
        resourceRequest = urlOrNameOrResource
      }

      const resource = {
        ...resourceRequest,
        onResolve: resolve,
        onReject: reject,
        request: {
          method: 'GET',
          url: joinURL(this.options.baseURL, resourceRequest.url),
        },
      }

      this.queue.push((resource as unknown) as LoaderResource)
      this.loadMore()
    })
  }

  parser(name: string, parser: Parser) {
    this.parsers[name] = parser
    if (parser.setup) parser.setup(this)
    return this
  }

  private loadMore() {
    if (this.countLoading >= this.options.concurently) {
      return
    }

    const canLoadCount = this.options.concurently - this.countLoading
    const resources = this.queue.splice(0, canLoadCount)

    this.countLoading += resources.length

    resources.forEach(resource => {
      this.loadItem(resource).finally(() => {
        this.resources[resource.name] = resource
        this.countLoading--
      })
    })
  }

  private async loadItem(resource: LoaderResource): Promise<any> {
    this.adapter
      .request(resource.request)
      .then(async res => {
        const resolve = resource.onResolve
        delete resource.onReject
        delete resource.onResolve

        resource.response = res

        const parsers = resource.parsers || []

        for (const parser of parsers) {
          await this.parse(parser, resource)
        }

        resolve(resource)
      })
      .catch(resource.onReject)
      .finally(() => this.loadMore())
  }

  async parse(parser: string, resource: LoaderResource) {
    const parseInstance = this.parsers[parser]
    if (parseInstance) await parseInstance.parse(resource, this)
    return resource
  }
}
