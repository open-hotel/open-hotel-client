import Vue from 'vue'
import { ModuleRef, Constructor } from 'injets'
import { GameModule } from './game'

declare module 'vue/types/vue' {
  interface Vue {
    $injets: ModuleRef
  }

  interface VueConstructor {
    injets: ModuleRef<GameModule>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps
  > {
    $injets?: {
      module: Constructor
      inject: Record<string, any>
    }
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    injets?: ModuleRef
  }
}

export class VueInjets {
  static install(V: typeof Vue, rootModule: ModuleRef) {
    V.injets = rootModule
    V.mixin({
      data() {
        if (!this.$options.$injets) return {}
        if (!this.$options.$injets.module) {
          console.warn(`[vue-injets] You must specify a context module for this component.`)
          return {}
        }

        const data = {}
        const $module = rootModule.getModule(this.$options.$injets.module)

        for (let [key, value] of Object.entries(this.$options.$injets.inject)) {
          data[key] = $module.get(value)
        }

        return data
      },
      beforeCreate() {
        Object.defineProperty(this, '$injets', {
          value: this.$options.injets || rootModule,
          writable: false,
          configurable: false,
        })
      },
    })
  }
}
