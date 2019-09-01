import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { PixelUI } from '@open-hotel/pixel'
import '@open-hotel/pixel/dist/pixel.css'

import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(PixelUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
