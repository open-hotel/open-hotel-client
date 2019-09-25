import Vue from 'vue'
import Vuex from 'vuex'
import { Application } from '@/engine/Application'
import { IRoomMap } from '@/stages/IRoomMap'
import { GameFurniture } from '@/gameobjects/furniture/GameFurniture'

Vue.use(Vuex)

export interface RootState {
  app: Application
  currentRoom: IRoomMap
  placingMobi: GameFurniture
  lockWalking: boolean
  roomMobis: GameFurniture[]
  blockToMobisMap: Record<string, GameFurniture[]>
}

export default new Vuex.Store<RootState>({
  state: {
    app: null,
    currentRoom: null,
    placingMobi: null,
    lockWalking: false,
    roomMobis: [],
    blockToMobisMap: Object.create(null),
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
      const { placingMobi, blockToMobisMap } = state
      state.roomMobis.push(placingMobi)

      const [x, y] = placingMobi.blockCoordinates[0]
      const block = { x, y }

      const blockKey = `${x},${y}`

      let blockFurniture = blockToMobisMap[blockKey]

      if (blockFurniture) {
        blockFurniture.push(placingMobi)
      } else {
        state.blockToMobisMap[blockKey] = [placingMobi]
      }
    },
  },
  actions: {
    selectMobi({ commit }, newMobi: GameFurniture) {
      commit('setPlacingMobi', newMobi)
      commit('setLockWalking', !!newMobi)
    },
    placeMobi({ dispatch, commit }) {
      commit('addMobiToRoom')
      dispatch('selectMobi', null)
    },
  },
})
