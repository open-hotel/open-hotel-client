import { HumanLayer } from './HumanLayer'

export type THumanDirection = 0 | 2 | 4 | 6
type DirectionName = 'front' | 'left' | 'right' | 'back'

const directionNames: DirectionName[] = ['front', 'left', 'right', 'back']

export const HumanDirection: Record<DirectionName, THumanDirection> = {
  front: 2,
  left: 0,
  right: 4,
  back: 6,
}

type DirectionDictionary = Record<THumanDirection, (() => void)[]>

interface FrameManager {
  /**
   * Calls listeners only when current direction is @param _direction
   */
  ofDirection(_direction: DirectionName): FrameManager
  /**
   * Calls listener each frame between frame and endframe (inclusive)
   */
  to(_endFrame: number): FrameManager
  listen(_listener: (frame?: number) => void): FrameManager
}

export class HumanAnimation {
  private directionListeners: DirectionDictionary = Object.create(null)
  private frameListeners: ((frame: number) => void)[] = []
  private layer: HumanLayer
  private lastDirection: THumanDirection

  constructor(layer: HumanLayer) {
    this.layer = layer
    this.initState()
  }

  public onFrame(frame: number, listener?: (frame?: number) => void): FrameManager {
    // Closure state
    let direction: DirectionName
    let endFrame: number

    this.frameListeners.push(currentFrame => {
      if (endFrame) {
        const isBetween = currentFrame >= frame && currentFrame <= endFrame
        if (!isBetween) {
          return
        }
      } else if (currentFrame !== frame) {
        return
      }
      if (direction) {
        HumanDirection[direction] === this.lastDirection && listener(currentFrame)
        return
      }
      listener(currentFrame)
    })

    return {
      ofDirection(_direction) {
        direction = _direction
        return this
      },
      to(_endFrame) {
        endFrame = _endFrame
        return this
      },
      listen(_listener) {
        listener = _listener
        return this
      },
    }
  }

  /**
   * Function called on frame 0 of the chosen direction animation
   */
  public onTurn(direction: DirectionName, callback: () => void) {
    const directionId = HumanDirection[direction]
    this.directionListeners[directionId].push(callback)
  }

  /**
   * shorthand for onTurn calls
   */
  public turns(listeners: Partial<Record<DirectionName, () => void>>) {
    for (const dir of directionNames) {
      listeners[dir] && this.onTurn(dir, listeners[dir])
    }
  }

  private callListeners(direction = this.lastDirection) {
    const listeners = this.directionListeners
    if (!listeners[direction]) {
      return
    }
    this.directionListeners[direction].forEach(listener => listener())
  }

  // Inits

  private initFrameListeners() {
    let lastFrame: number
    this.layer.sprite.onFrameChange = frame => {
      if (frame === lastFrame) {
        lastFrame = frame
        return
      }
      lastFrame = frame
      this.frameListeners.forEach(listener => listener(frame))
    }
  }

  private initDirectionListeners() {
    for (const direction of Object.values(HumanDirection)) {
      this.directionListeners[direction] = []
    }
    this.layer.attrs2.watch('direction', (direction: THumanDirection) => {
      // Preventing exaggerated listener calls
      if (direction === this.lastDirection || !this.directionListeners[direction]) {
        return
      }
      this.lastDirection = direction
      this.callListeners()
    })
  }

  private initState() {
    this.initFrameListeners()
    this.initDirectionListeners()
  }
}
