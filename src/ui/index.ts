import Vue from 'vue'
import { router } from './router'
import App from './app.vue'

import './components'

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})