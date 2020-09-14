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

      this.frames[frameIndex] = cloneDeep(prevFrame ?? {
        bodyparts: {},
        offsets: {}
      })
    }

    return this.frames[frameIndex]
  }

  // Add and normalize animation
  add(animation: IAnimation) {
    animation = cloneDeep(animation)

    const bodyPartsEnds = [...new Set(
      animation.frames.flatMap((frame) => Object.keys(frame.bodyparts))
    )]
    
    bodyPartsEnds.forEach((setType) => {
      const endIndex = animation.frames.findIndex(frame => !(setType in frame.bodyparts))
      
      
      for (let i = endIndex; i >= 0 && i < animation.frames.length; i++) {
        const frame = animation.frames[i]
        const loopFrame = animation.frames[i % endIndex]
        
        frame.bodyparts[setType] = loopFrame.bodyparts[setType]
      }
    }, {})

    this.animations.push(animation)

    return this
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

    this.animations.forEach(({ frames, desc }, animationIndex) => {
      const animationFrameCount = animationsFrameCount[animationIndex]

      for (
        let frameIndex = 0;
        frameIndex < this.frameCount;
        frameIndex += animationFrameCount
      ) {

        let loadedFrames = 0
        frames.forEach(({ bodyparts, offsets }) => {
          let maxRepeat = 0

          for (const [setType, bodyPart] of Object.entries(bodyparts || {})) {
            const repeat = Number(bodyPart.repeats || 1)
            maxRepeat = Math.max(maxRepeat, repeat)
            
            for (let r = 0; r < repeat; r++) {
              const frameRefIndex = frameIndex + loadedFrames + r
              const frameRef = this.getFrameRef(frameRefIndex)
              frameRef.offsets = offsets || {} as IAnimationFrame['offsets']

              frameRef.bodyparts[setType] = cloneDeep(bodyPart)
            }
          }

          loadedFrames += maxRepeat
        })
      }
    })

    return this
  }
}
