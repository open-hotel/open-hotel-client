<template>
  <div id="app">
    <transition name="fade">
      <keep-alive include="Game">
        <router-view />
      </keep-alive>
    </transition>
    <oh-notifications class="notifications" />
    <oh-toolbar />
  </div>
</template>
<script>
export default {
  components: {},
}
</script>
<style lang="stylus">
#app {
  background: #000;

  .notifications {
    position: fixed;
    top: 100px;
    right: 8px;
    z-index: 1000;
    width: 200px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-leave-active {
  position: absolute;
}

/* set opacity to 0 at element's entrance and exit */
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-x {
  &-move {
    transition: all 1s;
  }

  &-leave-active {
    position: absolute;
  }

  &-enter-active, &-leave-active {
    transition: all 1s;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translate(100%, 0);
  }
}
</style>