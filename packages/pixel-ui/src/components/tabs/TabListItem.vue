<template>
  <li
    :class="{
      'px-tab-list-item': true,
      'px-tab-list-item--active': active || value === target
    }"
    @click="$emit('input', target)"
  >
    <span>
      <slot />
    </span>
  </li>
</template>

<style lang="stylus">
.px-tab-list-item {
  display: flex;
  flex: 1;
  background: rgba(#FFF, 50%);
  border: 1px solid #000;
  border-bottom: 0;
  padding: 0.4em 0.8em;
  border-radius: 0.5em 0.5em 0 0;
  cursor: pointer;
  color: #000;
  text-align: center;
  align-items: center;
  justify-content: center;
  position: relative;

  &--active {
    background: #FFF;

    &:after {
      content: '';
      width: 100%;
      height: 1px;
      position: absolute;
      background: #FFF;
      top: 100%;
      left: 0;
    }
  }
}
</style>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    target: {
      type: String
    },
    value: {
      type: String
    }
  }
}
</script>
