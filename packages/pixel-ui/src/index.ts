import './stylus/main.styl'
import VueModule from 'vue'
import {
  WindowManager,
  Window,
  Button,
  TabList,
  TabListItem,
  TabView,
  TabContainer
} from './components'

export * from './components'

export default class PixelUI {
  static install(Vue: typeof VueModule) {
    Vue.component('px-btn', Button)

    Vue.component('px-window-manager', WindowManager)
    Vue.component('px-window', Window)

    Vue.component('px-tab-list', TabList)
    Vue.component('px-tab-list-item', TabListItem)
    Vue.component('px-tab-view', TabView)
    Vue.component('px-tab-container', TabContainer)
  }
}
