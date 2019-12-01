import Vue from 'vue'

import Window from './Window.vue'
import WindowManager from './WindowManager.vue'

Vue.component('px-window', Window)
Vue.component('px-window-manager', WindowManager)

export {
  Window,
  WindowManager
}
