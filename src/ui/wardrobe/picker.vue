<template>
  <div class="oh-part-picker">
    <px-scrollview style="flex: 1;">
      <oh-part-picker
        :colors="colors"
        :gender="gender"
        :geometry="geometry"
        :type="type"
        :value="attrs.id"
        @input="setValue({ id: $event })"
      />
    </px-scrollview>
    <div class="colors" v-if="palettes.length">
      <oh-palette
        v-for="(palette, i) in palettes"
        :value="colors[i]"
        :key="i"
        :palette="palette"
        @input="setColor(i, $event)"
      />
    </div>
  </div>
</template>
<script>
import OhPalette from './palette'
import OhPartPicker from './part-picker'
import { ImagerModule } from '../../game/imager/imager.module'
import { Loader } from '../../engine/loader'

export default {
  components: {
    OhPalette,
    OhPartPicker,
  },
  $injets: {
    module: ImagerModule,
    inject: {
      loader: Loader,
    },
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'hd',
    },
    gender: {
      type: String,
      default: 'M',
    },
    geometry: {
      type: String,
      default: 'vertical',
    },
  },
  watch: {
    value(a, b) {
      if (a[this.type].id != b[this.type].id) {
        this.setColor()
      }
    },
  },
  computed: {
    palettes() {
      const { figuremap, figuredata } = this.loader.resources
      const palette = figuredata.json.palette[figuredata.json.settype[this.type].paletteid]
      const { set } = figuredata.json.settype[this.type]
      const { id = Object.keys(set)[0] } = this.attrs
      const count = set[id].parts.reduce((max, item) => Math.max(max, Number(item.colorindex)), 0)
      return new Array(count).fill(palette)
    },
    attrs() {
      return (this.value && this.value[this.type]) || {}
    },
    colors: {
      get() {
        return this.attrs.colors || []
      },
      set(colors) {
        this.setValue({ colors })
      },
    },
  },
  methods: {
    setColor(index, color) {
      const colors = this.colors.slice(0, this.palettes.length)
      if (index !== undefined) colors[index] = color
      this.setValue({ colors })
    },
    setValue(value) {
      this.$emit('input', {
        ...(this.value || {}),
        [this.type]: {
          ...this.attrs,
          ...value,
        },
      })
    },
  },
}
</script>
<style lang="stylus">
.oh-part-picker {
  display: flex;
  flex-direction: column;

  .colors {
    display: flex;
    flex-direction: row;
    flex: 0 auto;
    margin-top: 8px;
  }
}
</style>