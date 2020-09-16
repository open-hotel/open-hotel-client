import '@open-hotel/pixel/dist/pixel.css'
import Vue from 'vue'
import PixelUi from '@open-hotel/pixel'

import './components'
import App from './app.vue'
import { router } from './router'
import { VueInjets } from '../vue-injets'
import { gameRef } from '../game'

Vue.use(PixelUi)

Vue.use(VueInjets, gameRef)

new Vue({
  el: '#app',
  router,
  injets: gameRef,
  render: h => h(App),
})
