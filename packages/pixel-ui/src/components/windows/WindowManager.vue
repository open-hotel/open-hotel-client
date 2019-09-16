<template>
  <div class="window-manager">
    <slot />
  </div>
</template>

<style lang="stylus">
.window-manager {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'WindowManager'
})
</script>
