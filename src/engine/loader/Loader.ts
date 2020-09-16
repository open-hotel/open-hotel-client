import { FetchAdapter } from './fetch.adapter'
import { LoaderMiddleware } from './parser.interface'
import { LoaderAdapter } from './adapter.interface'
import { ILoaderResource, LoaderResourceRequest as LoaderResourceOptions, LoaderResource } from './resource'
import urlJoin from 'url-join'
import { JsonParser, TextureParser, SpritesheetParser } from './parsers'
import { LibaryParser } from './parsers/library.parser'

interface LoaderOptions {
  baseURL: string
  adapter: LoaderAdapter
  concurently: number
  parsers: LoaderMiddleware[]
}

function isURL(str: string) {
  try {
    new URL(str)
    return true
  } catch (_) {
    return false
  }
}

function joinURL(baseURL: string, url: string) {
  return isURL(url) ? url : urlJoin(baseURL, url)
}

interface LoaderAddMulti {
  resources: LoaderResource[]
  wait(): Promise<LoaderResource[]>
  progress(cb: (loaded: number, total: number) => void): LoaderAddMulti
}

interface LoaderAdd {
  resource: LoaderResource
  wait(): Promise<LoaderResource>
}

export class Loader {
  private options: LoaderOptions
  private queue: LoaderResource[] = []
  private countLoading: number = 0
  public resources: Record<string, LoaderResource> = {}

  constructor(options: Partial<LoaderOptions> = {}) {
    this.options = Object.assign(
      {
        adapter: new FetchAdapter(),
        concurently: 10,
        parsers: [new JsonParser(), new TextureParser(), new SpritesheetParser(), new LibaryParser()],
      },
      options,
    ) as LoaderOptions
    this.parsers.sort((a, b) => a.priority - b.priority)
  }

  get adapter() {
    return this.options.adapter
  }

  get parsers() {
    return this.options.parsers
  }

  private addResource(name: string, url: string, options?: object): LoaderResource {
    let resource: LoaderResource =
      this.resources[name] ??
      new LoaderResource({
        name,
        request: {
          method: 'GET',
          url: joinURL(this.options.baseURL, url),
        },
        options
      })

    if (!resource.in_queue) {
      this.resources[name] = resource
      this.queue.push(resource)
      resource.in_queue = true
      this.loadMore()
    }

    return resource
  }

  private addArray(resources: Array<string | LoaderResourceOptions>): LoaderAddMulti {
    const items = resources.map(item => {
      if (typeof item === 'string') {
        return this.addResource(item, item)
      }
      return this.addResource(item.name, item.url, item.options)
    })

    return {
      resources: items,
      wait: () => Promise.all(items.map(item => item.toPromise())),
      progress(cb) {
        let loaded = 0;
        items.forEach((res) => {
          res.toPromise().finally(() => {
            cb(loaded++, items.length)
          })
        })
        return this
      }
    }
  }

  private addDic(resources: Record<string, string>) {
    return this.addArray(
      Object.entries(resources).map(([name, resource]) => ({
        name,
        url: resource,
        options: {}
      })),
    )
  }

  add(url: string): LoaderAdd
  add(name: string, url: string): LoaderAdd
  add(resource: LoaderResourceOptions): LoaderAdd
  add(resources: Record<string, string | LoaderResourceOptions>): LoaderAddMulti
  add(resources: Record<string, string | LoaderResourceOptions>): LoaderAddMulti
  add(resources: string[]): LoaderAddMulti
  add(resourceItem: any, url?: string): LoaderAdd | LoaderAddMulti {
    if (Array.isArray(resourceItem)) return this.addArray(resourceItem)
    if (typeof resourceItem === 'object' && !resourceItem.name) return this.addDic(resourceItem)

    let name: string

    if (typeof url === 'string') {
      name = resourceItem
    } else if (typeof resourceItem === 'string') {
      name = url = resourceItem
    }

    const resource = this.addResource(name, url)

    return {
      resource: resource,
      wait: () => resource.toPromise()
    }
  }

  private loadMore() {
    if (this.countLoading >= this.options.concurently) {
      return
    }


    const canLoadCount = Math.max(0, this.options.concurently - this.countLoading)
    const resources = this.queue.splice(0, canLoadCount)

    this.countLoading += resources.length

    resources.forEach(resource => this.loadItem(resource))
  }

  private async hook(name: string, resource: ILoaderResource) {
    for (const middleware of this.parsers) {
      if (name in middleware) {
        await middleware[name](resource, this)
      }
    }
  }

  private async loadItem(resource: LoaderResource): Promise<any> {
    await this.hook('pre', resource)

    return this.adapter.request(resource.request)
      .then(async res => {
        this.countLoading--;

        resource.response = res
        resource.loaded = true;
        await this.hook('use', resource)

        resource.ready = true
        resource.emit('ready', resource)
      })
      .catch(err => resource.emit('error', err))
      .finally(() => {
        resource.emit('load', resource)
        this.loadMore()
      })
  }

  async parse(parser: string, resource: ILoaderResource) {
    const parseInstance = this.parsers[parser]
    if (parseInstance) await parseInstance.parse(resource, this)
    return resource
  }
}
