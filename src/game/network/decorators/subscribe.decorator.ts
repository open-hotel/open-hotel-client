import { ServerEvent } from "../protocol/events/server.enum";

export function Subscribe(event: ServerEvent): MethodDecorator {
  return function (target, key, descriptor) {
    const { constructor } = target
    const subscribers = Reflect.getMetadata('net:incoming_subscribers', constructor) || []

    subscribers.push({
      event: event,
      handler: descriptor.value
    })

    Reflect.defineMetadata('net:incoming_subscribers', subscribers, constructor)
  }
}