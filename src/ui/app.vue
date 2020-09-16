<template>
  <div id="app">
    <px-window-manager>
      <transition name="fade">
        <keep-alive include="GameView">
          <router-view @splash-ready="loaded = true" />
        </keep-alive>
      </transition>
      <transition name="slide-y">
        <oh-toolbar
          v-if="loaded"
          @toggle-window="toggleWindow($event)"
        />
      </transition>

      <template v-if="loaded">
        <oh-notifications class="notifications" />

        <px-window v-bind.sync="window.browser">
          <oh-browser />
        </px-window>
        <px-window v-bind.sync="window.wardrobe">
          <oh-wardrobe />
        </px-window>
      </template>
    </px-window-manager>
  </div>
</template>
<script>
import OhBrowser from './browser/browser.vue'
import OhWardrobe from './wardrobe/wardrobe.vue'

export default {
  components: {
    OhBrowser,
    OhWardrobe,
  },
  data() {
    return {
      loaded: false,
      window: {
        browser: {
          title: 'Navigator',
          visible: false,
          width: 480,
          height: 480,
          x: 64,
          y: 32,
        },
        wardrobe: {
          title: 'Wardrobe',
          visible: false,
          width: 800,
          height: 480,
          x: 64,
          y: 32,
        },
      },
    }
  },
  methods: {
    toggleWindow(name) {
      this.window[name].focused = this.window[name].visible = !this.window[name].visible;
    }
  }
}
</script>
<style lang="stylus">
@import "./global.styl";

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

.slide-y {
  &-enter-active, &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-active {
    transition-delay: 0.5s;
  }

  &-enter, &-leave-to {
    transform: translate(0, 100%);
  }
}
</style>
