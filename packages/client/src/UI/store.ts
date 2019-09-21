import Vue from 'vue'
import Vuex from 'vuex'
import { Application } from '@/engine/Application'
import { IRoomMap } from '@/stages/IRoomMap'
import { GameFurniture } from '@/gameobjects/furniture/GameFurniture'

Vue.use(Vuex)

export interface RootState {
  app: Application
  currentRoom: IRoomMap,
  placingMobi: GameFurniture,
  lockWalking: boolean,
  roomMobis: GameFurniture[]
}

export default new Vuex.Store<RootState>({
  state: {
    app: null,
    currentRoom: null,
    placingMobi: null,
    lockWalking: false,
    roomMobis: []
  },
  mutations: {
    setPlacingMobi(state, newMobi: GameFurniture) {
      state.placingMobi = newMobi
    },
    setApp(state, app: Application) {
      state.app = app
    },
    setCurrentRoom(state, room: IRoomMap) {
      state.currentRoom = room
    },
    setLockWalking(state, payload: boolean) {
      state.lockWalking = payload
    },
    addMobiToRoom(state) {
      state.roomMobis.push(state.placingMobi)
    }
  },
  actions: {
    selectMobi({ commit }, newMobi: GameFurniture) {
      commit('setPlacingMobi', newMobi)
      commit('setLockWalking', !!newMobi)
    },
    placeMobi({ dispatch, commit }) {
      commit('addMobiToRoom')
      dispatch('selectMobi', null)
    }
  },
})
