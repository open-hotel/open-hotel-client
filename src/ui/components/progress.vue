<template>
  <div class="oh-progress">
    <div class="oh-progress-bar" :style="{ width: percent }"></div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      default: 25,
    },
  },
  computed: {
    ratio() {
      const value = Math.min(this.max, Math.max(this.min, this.value))
      return value / this.max
    },
    percent() {
      return `${this.ratio * 100}%`
    },
  },
}
</script>

<style lang="stylus">
.oh-progress {
  border: 1px solid #FFF;
  height: 27px;
  width: 400px;
  border-radius: 2px;
  display: inline-flex;
  padding: 2px;

  &-bar {
    background: linear-gradient(to bottom, #bacad3 50%, #8ca1ad 50%);
    flex: 0 auto;
    width: 25%;
  }
}
</style>