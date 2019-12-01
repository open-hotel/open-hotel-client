<template>
  <px-window-manager ref="wrapper" style="width:100vw;height:100vh;">
    <canvas ref="game"></canvas>
  </px-window-manager>
</template>

<script>
import { Application } from '../../engine/Application'
import { Scene } from '../../engine/lib/Scene'


class RoomStage extends Scene {
  ready () {

  }
}

export default {
  name: 'GameView',
  mounted () {
    const app = Application.get({
      resizeTo: this.$refs.wrapper,
      view: this.$refs.game,
      websocketServer: 'http://localhost:3000'
    })

    app.$router.setRoutes({
      room: RoomStage,
      splash: SplashStage
    }).push('room')
  }
}
</script>