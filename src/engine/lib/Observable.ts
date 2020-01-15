import { isObject } from "./util/Util";

export type IObservable<T extends object> = T & Observable<T>;
type ObservableListener<T extends object> = (
  obs: T,
  oldState: [string | string[], any][]
) => void;

interface ObservableMeta<T extends object> {
  listenners: {
    properties?: string[];
    handler: ObservableListener<T>;
  }[];
  parentObservable: Observable;
  parentKey: string;
  state: T;
}

export class Observable<T extends object = object> {
  private static meta = new WeakMap<object, ObservableMeta<any>>();

  private static register(
    obs: Observable,
    parentObservable?: Observable,
    parentKey?: string
  ) {
    if (this.meta.has(obs)) return;
    this.meta.set(obs, {
      listenners: [],
      parentObservable: parentObservable,
      parentKey: parentKey,
      state: {}
    });
  }

  private static getMeta(obs: Observable) {
    const meta = this.meta.get(obs);
    if (!meta) throw new ReferenceError("Observable not exists!");
    return meta;
  }

  static subscribe<T extends Observable>(
    obs: T,
    ...listeners: ObservableListener<T>[]
  ) {
    const meta = this.getMeta(obs);

    meta.listenners.push(
      ...listeners.map(listener => ({
        properties: null,
        handler: listener
      }))
    );

    this.meta.set(obs, meta);
  }

  static notify(obs: Observable, oldState: [string | string[], any][]) {
    const meta = this.getMeta(obs);
    const old = meta.parentObservable
      ? oldState
      : oldState.map<[string, any]>(([key, value]) => [
          (key as string[]).join("."),
          value
        ]);

    meta.listenners.forEach(listener => {
      if (
        !listener.properties ||
        listener.properties.find(k => {
          if (Array.isArray(old[0])) {
            return old[0].includes(k);
          }
          return old[0] === k;
        })
      ) {
        return listener.handler(obs, old);
      }
    });

    if (meta.parentObservable) {
      const oldStatePath = oldState.map(state => {
        state[0] = [meta.parentKey].concat(state[0]);
        return state;
      });

      this.notify(meta.parentObservable, oldStatePath);
    }
  }

  static set(obs: Observable, state: object, notify = true) {
    const meta = this.getMeta(obs);
    const old = [];

    for (let [key, value] of Object.entries(state)) {
      if (isObject(value)) {
        value = new Observable(value, obs, key);
      }
      // Define new properties
      if (!(key in obs)) {
        Object.defineProperty(obs, key, {
          enumerable: true,
          set(v) {
            Observable.set(obs, { [key]: v });
          },
          get() {
            return Observable.getState(obs)[key];
          }
        });
      }
      meta.state[key] = value;
      old.push([[key], value]);
    }

    this.meta.set(obs, meta);
    if (notify) this.notify(obs, old);
  }

  private static getState(obs: Observable) {
    const meta = this.getMeta(obs);
    return meta && meta.state;
  }

  static watch<T extends Observable>(
    obs: T,
    properties: string[],
    ...listeners: ObservableListener<T>[]
  ) {
    const meta = this.getMeta(obs);
    meta.listenners.push(
      ...listeners.map(listener => ({
        properties: properties,
        handler: listener
      }))
    );
  }

  constructor(state: T, parentObservable?: Observable, parentKey?: string) {
    Observable.register(this, parentObservable, parentKey);
    Observable.set(this, state, false);
  }

  static create<T extends object>(state: T) {
    return new Observable(state) as T;
  }
}