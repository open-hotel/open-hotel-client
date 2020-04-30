import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'abstract',
  routes: [
    {
      path: '/splash',
      name: 'splash',
      component: () => import('./views/splash/splash.vue'),
    },
    {
      path: '/hotel-view',
      name: 'hotel-view',
      component: () => import('./views/hotel-view.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('./views/game.vue'),
      meta: {
        keepAlive: true
      }
    },
  ],
})

router.replace('/game');
