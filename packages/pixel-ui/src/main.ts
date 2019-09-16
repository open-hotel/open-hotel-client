import Vue from 'vue'
import './assets/fonts/volter/Volter.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import PixelUI from '.'

Vue.config.productionTip = false

Vue.use(PixelUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
