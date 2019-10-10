import { ClientPacket as Packet } from './ClientPacket'
import { EventEmitter } from '../reactivity'

export class Socket extends EventEmitter {
  private connection: WebSocket
  private secret: string = '123'

  constructor(private url: string) {
    super()
  }

  connect(ticket: string = '12345678') {
    this.disconnect()
    this.connection = new WebSocket(`${this.url}?ticket=${ticket}`)
    this.connection.binaryType = 'arraybuffer'

    // Receive Messages
    this.connection.addEventListener('message', async (event: MessageEvent) => {
      const packet = Packet.from(event.data)

      if (packet.validate(this.secret)) {
        super.emit('ws:input', packet)
        super.emit(packet.event, ...[].concat(packet.payload))
      }
    })

    return new Promise((resolve, reject) => {
      this.connection.addEventListener(
        'open',
        () => {
          super.emit('ws:connect')
          resolve(this)
        },
        { once: true },
      )
      this.connection.addEventListener(
        'error',
        error => {
          super.emit('ws:error')
          reject(error)
        },
        { once: true },
      )
      this.connection.addEventListener(
        'close',
        e => {
          super.emit('ws:disconnect')
          if (e.code !== 1000) {
            setTimeout(() => this.connect(ticket), 5000)
          }
        },
        { once: true },
      )
    })
  }

  disconnect() {
    if (!this.connection) {
      return
    }
    this.connection.close()
  }

  emit(event: string, ...payload: any[]) {
    const packet = new Packet(event, payload).sign(this.secret)
    super.emit('ws:output', packet)
    this.connection.send(packet.toBuffer())
  }
}
