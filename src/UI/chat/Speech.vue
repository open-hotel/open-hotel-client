<template>
  <div v-bind="$attrs" class="speech-root">
    <span class="speech">You: {{ text }}</span>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.speech-root {
  margin: 0 auto;
  bottom: 0;
  padding: 5px;
  transition: transform 500ms;
  position: absolute;
  left: 40%;
  padding-bottom: 50px;
}
.speech {
  padding: 5px;
  background-color: #fff;
  display: inline-block;
}
</style>
