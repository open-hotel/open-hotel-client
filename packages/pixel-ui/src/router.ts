import Vue from 'vue'
import Router from 'vue-router'
import DemoWindows from './views/Windows.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'windows',
      component: DemoWindows
    }
  ]
})
