<template>
  <div style="flex: 1; display: flex; flex-flow: column">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="public">Público</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="all">Todos os quartos</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="my">Eventos</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="search">Meu mundo</px-tab-list-item>
    </px-tab-list>
    <px-tab-container style="padding: 0.5em;">
      <px-tab-view v-model="tab" name="all" class="fill">
        <oh-all-rooms />
      </px-tab-view>
    </px-tab-container>
    <div class="buttons" style="flex: 0 auto;">
      <px-btn color="info">Criar Quarto</px-btn>
      <px-btn color="warning">Um lugar novo</px-btn>
    </div>
  </div>
</template>

<script>
import OhAllRooms from './all-rooms.vue'

export default {
  components: { OhAllRooms },
  data() {
    return {
      tab: 'all',
    }
  },
}
</script>

<style scoped lang="stylus">
.fill {
  display: flex;
}

.buttons {
  display: flex;
  background: white;
  padding: 0.25em;

  .px-btn {
    flex: 1;
    padding: 1.618em;
  }
}
</style>