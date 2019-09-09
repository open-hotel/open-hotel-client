<template>
  <div class="navigator" @mousewheel.stop="false">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="home">Início</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="rooms">Quartos</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="events">Eventos</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="my-rooms">Meu Mundo</px-tab-list-item>
    </px-tab-list>
    <px-tab-container>
      <px-tab-view v-model="tab" name="home">
        Home
      </px-tab-view>
      <px-tab-view v-model="tab" name="rooms">
        Quartos
      </px-tab-view>
      <px-tab-view v-model="tab" name="events">
        Eventos
      </px-tab-view>
      <px-tab-view v-model="tab" name="my-rooms">
        Meu
      </px-tab-view>
    </px-tab-container>
  </div>
</template>

<style lang="scss">
.navigator {
  flex: 1;
  display: flex;
  flex-flow: column;
}
</style>

<script>
export default {
  data() {
    return {
      tab: 'home',
    }
  },
}
</script>
