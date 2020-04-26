<template>
  <canvas ref="canvas" id="game"></canvas>
</template>
<script>
import { getGameRef } from '../../game/gameRef'
import { Application } from '../../engine/Application'
import { ApplicationProvider } from '../../game/applicaiton.provider'

export default {
  name: 'Game',
  methods: {
    async startGame () {
      const gameModule = await getGameRef()
      const app = await gameModule.get(ApplicationProvider)
      app.createApp({
        view: this.$refs.canvas
      })
    }
  },

  mounted() {
    this.startGame()
  },
}
</script>
<style lang="stylus">
#game {
  position: absolute;
  background: #000;
  display: block;
  width: 100%;
  height: 100%;
}
</style>