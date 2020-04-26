<template>
  <keep-alive>
    <canvas id="game"></canvas>
  </keep-alive>
</template>
<script>
export default {
  name: 'Game',
  created() {
    console.log('Created')
    // this.$router.replace('/splash')
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