<template>
  <canvas id="game"></canvas>
</template>
<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import { Application } from '../../engine/Application'
import { ApplicationProvider } from '../../game/pixi/application.provider'
import { RoomProvider } from '../../game/room/room.provider'
import { Matrix } from '../../engine/lib/util/Matrix'
import { Sprite, Graphics } from 'pixi.js-legacy'
import { Loader } from '../../engine/loader'
import { gameRef } from '../../game'
import { ModuleRef } from 'injets'
import { GameModule } from '../../game/game.module'
import { RoomModule } from '../../game/room/room.module'

@Component
export default class GameView extends Vue {
  @Provide() app : ApplicationProvider = gameRef.get(ApplicationProvider)
  @Provide() game = gameRef
  @Provide() room: RoomProvider = gameRef.get(RoomProvider)
  @Provide() loader: Loader = gameRef.get(Loader)

  isLoaded = false
  isMounted = false

  $el: HTMLCanvasElement

  async activated() {
    if (!this.isMounted) {
      this.app.createApp({ view: this.$el })
      this.isMounted = true
      if (!this.isLoaded) return this.$router.replace('/splash')
      return
    }

    this.startGame()
  }

  async startGame() {
    await this.room.create({
      roomUserDictionary: {
        abc: {
          id: '1',
          name: 'user_1',
          look: 'hd-180-1.hr-110-61.ch-210-66.lg-280-110.sh-305-62',
          action: 'dance=4',
          direction: 2,
          head_direction: 2,
          x: 64,
          y: 32,
          z: 8
        },
      },
      heightmap: Matrix.fromLegacyString(`
        000000000
        000000000
        000000000
        000000000
        000000000
        000000000
        000000000
        000000000
      `),
    })
  }
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
