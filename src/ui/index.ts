import Vue from 'vue'
import { createModule, ModuleRef } from 'injets'

import './components'
import App from './app.vue'
import { router } from './router'
import { GameModule } from '../game'
import { VueInjets } from '../vue-injets'

Vue.use(VueInjets)

async function main () {
  const injets = await createModule(GameModule)

  return new Vue({
    el: '#app',
    router,
    injets,
    render: h => h(App),
  })
}

main()

