import { ClientPacket as Packet } from './ClientPacket'
import { EventEmitter } from '../reactivity'

export class Socket extends EventEmitter {
  private connection: WebSocket
  private secret: string = '123'

  constructor (
    private url: string
  ) {
    super()
  }

  connect (ticket: string = '12345678') {
    this.disconnect()
    this.connection = new WebSocket(`${this.url}?ticket=${ticket}`)
    this.connection.onmessage = async (event) => {
      const buffer = await event.data.arrayBuffer()
      const packet = Packet.from(buffer)
      if (!packet.validate(this.secret)) {
        return
      }
      super.emit(packet.event, ...[].concat(packet.payload))
    }

    return new Promise((res, rej) => {
      this.connection.onopen = res
      this.connection.onerror = rej
    })
  }

  disconnect () {
    if (!this.connection) {
      return
    }
    this.connection.close()
  }

  on (event: string, handler: Function) {
    super.on(event, handler)
  }

  emit (event: string, ...payload: any[]) {
    const packet = new Packet(event, payload)
      .sign(this.secret)
      .toBuffer()
    this.connection.send(packet)
  }
}
