import { HmacSHA256, enc } from 'crypto-js'
import uuid4 from 'uuid'
import MsgPack from 'msgpack-js-browser'
export class ClientPacket {
  static from(data: ArrayBuffer) {
    const [uuid, event, payload, signature] = MsgPack.decode(data)
    return new ClientPacket(event, payload, uuid, signature)
  }

  constructor(public event: string, public payload = null, public uuid: string = uuid4(), public signature?: string) {}

  sign(secret) {
    const { event, payload, uuid } = this
    const data = JSON.stringify(`${uuid}:${event}:${payload}`)
    const signature = HmacSHA256(data, secret).toString(enc.Base64)

    return new ClientPacket(event, payload, uuid, signature)
  }

  validate(secret) {
    const { signature } = this.sign(secret)
    return signature === this.signature
  }

  toBuffer() {
    const payload = [this.uuid, this.event, this.payload, this.signature]
    return MsgPack.encode(payload)
  }
}
