<template>
  <main class="game">
    <chat />
  </main>
</template>
<script lang="ts">
import '@/game'
import Chat from '../chat/Chat.vue'

export default {
  components: {
    Chat,
  },
}
</script>
<style lang="scss" scoped>
.game {
  z-index: 5;
}
</style>
