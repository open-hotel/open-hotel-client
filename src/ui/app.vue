<template>
  <div id="app">
    <oh-notifications class="notifications" />
    <transition name="fade">
      <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>-->
      <router-view />
    </transition>
    <oh-toolbar />
  </div>
</template>
<script>
export default {
  components: {
  },
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
    max-width: 240px;
  }
}

.fade-move {
  transition: transform .4s;
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
</style>