<template>
  <px-scrollview class="oh-palette">
    <div class="oh-palette-grid">
      <label
        v-for="(item) in colors"
        :key="item.id"
        :class="['oh-palette-color', {'oh-palette-color--selected': item.id === value}]"
        :style="{background: `#${item.color}`}"
        @click="$emit('input', item.id)"
      ></label>
    </div>
  </px-scrollview>
</template>

<script>
export default {
  props: ['palette', 'value'],
  computed: {
    colors() {
      return Object.keys(this.palette || {})
        .map(id => ({
          ...this.palette[id],
          id,
        }))
        .sort((a, b) => a.index - b.index)
    },
  },
}
</script>

<style lang="stylus">
.oh-palette {
  height: auto;
  border-radius: 0.5em;
  background: rgba(#FFF, 25%);
  height: 128px;
  padding: 4px;

  & + & {
    margin-left: 8px;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16px, 1fr));
    grid-gap: 4px;
  }

  &-color {
    background: #E00;
    border: 1px solid rgba(#000, 25%);
    border-radius: 16px;
    height: 16px;
    cursor: pointer;

    &--selected {
      box-shadow: 0 0 0 3px rgba(#000, 0.75);
    }
  }
}
</style>