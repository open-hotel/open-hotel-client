import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

Vue.use(Router)

const routes: RouteConfig[] = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import('./views/Game.vue'),
  },
  {
    path: '/',
    name: 'root',
    component: () => import('./views/Index.vue'),
  },
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
