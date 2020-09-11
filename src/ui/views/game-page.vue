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
    }
  },
  methods: {
    async startGame() {
      const engine = await this.$injets.get(RoomProvider)
      await engine.create({
        roomUserDictionary: {
          abc: {
            nickname: 'testNickname',
            imagerOptions: {
              encodedFigure: 'hd-180-1.hr-110-61.ch-210-66.lg-280-110.sh-305-62',
              encodedActions: 'std',
              direction: 2,
              head_direction: 2,
              is_ghost: false,
            }
          }
        },
        heightmap: Matrix.fromLegacyString(`
        00`),
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
