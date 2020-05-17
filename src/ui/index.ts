import '@open-hotel/pixel/dist/pixel.css'
import Vue from 'vue'
import { createModule } from 'injets'
import PixelUi from '@open-hotel/pixel'

import './components'
import App from './app.vue'
import { router } from './router'
import { GameModule } from '../game'
import { VueInjets } from '../vue-injets'

Vue.use(PixelUi)

const injets = createModule(GameModule)

Vue.use(VueInjets, injets)

new Vue({
  el: '#app',
  router,
  injets,
  render: h => h(App),
})
