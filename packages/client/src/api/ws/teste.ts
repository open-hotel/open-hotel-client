import { Socket } from '@open-hotel/core'

const WS = new Socket(process.env.VUE_APP_WS_URL)

WS.connect().then(ws => {
  WS.on('echo', data => {
    console.log('echoing ws data', data)
  })
  setInterval(() => {
    WS.emit('echo', Date.now())
  }, 1000)
})
