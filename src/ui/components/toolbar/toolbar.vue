<template>
  <div class="oh-toolbar">
    <div class="oh-toolbar-area">
      <button
        v-if="$route.name === 'game'"
        class="oh-toolbar-button btn-hotelview"
        @click="$router.replace('hotel-view')"
      >
        <img src="./toolbar_button_hotelview.png" />
      </button>
      <button v-else class="oh-toolbar-button btn-hotelview" @click="$router.replace('game')">
        <img src="./toolbar_button_home.png" />
      </button>
      <button class="oh-toolbar-button btn-navigator" @click="$emit('toggle-window', 'browser')">
        <img src="./toolbar_button_navigator.png" />
      </button>
      <button class="oh-toolbar-button btn-shop">
        <img src="./toolbar_button_shop.png" />
      </button>
      <button class="oh-toolbar-button">
        <img src="./toolbar_button_architect.png" @click="$emit('toggle-window', 'wardrobe')"/>
      </button>
      <button class="oh-toolbar-button btn-inventory">
        <img src="./toolbar_button_inventory.png" />
      </button>
      <div class="oh-toolbar-divider"></div>
      <div class="oh-toolbar-spacer"></div>
      <div class="oh-toolbar-divider"></div>
      <button class="oh-toolbar-button btn-friends">
        <img src="./toolbar_button_friends.png" />
      </button>
      <button class="oh-toolbar-button">
        <img src="./toolbar_button_search_users.png" />
      </button>
      <oh-friendbar />
    </div>
  </div>
</template>
<script>
import OhFriendbar from './friendbar.vue'
export default {
  components: {
    OhFriendbar,
  },
}
</script>
<style lang="stylus">
.oh-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2e2e2c;
  padding-top: 1px;

  &-area {
    border-top: 2px solid #53524f;
    border-bottom: 1px solid #53524f;
    height: 49px;
    display: flex;
    padding: 3px 4px 4px 4px;
    padding-left: 27px;
    padding-right: 15px;
  }

  &-button {
    display: block;
    background: none;
    border: none;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center;
    cursor: pointer;
    margin: 0 16px 0 0;
    outline: none;

    &:hover {
      filter: drop-shadow(1px 2px 0 rgba(0, 0, 0, 0.75));
      transform: translate(0, -2px);
    }
  }

  &-divider {
    width: 1px;
    background: #454442;
    margin: 0 8px;
    opacity: 0.82;
  }

  &-spacer {
    flex: 1;
  }

  .btn-hotelview {
    margin-top: -1px;
  }

  .btn-navigator {
    margin-top: 1px;
    margin-left: 1px;
  }

  .btn-shop {
    margin-left: -3px;
    margin-right: 18px;
  }

  .btn-inventory {
    margin-top: -1px;
    margin-left: -1px;
  }

  .btn-friends {
    margin-right: 14px;
    margin-left: 8px;
  }
}
</style>