import Vue from 'vue'

import TabList from './TabList.vue'
import TabListItem from './TabListItem.vue'
import TabView from './TabView.vue'
import TabContainer from './TabContainer.vue'

Vue.component('px-tab-list', TabList)
Vue.component('px-tab-list-item', TabListItem)
Vue.component('px-tab-view', TabView)
Vue.component('px-tab-container', TabContainer)

export {
  TabContainer,
  TabList,
  TabListItem,
  TabView
}
