let interval = null
const fps_interval = 1000 / 12
let lastFrame = 0

const updateTicker = time => {
  const elapsed = time - lastFrame

  if (elapsed >= fps_interval) {
    self.postMessage('ticker')
    lastFrame = time
  }

  requestAnimationFrame(updateTicker)
}
const methods = {
  startTicker: () => {
    clearInterval(interval)
    requestAnimationFrame(updateTicker)
  },
  stopTicker: () => {
    cancelAnimationFrame(updateTicker)
  },
}

self.addEventListener('message', e => {
  if (e.data in methods) {
    methods[e.data].call(this)
  }
})
