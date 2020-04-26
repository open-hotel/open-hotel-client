<template>
  <div class="oh-notifications">
    <transition-group name="fade" mode="out-in">
      <div
        v-for="notification in items"
        :key="notification.id"
        class="oh-notification"
        @click="dispose(notification)"
        @mouseenter.self.stop="stopTimer(notification)"
        @mouseleave="startTimer(notification)"
      >
        <div v-if="notification.icon" class="oh-notification-icon">
          <img :src="notification.icon" />
        </div>
        <div class="oh-notification-body">
          <img v-if="notification.image" :src="notification.image" />
          <p v-if="notification.title" class="oh-notification-title">{{notification.title}}</p>
          <p v-if="notification.body" class="oh-notification-text">{{notification.body}}</p>
          <div
            v-if="notification.actions && notification.actions.length"
            class="oh-notification-actions"
          >
            <a v-for="action in notification.actions" :key="action.id" href="#" @click.prevent.stop="notification.onAction && notification.onAction(action)">{{ action.text }}</a>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
/**
 * @typedef OHNotificationAction
 * @property {any} id
 * @property {string} text
 * @typedef OHNotification
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {string} icon
 * @property {string} image
 * @property {OHNotificationAction[]} actions
 */
export default {
  name: 'Notifications',
  props: {
    max: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      /** @type {OHNotification[]} */
      items: [],
      pending: [],
      timers: new Map(),
      lastId: 0,
    }
  },
  methods: {
    /**
     * @param {OHNotification} notification
     */
    add(notification) {
      if (!notification) return

      notification.id = notification.id === undefined ? ++this.lastId : notification.id
      notification.duration = notification.duration || 5000

      if (this.items.length < this.max) {
        this.display(notification)
      } else {
        this.pending.push(notification)
      }

      return notification
    },
    display(notification) {
      if (!notification) return

      this.startTimer(notification)
      this.items.push(notification)
    },
    dispose(notification) {
      if (!notification) return
      const indexDisplay = this.items.findIndex(item => item === notification || item.id === notification.id)

      if (indexDisplay >= 0) {
        const notification = this.pending.shift()
        if (notification) {
          this.startTimer(notification)
          this.items.splice(indexDisplay, 1, notification)
        } else this.items.splice(indexDisplay, 1)
      } else {
        this.pending = this.pending.filter(item => item.id !== notification.id)
      }
    },
    stopTimer(notification) {
      clearInterval(this.timers.get(notification.id))
      this.timers.delete(notification.id)
    },
    startTimer(notification) {
      this.stopTimer(notification)
      this.timers.set(
        notification.id,
        setTimeout(() => this.dispose(notification), notification.duration || 5000),
      )
    },
    mouseOut(e) {
      console.log(e)
    },
  },
  mounted() {
    setTimeout(() => this.add({ body: 'Opa' }), 2000)

    window.addEventListener('keydown', e => {
      this.add({
        icon: require('./icon.png'),
        title: 'Foo',
        body: `Bar "${this.lastId}".`,
        duration: 10000,
        actions: [
          {id: 'Y', text: 'Yes'},
          {id: 'N', text: 'No'},
        ],
        onAction(action) {
          console.log('Resposta do usuário!', action)
        },
      })
    })
  },
}
</script>
<style lang="stylus">
.oh-notifications {
  color: #FFF;
  font-size: 12px;
  font-weight: bold;

  .oh-notification {
    background: rgba(#2b2b2b, 0.75);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    display: flex;
    align-items: flex-start;
    cursor: default;
    user-select: none;

    &-icon {
      flex: 0 auto;
      margin-right: 8px;
      width: 50px;
      height: 50px;
    }

    &-title {
      margin-bottom: 4px;
      font-size: 14px;
    }

    &-body {
      flex: 1;

      img {
        max-width: 100%;
        max-height: 320px;
        object-fit: cover;
        margin-bottom: 4px;
      }
    }

    &-actions {
      margin-top: 8px;
      text-align: right;

      a {
        display: inline-block;
        color: #FFF;
        margin-left: 8px;
      }
    }
  }
}
</style>