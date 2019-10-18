import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

Vue.use(Router)

// not implemented on orion
// const isDemo = process.env.NODE_ENV === 'demo'
const isDemo = true

const routes: RouteConfig[] = [
  {
    path: isDemo ? '/' : '/demo',
    name: 'demo',
    component: () => import('./views/Game.vue'),
  },
]

if (!isDemo) {
  routes.push(
    ...[
      {
        path: '/',
        name: 'root',
        component: () => import('./views/Index.vue'),
      },
    ],
  )
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
