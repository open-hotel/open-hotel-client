<template>
  <div class="navigator" @mousewheel.stop="false">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="home">Home</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="rooms">Rooms</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="events">Events</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="my-rooms">My World</px-tab-list-item>
    </px-tab-list>
    <px-tab-container>
      <px-tab-view v-model="tab" name="home">
        Home
        <section class="rooms">
          <div v-for="room in rooms" :key="room.name" class="room-item" @click="changeRoom(room)">{{ room.name }}</div>
        </section>
      </px-tab-view>
      <px-tab-view v-model="tab" name="rooms">Rooms</px-tab-view>
      <px-tab-view v-model="tab" name="events">Events</px-tab-view>
      <px-tab-view v-model="tab" name="my-rooms">My World</px-tab-view>
    </px-tab-container>
  </div>
</template>

<style lang="scss">
.navigator {
  flex: 1;
  display: flex;
  flex-flow: column;
}
.rooms {
  margin-top: 5px;
}
.room-item {
  margin-bottom: 3px;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  background-color: #d4ebfd;
  font-family: Volter;
  font-weight: bold;
  font-size: 12px;
}
</style>

<script>
import rooms from '@/stages/maps'
export default {
  data() {
    return {
      tab: 'home',
      rooms,
    }
  },
  methods: {
    changeRoom(room) {
      this.$store.commit('setCurrentRoom', room)
    },
  },
}
</script>
