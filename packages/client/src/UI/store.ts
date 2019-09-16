import Vue from 'vue'
import Vuex from 'vuex'
import { Application } from '@/engine/Application'
import { IRoomMap } from '@/stages/IRoomMap'

Vue.use(Vuex)

export interface RootState {
  app: Application
  currentRoom: IRoomMap
}

export default new Vuex.Store<RootState>({
  state: {
    app: null,
    currentRoom: null,
  },
  mutations: {
    setApp(state, app: Application) {
      state.app = app
    },
    setCurrentRoom(state, room: IRoomMap) {
      state.currentRoom = room
    },
  },
  actions: {},
})
