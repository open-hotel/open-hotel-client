import { IAnimation, IAnimationFrame } from './IAnimation'
import cloneDeep from 'lodash.clonedeep'
import { lcm } from '../../../../engine/lib/util/Util'

export class AnimationManager {
  public animations: IAnimation[] = []
  public frames: Required<IAnimationFrame>[] = []
  public frameCount = 0
  public currentFrame = -1

  private getFrameRef(frameIndex: number) {
    if (this.frames[frameIndex] === undefined) {
      const prevFrame = this.frames[frameIndex - 1]

      this.frames[frameIndex] = prevFrame
        ? cloneDeep(prevFrame)
        : {
            bodyparts: {},
            offsets: {}
          }
    }

    return this.frames[frameIndex]
  }

  private countAnimationFrames(animation: IAnimation) {
    return animation.frames.reduce((acc, frame) => {
      const count = Object.values(frame.bodyparts || {})
        .reduce((max, part) => Math.max(max, Number(part.repeats || 1)), 0)

      return acc + count
    }, 0)
  }

  nextFrame() {
    this.currentFrame = (this.currentFrame + 1) % this.frameCount
    return this.frames[this.currentFrame]
  }

  buildFrames() {
    const animationsFrameCount = this.animations.map(this.countAnimationFrames)

    this.frameCount =
      animationsFrameCount.length > 1
        ? lcm(...animationsFrameCount)
        : animationsFrameCount[0]

    this.frames = new Array(this.frameCount)

    this.animations.forEach(({ frames }, animationIndex) => {
      const animationFrameCount = animationsFrameCount[animationIndex]

      for (
        let frameIndex = 0;
        frameIndex < this.frameCount;
        frameIndex += animationFrameCount
      ) {
        frames.forEach(({ bodyparts, offsets }, f) => {
          const frameRef = this.getFrameRef(frameIndex + f)

          frameRef.offsets = offsets || {}

          for (const [setType, bodyPart] of Object.entries(bodyparts || {})) {
            const repeat = bodyPart.repeats || 1

            for (let r = 0; r < repeat; r++) {
              const frameRef = this.getFrameRef(frameIndex + f + r)

              frameRef.bodyparts[setType] = bodyPart
            }
          }
        })
      }
    })

    return this
  }
}
