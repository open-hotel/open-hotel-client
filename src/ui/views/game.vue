<template>
  <canvas ref="canvas" id="game"></canvas>
</template>
<script>
import Vue from 'vue'
import { getGameRef } from '../../game/gameRef'
import { Application } from '../../engine/Application'
import { ApplicationProvider } from '../../game/pixi/application.provider'
import { RoomProvider } from '../../game/room/room.provider'
import { Matrix } from '../../engine/lib/util/Matrix'

export default {
  name: 'Game',
  created () {
    this.$router.replace('/splash')
  },
  methods: {
    async startGame() {
      const app = await this.$injets.get(ApplicationProvider)
      
      app.createApp({
        view: this.$refs.canvas,
      })

      const engine = await this.$injets.get(RoomProvider)
      await engine.create({
        users: {},
        door: {
          x: 0,
          y: 2
        },
        heightmap: Matrix.fromLegacyString(`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xwvutsrqponmlkjihgfedcba9876543210
wwvutsrqponmlkjihgfedcba9876543210
xwvutsrqponmlkjihgfedcba9876543210
xxxxxxxxxxx0xxxxxxxxxxxxxxxxxxx000
x00000000000xxxxxxxxxxxxxxxxxxxxxx
x00000000000xxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        `),
      })
    },
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