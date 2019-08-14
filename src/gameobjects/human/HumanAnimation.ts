import { HumanLayer } from './HumanLayer'

export type THumanDirection = 0 | 2 | 4 | 6
type DirectionName = 'front' | 'left' | 'right' | 'back'

export const HumanDirection: Record<DirectionName, THumanDirection> = {
  front: 2,
  left: 0,
  right: 4,
  back: 6,
}

type DirectionDictionary = Record<THumanDirection, (() => void)[]>

export class HumanAnimation {
  private directionListeners: DirectionDictionary = Object.create(null)
  private frameListeners: ((frame: number) => void)[] = []
  private layer: HumanLayer
  private lastDirection: THumanDirection

  constructor(layer: HumanLayer) {
    this.layer = layer
    this.initState()
  }

  public onFrame(frame: number, listener: () => any) {
    let direction: DirectionName
    let lastFrame: number

    this.frameListeners.push(currentFrame => {
      if (currentFrame !== frame || currentFrame === lastFrame) {
        return
      }
      lastFrame = currentFrame
      if (direction) {
        HumanDirection[direction] === this.lastDirection && listener()
        return
      }
      listener()
    })

    return {
      /**
       * Calls listeners only when current direction is @param _direction
       */
      ofDirection(_direction: DirectionName) {
        direction = _direction
      },
    }
  }

  public onTurn(direction: DirectionName, callback: () => void) {
    const directionId = HumanDirection[direction]
    this.directionListeners[directionId].push(callback)
    this.onFrame(0, () => this.callListeners()).ofDirection(direction)
  }

  private callListeners(direction = this.lastDirection) {
    const listeners = this.directionListeners
    if (!listeners[direction]) {
      return
    }
    this.directionListeners[direction].forEach(listener => listener())
  }

  private initState() {
    for (const direction of Object.values(HumanDirection)) {
      this.directionListeners[direction] = []
    }

    this.layer.sprite.onFrameChange = frame => this.frameListeners.forEach(listener => listener(frame))

    this.layer.attrs2.watch('direction', (direction: THumanDirection) => {
      // Preventing exagerated listener calls
      if (direction === this.lastDirection || !this.directionListeners[direction]) {
        return
      }
      this.lastDirection = direction
    })
  }
}
