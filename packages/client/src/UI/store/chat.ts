import { Module } from "vuex"
import { RootState } from '.'
import { Application } from '@/engine/Application'
import store from '.'

interface ChatState {
  lastTexts: string[],
  dialogHistory: string[],
}

export const chatModule: Module<ChatState, RootState> = {
  namespaced: true,
  state: {
    lastTexts: [],
    dialogHistory: [],
  },
  mutations: {
    setHistory (state, newHistory: string[]) {
      state.dialogHistory = newHistory
    },
    setLastText (state, lastTexts: string[]) {
      state.lastTexts = lastTexts
    },
    addSpeech (state, text: string) {
      state.lastTexts.push(text)
    }
  }
}
