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
          y: 15
        },
        heightmap: Matrix.fromLegacyString(`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xjjjjjjjjjjjjjx0000xxxxxxxxxx
xxxxxxxxxxxxiix0000xxxxxxxxxx
xxxxxxxxxxxxhhx0000xxxxxxxxxx
xxxxxxxxxxxxggx0000xxxxxxxxxx
xxxxxxxxxxxxffx0000xxxxxxxxxx
xxxxxxxxxxxxeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
eeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xeeeeeeeeeeeeex0000xxxxxxxxxx
xxxxxxxxxxxxddx00000000000000
xxxxxxxxxxxxccx00000000000000
xxxxxxxxxxxxbbx00000000000000
xxxxxxxxxxxxaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xaaaaaaaaaaaaax00000000000000
xxxxxxxxxxxx99x0000xxxxxxxxxx
xxxxxxxxxxxx88x0000xxxxxxxxxx
xxxxxxxxxxxx77x0000xxxxxxxxxx
xxxxxxxxxxxx66x0000xxxxxxxxxx
xxxxxxxxxxxx55x0000xxxxxxxxxx
xxxxxxxxxxxx44x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
x4444444444444x0000xxxxxxxxxx
xxxxxxxxxxxx33x0000xxxxxxxxxx
xxxxxxxxxxxx22x0000xxxxxxxxxx
xxxxxxxxxxxx11x0000xxxxxxxxxx
xxxxxxxxxxxx00x0000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
x000000000000000000xxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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