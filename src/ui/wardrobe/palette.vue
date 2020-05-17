<template>
  <px-scrollview class="oh-palette">
    <div class="oh-palette-grid">
      <label
        v-for="(item, id) in palette"
        :key="id"
        :class="['oh-palette-color', {'oh-palette-color--selected': id === value}]"
        :style="{background: `#${item.color}`}"
        @click="$emit('input', id)"
      ></label>
    </div>
  </px-scrollview>
</template>

<script>
export default {
  props: ['palette', 'value'],
}
</script>

<style lang="stylus">
.oh-palette {
  height: auto;
  border-radius: 0.5em;
  background: rgba(#FFF, 25%);
  height: 128px;
  padding: 4px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(22px, 1fr));
    grid-gap: 4px;
  }

  &-color {
    background: #E00;
    border: 1px solid rgba(#000, 25%);
    border-radius: 4px;
    height: 16px;
    cursor: pointer;

    &--selected {
      border: 2px solid #000;
    }
  }
}
</style>