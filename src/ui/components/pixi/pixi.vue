<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { Application } from 'pixi.js-legacy'
export default {
  data () {
    return {
      /** @type {Application} */
      app: null
    }
  },
  mounted () {
    this.app = new Application({
      transparent: true,
      view: this.$refs.canvas,
      forceCanvas: true,
      resizeTo: this.$el.parentElement
    })
  },
  beforeDestroy () {
    this.app.destroy()
  }
}
</script>