<template>
  <div class="chat text-center full-width">
    <div class="chat-history">
      <div class="history-container">
        <speech
          v-for="(speech, idx) in lastTexts"
          :key="idx"
          :style="{ transform: `translateY(${speech.transformY}px)` }"
          :text="speech.text"
        />
      </div>
    </div>
    <input v-model="currentText" type="text" class="chat-box" placeholder="Say hello!" @keydown.enter="onEnter" />
  </div>
</template>

<script lang="ts">
import Speech from './Speech.vue'

const STEP = 30

export default {
  components: {
    Speech,
  },
  data() {
    return {
      lastTexts: [],
      currentText: '',
    }
  },
  mounted() {
    this.initAutoscroll()
  },
  methods: {
    goTop() {
      this.lastTexts.forEach(text => (text.transformY -= STEP))
    },
    initAutoscroll() {
      const goTop = () => this.goTop()
      setInterval(goTop, 2000)
    },
    checkMoveTop(transformCheck = 0) {
      let toTop = this.lastTexts.find(text => text.transformY === transformCheck)
      const nextPosition = transformCheck - STEP
      if (toTop) {
        this.checkMoveTop(nextPosition)
        toTop.transformY = nextPosition
      }
    },
    onEnter(event) {
      this.checkMoveTop()
      this.lastTexts.push({
        text: event.target.value,
        transformY: 0,
      })
      this.currentText = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.history-container {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.chat-history {
  width: 100%;
  height: 35%;
  position: fixed;
  pointer-events: none;
  top: 0;
  overflow: hidden;
}
.chat {
  position: fixed;
  bottom: 20px;
}
.chat-box {
  width: 500px;
  font-size: 15px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
}
@media screen and (max-width: 768px) {
  .chat-box {
    width: 90%;
    font-size: 60px;
    border-radius: 10px;
    &::placeholder {
      text-align: center;
    }
  }
}
</style>
