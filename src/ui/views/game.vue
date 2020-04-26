<template>
  <keep-alive>
    <canvas id="game"></canvas>
  </keep-alive>
</template>
<script>

export default {
  name: 'Game',
  methods: {
    async startGame () {
      //const gameModule = await gameRef
    }
  },
  created() {
    console.log('criou o jogo')
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