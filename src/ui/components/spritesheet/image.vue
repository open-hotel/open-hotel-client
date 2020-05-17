<template>
  <div>
    <img :src="url" />
    <pre>{{frameData}}</pre>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  name: 'OhImage',
  props: {
    data: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    frame: {
      type: String,
      required: true,
    },
  },
  data() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    return {
      canvas,
      ctx,
      url: '',
    }
  },
  created() {
    this.updateImage()
  },
  computed: {
    frameData() {
      return this.data.frames[this.frame]
    },
  },
  methods: {
    updateImage() {
      const image = new Image()

      image.src = this.image
      image.crossOrigin = 'anonymous'

      image.addEventListener('load', () => {
        const { frame, spriteSourceSize, rotated } = this.frameData
        let sx = 0
        let sy = 0

        this.canvas.width = spriteSourceSize.w
        this.canvas.height = spriteSourceSize.h

        if (rotated) {
          this.ctx.translate(spriteSourceSize.x, spriteSourceSize.y)
          //   this.ctx.rotate((-90 * Math.PI) / 180)
          this.canvas.width = spriteSourceSize.h
          this.canvas.height = spriteSourceSize.w
          //   sx = -this.canvas.width / 2
          //   sy = -this.canvas.height / 2
        }

        this.ctx.drawImage(
          image,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          spriteSourceSize.x,
          spriteSourceSize.y,
          spriteSourceSize.w,
          spriteSourceSize.h,
        )
        this.url = this.canvas.toDataURL()
      })
    },
  },
}
</script>