<template>
  <div class="game-bottom-bar">
    <chat @user:speak="speak" />
    <button class="icon-button" @click="$emit('click-navigator')">
      <img src="./icons/navigator.png" alt="See rooms icon" />
    </button>
    <button class="icon-button" @click="$emit('click-inventory')">
      <img src="./icons/inventory.png" alt="See inventory icon" />
    </button>
  </div>
</template>

<style lang="scss">
.game-bottom-bar {
  position: fixed;
  display: flex;
  flex-flow: row nowrap;
  background: rgba(#1c1c1a, 0.92);
  padding: 4px 8px;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 2px solid rgba(#fff, 0.25);
  border-radius: 4px 4px 0 0;
  z-index: 99999999;
  & > button {
    margin-right: 10px;
  }
}

.icon-button {
  background: none;
  border: none;
  padding: 0;
  width: 40px;
  height: 40px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>

<script>
import Chat from '../chat/Chat'
import bus from '@/event-bus'
import { Application } from '../../engine/Application'

export default {
  components: {
    Chat,
  },
  methods: {
    speak(text, time) {
      bus.$emit('player:speak', time)
    },
  },
}
</script>
