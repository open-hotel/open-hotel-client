import Vue from 'vue'
import { ModuleRef } from 'injets'

declare module 'vue/types/vue' {
  interface Vue {
    $injets: ModuleRef
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    injets?: ModuleRef
  }
}

export class VueInjets {
  static install (V: typeof Vue) {
    V.mixin({
      beforeCreate () {
        Object.defineProperty(this, '$injets', {
          value: this.$options.injets || this.$root.$options.injets,
          writable: false,
          configurable: false
        })
      }
    })
  }
}
