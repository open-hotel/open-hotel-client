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
  created() {
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
        // heightmap: new Matrix(64, 64).fill(() => 1),
        heightmap: Matrix.fromLegacyString(`
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx3xx
        xwvutsrqponmlkjihgfedcba9876543333
        wwvutsrqponmlkjihgfedcba9876543333
        xwvutsrqponmlkjihgfedcba9876543333
        xbbba98765432100000000000000000222
        xxxxxxxxxxxxxxx0000000000000000111
        x000000000000000000000000000000000
        x000000000000000000000000000000000
        x000000000000000000000000000000000
        x000000000000000000000000000000000
        x000000000000000000000000000000000
        x000000000000000000000000000000000
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
