<template>
  <canvas ref="canvas" id="game"></canvas>
</template>
<script>
import Vue from 'vue'
import { Application } from '../../engine/Application'
import { ApplicationProvider } from '../../game/pixi/application.provider'
import { RoomProvider } from '../../game/room/room.provider'
import { Matrix } from '../../engine/lib/util/Matrix'
import { Sprite, Graphics } from 'pixi.js-legacy'
import { Loader } from '../../engine/loader'

export default {
  name: 'Game',
  data() {
    return {
      loaded: false,
      mounted: false,
      /** @type {ApplicationProvider} */
      app: null,
      /** @type {RoomProvider} */
      room: null,
      /** @type {Loader} */
      loader: null,
    }
  },
  methods: {
    async startGame() {
      const engine = await this.$injets.get(RoomProvider)
      await engine.create({
        users: {},
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
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`),
      })

      console.log(this.dataUrl)
    },
  },

  async activated() {
    if (!this.mounted) {
      this.app = await this.$injets.get(ApplicationProvider)
      this.room = await this.$injets.get(RoomProvider)
      this.loader = await this.$injets.get(Loader)

      this.app.createApp({ view: this.$refs.canvas })
      this.mounted = true
      if (!this.loaded) return this.$router.replace('/splash')
      return
    }

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
