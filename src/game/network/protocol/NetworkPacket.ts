export class NetworkPacket<T> {
  constructor(
    public op: T,
    public body = null
  ) {}
}
