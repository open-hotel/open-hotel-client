<template>
  <div style="flex: 1;">
    <px-scrollview>
      <ul class="room-list">
        <li class="room-list-category">
          <div class="room-list-header">Quartos mais populares</div>
          <ul class="room-list">
            <li v-for="i in 5" :key="i" class="room-list-item">
              <div class="count-users">123</div>
              <p class="room-list-item-title">Room {{ i }}</p>
            </li>
          </ul>
        </li>
        <li class="room-list-category">
          <div class="room-list-header">Batendo um papo</div>
          <ul class="room-list">
            <li v-for="i in 10" :key="i" class="room-list-item">
              <div class="count-users">123</div>
              <p class="room-list-item-title">Room {{ i }}</p>
            </li>
          </ul>
        </li>
        <li class="room-list-category">
          <div class="room-list-header">Jogos e eventos</div>
          <ul class="room-list">
            <li v-for="i in 10" :key="i" class="room-list-item">
              <div class="count-users">123</div>
              <p class="room-list-item-title">Room {{ i }}</p>
            </li>
          </ul>
        </li>
        <li class="room-list-category">
          <div class="room-list-header">Festas</div>
          <ul class="room-list">
            <li v-for="i in 20" :key="i" class="room-list-item">
              <div class="count-users">123</div>
              <p class="room-list-item-title">Room {{ i }}</p>
            </li>
          </ul>
        </li>
      </ul>
    </px-scrollview>
  </div>
</template>

<style lang="stylus">
.room-list {
  margin-right: 0.25em;

  &-header {
    color: #3A7392;
    font-size: 16px;
    padding: 0.5em 0;
    position: sticky;
    top: 0;
    background: #FFF;
  }

  &-item {
    display: flex;
    align-items: center;
    padding: 2px;
    color: #000;

    &-title {
      flex: 1;
    }

    &:nth-child(2n+1) {
      background: #D5EDFF;
    }
  }

  .count-users {
    flex: 0 auto;
    padding: 0.128em 0.809em;
    border-radius: 4px;
    background: #5FAB5E;
    color: #FFF;
    font-weight: bold;
    margin-right: 0.5em;
  }
}
</style>