<template>
  <transition name="popup">
    <div
      v-if="visible"
      :class="[
        'window',
        { 'window--focused': current.focused, 'window--resizable': resizable }
      ]"
      tabindex="-1"
      :style="computedStyle"
      ref="window"
      @touchmove.prevent="canMove ? handleMove($event.touches[0]) : null"
      @pointerdown="current.focused = true"
      @pointermove="canMove && handleMove"
      @touchend="canMove = false"
    >
      <template v-if="titlebar">
        <slot name="titleBar" v-if="$slots.titleBar" />
        <div
          v-else
          class="window-title"
          ref="titleBar"
          @pointerdown="handleMouseDown($event.pageX, $event.pageY)"
        >
          <slot name="title" v-if="$slots.title" />
          <span v-else-if="title" class="window-title-text">{{ title }}</span>
          <slot name="windowActions" v-if="$slots.windowActions" />
          <div class="window-actions">
            <button
              v-if="minimizable"
              class="window-action window-action-minimize"
              @click="minimize"
            ></button>
            <button
              v-if="closeable"
              class="window-action window-action-close"
              @click="close"
            ></button>
          </div>
        </div>
      </template>
      <div class="window-content">
        <div class="window-content-body">
          <slot />
        </div>
        <div class="window-footer">
          <slot name="footer" />
        </div>
      </div>
      <div
        v-if="resizable"
        class="window-resizer"
        ref="resizeButton"
        @pointerdown="handleClickResize"
      ></div>
    </div>
  </transition>
</template>

<style lang="stylus">
.window {
  display: flex;
  flex-direction: column;
  position: absolute;
  color: #333;
  border-radius: 8px;
  border: 1px solid #000;
  box-shadow: 0 0 0 rgba(#000, 0.82);
  font-size: 14px;
  max-width: 100%;
  outline: none;
  transition: box-shadow 0.21s ease;
  font: 13px Roboto, Arial, sans-serif;
  background: #568ba4;
  overflow: hidden;

  &-title {
    flex: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.25em;
    min-height: 32px;
    border: 2px double #69a6c3;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    cursor: default;
    position: relative;

    &-text {
      flex: 1;
      color: #FFF;
      text-align: center;
    }
  }

  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;

    &-body {
      flex: 1;
      height: 100%;
      display: flex;
      flex-flow: column;
    }
  }

  &-resizer {
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 0;
    right: 0;
    cursor: nwse-resize;
    z-index: 1;
    user-select: none;
  }

  &--focused {
    box-shadow: 0 4px 8px rgba(#000, 0.82), 0 4px 0 rgba(#000, 0.82);
    z-index: 99999999;
  }

  &-actions {
    position: absolute;
    right: 0.3em;
    top: 0.3em;
  }

  &-action {
    width: 20px;
    height: 20px;
    border: none;
    background-color: transparent;
    background-image: url('./assets/controls.png');
    background-repeat: no-repeat;
    cursor: pointer;
    margin: 0 2px;

    &-close {
      background-position: -140px -10px;

      &:hover {
        background-position: -200px -10px;
      }

      &:active {
        background-position: -169px -10px;
      }
    }

    &-minimize {
      background-image: url('./assets/minimize.png');

      &:hover {
        opacity: 0.82;
      }

      &:active {
        background-image: url('./assets/minimize-press.png');
      }
    }
  }

  &-footer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
  }
}

.popup {
  &-enter-active, &-leave-active {
    transition: all 0.4s cubic-bezier(0.75, -0.5, 0, 1.75);
  }

  &-enter, &-leave-to {
    transform: scale(0.8);
    opacity: 0;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch, Model } from 'vue-property-decorator'

@Component
export default class Window extends Vue {
  // Props
  @Model('change', { type: Boolean, default: true }) visible!: boolean
  @Prop({ type: Boolean, default: true }) focused!: boolean
  @Prop({ type: Boolean, default: true }) titlebar!: boolean
  @Prop({ type: Boolean, default: true }) closeable!: boolean
  @Prop({ type: Boolean, default: false }) minimizable!: boolean
  @Prop({ type: Boolean, default: false }) resizable!: boolean
  @Prop({ type: Boolean, default: false }) minimized!: boolean
  @Prop({ type: Boolean, default: false }) closed!: boolean
  @Prop({ type: Boolean, default: true }) center!: boolean
  @Prop({ type: Number }) x!: number
  @Prop({ type: Number }) y!: number
  @Prop({ type: Number }) width!: number
  @Prop({ type: Number }) height!: number
  @Prop({ type: Number, default: 128 }) minWidth!: number
  @Prop({ type: Number, default: 128 }) minHeight!: number
  @Prop({ type: Number, default: 800 }) maxWidth!: number
  @Prop({ type: Number, default: 600 }) maxHeight!: number
  @Prop({ type: String, default: 'Message' }) title!: string

  @Watch('focused')
  private setFocused(focused: boolean) {
    this.current.focused = focused
  }

  @Watch('value')
  private setVisibility(visible: boolean) {
    this.current.visible = visible
  }

  @Watch('width')
  private setWidth(width: number) {
    this.current.width = width
  }

  @Watch('height')
  private setHeight(height: number) {
    this.current.height = height
  }
  @Watch('maxHeight')
  private setMaxHeight(maxHeight: number) {
    this.current.height = this.normalizeValue(
      this.current.height,
      this.minHeight,
      maxHeight
    )
  }

  @Watch('maxWidth')
  private setMaxWidth(maxWidth: number) {
    this.current.width = this.normalizeValue(
      this.current.width,
      this.maxWidth,
      maxWidth
    )
  }

  @Watch('minHeight')
  private setMinHeight(minHeight: number) {
    this.current.height = this.normalizeValue(
      this.current.height,
      minHeight,
      this.maxHeight
    )
  }

  @Watch('minWidth')
  private setMinWidth(minWidth: number) {
    this.current.width = this.normalizeValue(
      this.current.width,
      minWidth,
      this.maxWidth
    )
  }

  @Watch('x')
  private setPositionX(x: number) {
    this.current.x = x
  }

  @Watch('y')
  private setPositionY(y: number) {
    this.current.y = y
  }

  // Data
  canMove: boolean = false
  offset = { x: 0, y: 0 }
  current = {
    visible: this.visible,
    x: this.x || 0,
    y: this.y || 0,
    width: this.width || 320,
    height: this.height || 240,
    focused: !!this.focused,
    minimized: this.minimized,
    closed: this.closed
  }

  private handleBlur(e: any) {
    e.stopPropagation()

    this.current.focused = e.path.some((el: HTMLElement) => el === this.$el)
  }

  private handleStopDrag(e: Event) {
    this.canMove = false
    const $el = e.target as any

    this.$parent.$el.removeEventListener('pointerup', this.handleStopDrag)
    this.$parent.$el.removeEventListener('pointermove', this.handleMove)
    this.$parent.$el.removeEventListener('pointermove', this.handleLeaveResize)
  }

  private handleMove(e: Event) {
    const { pageX: x, pageY: y } = e as PointerEvent

    this.current = {
      ...this.current,
      x: this.offset.x + x,
      y: this.offset.y + y
    }

    this.$emit('move', this.current)
    this.$emit('update:x', this.current.x)
    this.$emit('update:y', this.current.y)
  }

  private handleResize(e: Event) {
    e.stopPropagation()
    e.preventDefault()

    const { pageX, pageY } = e as PointerEvent
    const $el = this.$el as any
    const $parent = this.$parent.$el as any
    const x = pageX - $parent.offsetLeft
    const y = pageY - $parent.offsetTop
    const width = x - this.current.x
    const height = y - this.current.y
    this.current = {
      ...this.current,
      width: this.normalizeValue(width, this.minWidth, this.maxWidth),
      height: this.normalizeValue(height, this.minHeight, this.maxHeight)
    }
  }

  private handleClickResize(e: Event) {
    const $parent = this.$parent.$el as HTMLDivElement
    $parent.addEventListener('pointermove', this.handleResize)
    $parent.addEventListener(
      'pointerup',
      () => {
        $parent.removeEventListener('pointermove', this.handleResize)
      },
      { once: true }
    )
  }

  private handleLeaveResize(e: Event) {
    const $parent = this.$parent.$el as HTMLDivElement
    $parent.removeEventListener('pointermove', this.handleResize)
  }

  private normalizeValue(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }

  private handleMouseDown(x: number, y: number) {
    const window = this.$refs.window as HTMLDivElement

    this.current.focused = true

    this.offset = {
      x: window.offsetLeft - x,
      y: window.offsetTop - y
    }

    this.canMove = true

    this.$parent.$el.addEventListener('pointerup', this.handleStopDrag)
    this.$parent.$el.addEventListener('pointermove', this.handleMove)
  }

  get computedStyle() {
    const el = this.$el as HTMLDivElement
    const parentEl = this.$parent.$el as HTMLDivElement
    const titlebar = (this.$refs.titleBar as HTMLDivElement) || {
      offsetHeight: 0,
      offsetWidth: 0,
    }
    const maxX = (parentEl && parentEl.offsetWidth - 16) || Infinity
    const maxY =
      (parentEl && parentEl.offsetHeight - titlebar.offsetHeight) || Infinity
    const minX = (titlebar && 16 - titlebar.offsetWidth) || -Infinity
    const minY = 0
    const maxWidth = (parentEl && parentEl.offsetWidth) || Infinity
    const maxHeight = (parentEl && parentEl.offsetHeight) || Infinity

    return {
      top: `${this.normalizeValue(this.current.y, minY, maxY)}px`,
      left: `${this.normalizeValue(this.current.x, minX, maxX)}px`,
      width: `${this.normalizeValue(this.current.width, 128, maxWidth)}px`,
      height: `${this.normalizeValue(this.current.height, 128, maxHeight)}px`
    }
  }

  close() {
    this.current.visible = false
    this.$emit('change', false)
    this.$emit('update:visible', false)
    this.$emit('close')
  }

  minimize() {
    this.current.visible = false
    this.current.minimized = true

    this.$emit('input', this.current.visible)
    this.$emit('update:minimized', true)
    this.$emit('update:visible', false)
  }

  mounted() {
    const $el = this.$el as HTMLDivElement
    const $parentEl = this.$parent.$el as HTMLDivElement
    const $resize = this.$refs.resizeButton as HTMLDivElement

    $parentEl.addEventListener('pointerdown', this.handleBlur.bind(this))

    if (this.center && !this.x && !this.y) {
      this.current = {
        ...this.current,
        x: $parentEl.offsetWidth / 2 - $el.offsetWidth / 2,
        y: $parentEl.offsetHeight / 2 - $el.offsetHeight / 2
      }
    }
  }
}
</script>
