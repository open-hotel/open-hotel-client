<template>
  <button
    :class="['oh-wardrobe-button', { active }]"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @click="$emit('click', $event)"
  >
    <img class="default" :src="require(`./icons/${name}.png`)" />
    <img class="active" :src="require(`./icons/${name}_selected.png`)" />
    <span>
      <slot></slot>
    </span>
  </button>
</template>
<script>
export default {
  props: {
    name: String,
    text: String,
    active: Boolean,
  },
  data() {
    return {
      hover: false,
    }
  },
}
</script>
<style lang="stylus">
.oh-wardrobe-button {
  background: none;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin-right: 1em;
  font-weight: bold;
  outline: none;

  .active {
    display: none;
  }

  &.active, &:hover {
    .default {
      display: none;
    }

    .active {
      display: inline-block;
    }
  }
}
</style>