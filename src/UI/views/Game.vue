<template>
  <px-window-manager ref="gameWrapper" class="game">
    <canvas id="game" ref="game"></canvas>
    <game-bottom-bar @click-navigator="toggleWindow('navigator')" />

    <px-window v-bind.sync="window.navigator">
      <GameNavigator />
    </px-window>
  </px-window-manager>
</template>
<script>
import { Application } from '@/engine/Application'
import { Log } from '@/engine/lib/Logger'
import { load as loadWebFonts } from 'webfontloader'
import * as PIXI from 'pixi.js'

export default {
  components: {
    GameBottomBar: () => import('../bottom-bar/BottomBar'),
    GameNavigator: () => import('../navigator/Navigator'),
  },

  data() {
    return {
      window: {
        navigator: {
          title: 'Navegador',
          visible: false,
          x: 50,
          y: 50,
          width: 320,
          height: 480,
          resizable: true,
        },
      },
    }
  },
  mounted() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    PIXI.settings.FILTER_RESOLUTION = window.devicePixelRatio

    const app = Application.get({
      logLevel: Log.INFO,
      antialias: false,
      autoDensity: true,
      resolution: devicePixelRatio,
      forceCanvas: true,
      view: this.$refs.game,
      resizeTo: this.$refs.gameWrapper,
    })

    if (module.hot) {
      module.hot.dispose(() => location.reload())
    }

    const stagesLoaded = Promise.all([import('@/stages/SplashScreen'), import('@/stages/HomeScreen')]).then(
      ([splash, home]) => {
        app.$router.setRoutes({
          splash: splash.SplashScreen,
          home: home.HomeScreen,
        })
      },
    )

    loadWebFonts({
      google: {
        families: ['Ubuntu'],
      },
      custom: {
        families: ['Volter'],
        urls: ['resources/fonts/Volter/Volter.css'],
      },
      active() {
        stagesLoaded.then(() => app.$router.replace('splash'))
      },
    })
  },
  methods: {
    toggleWindow(name) {
      const window = this.window[name]
      if (window) {
        window.visible = !window.visible
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.game {
  z-index: 5;
  width: 100%;
  height: 100%;
}
</style>
