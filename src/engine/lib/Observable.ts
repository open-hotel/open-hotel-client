type ObservableListener = (newValue: any, oldValue: any, key: string) => any

export type IObservable<T> = T & Observable<T>

const $state: unique symbol = Symbol()
const $key: unique symbol = Symbol()
const $parent: unique symbol = Symbol()
const $listeners: unique symbol = Symbol()

export class Observable<T = any> {
  private readonly [$key]: string
  private readonly [$parent]: Observable
  private readonly [$state]: any
  private [$listeners]: {
    prop: string
    fn: ObservableListener
  }[]

  constructor(state: T, _parent?: Observable, key?: string) {
    Object.defineProperties(this, {
      [$state]: {
        value: { ...state },
        enumerable: false,
        configurable: false,
        writable: false,
      },
      [$listeners]: {
        value: [],
        enumerable: false,
        configurable: false,
        writable: false,
      },
      [$key]: {
        value: key,
        configurable: false,
        enumerable: false,
        writable: false,
      },
      [$parent]: {
        value: _parent,
        configurable: false,
        enumerable: false,
        writable: false,
      },
    })

    for (let k in state) {
      this.$set(k, this[$state][k])
    }
  }
  $set(k: string, v: any) {
    const old = this[$state][k]
    this[$state][k] = v

    if (v && v.constructor === Object) {
      this[$state][k] = Observable.create<typeof v>(v, this, k)
    }
    if (!(k in this)) {
      Object.defineProperty(this, k, {
        enumerable: true,
        get() {
          return this[$state][k]
        },
        set(v) {
          console.log('SET', k, v)
          const old = this[$state][k]
          this.$set(k, v)
          this.notify(k, v, old)
        },
      })
      this.notify(k, v, old)
    }
  }

  notify(key: any, value: any, oldValue: any) {
    if (value === oldValue) return;
    
    this[$listeners].forEach(listener => {
      if (listener.prop === null || listener.prop === key) listener.fn(value, oldValue, key)
    })

    if (this[$key] && this[$parent]) {
      this[$parent].notify(`${this[$key]}.${key}`, value, oldValue)
    }
  }

  addListener(fn: ObservableListener) {
    this[$listeners].push({
      prop: null,
      fn: fn,
    })

    return this
  }

  watch(key: any, fn: ObservableListener) {
    this[$listeners].push({
      prop: key,
      fn: fn,
    })

    return this
  }

  removeAllListeners () {
    this[$listeners] = []
    return this
  }

  static create<T>(state: T, parent?: Observable<any>, parentKey?: string): IObservable<T> {
    return new Observable<T>(state, parent, parentKey) as IObservable<T>
  }
}
