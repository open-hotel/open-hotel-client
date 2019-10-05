import { createHmac } from 'crypto-js'
import uuid4 from 'uuid'
import MsgPack from 'what-the-pack'

const { encode, decode } = MsgPack.initialize(2 ** 22)

export class ClientPacket {
  static from(data) {
    const p = decode(data)
    return new ClientPacket('VOID')
  }

  constructor(
    public event: string,
    public payload = null,
    public uuid: string = uuid4(),
    public signature?: string,
  ) {}

  sign(secret) {
    const { event, payload, uuid } = this
    const data = JSON.stringify(`${uuid}:${event}:${payload}`)
    const signature = createHmac('sha256', secret)
      .update(data, 'utf8')
      .digest('base64')

    return new ClientPacket(event, payload, uuid, signature)
  }

  validate(secret) {
    const { signature } = this.sign(secret)
    return signature === this.signature
  }

  toBuffer() {
    const payload = [this.uuid, this.event, this.payload, this.signature]
    return encode(payload)
  }
}
