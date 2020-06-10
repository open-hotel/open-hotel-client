import Vue from 'vue'
import Canvas from '../components/pixi/pixi.vue'
import { Container, Sprite, Graphics } from 'pixi.js'
import { Loader } from '../../engine/loader'
import { ImagerModule } from '../../game/imager/imager.module'

export default Vue.extend({
  extends: Canvas,
  $injets: {
    module: ImagerModule,
    inject: {
      loader: Loader,
    },
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    geometry: {
      type: String,
      default: 'vertical',
    },
    gender: {
      type: String,
      default: 'M',
    },
    hiddenlayers: {
      type: Array,
      default: () => ['bd', 'lh', 'rh'],
    },
    colors: {
      type: Array,
      default: () => [],
    },
    buttonColor: {
      type: Number,
      default: 0xffffff,
    },
  },
  data() {
    return {
      clearable: new Set(['hr', 'ha', 'he', 'ea', 'fa', 'ch', 'cc', 'cp', 'ca', 'sh', 'wa']),
    }
  },
  watch: {
    type() {
      this.generate()
    },
    colors() {
      this.generate()
    },
    value() {
      this.generate()
    },
    gender() {
      this.generate()
    },
  },
  mounted() {
    this.generate()
  },
  methods: {
    getGeometry(parttype) {
      for (const t in this.loader.resources.geometry.json.type[this.geometry]) {
        const item = this.loader.resources.geometry.json.type[this.geometry][t]
        if (!('items' in item) || !(parttype in item.items)) continue
        return {
          type: t,
          ...item,
        }
      }
    },
    getLibrary(type, id) {
      const {
        json: { libs, parts },
      } = this.loader.resources.figuremap
      const index = parts[type][id]
      const lib = index !== undefined && libs[index].id

      if (!lib && (type === 'ls' || type === 'rs')) {
        return this.getLibrary('ch', id)
      }

      return lib
    },
    getColor(paletteid, color) {
      const {
        json: { palette },
      } = this.loader.resources.figuredata
      const colors = palette[paletteid]
      const item = colors[color] || colors[Object.keys(colors)[0]]
      return Number(`0x${item.color}`)
    },
    async generate() {
      const { figuredata } = this.loader.resources
      const { settype } = figuredata.json
      const { set, paletteid, hiddenlayers = [] } = settype[this.type]
      const genders = new Set([this.gender, 'U'])
      const hidden = new Set(hiddenlayers.concat(this.hiddenlayers))
      const width = 64
      const height = 64
      const margin = 2
      const border = 4
      const qtPerLine = Math.floor(this.app.view.width / (width + margin + border))

      const typesAlias = {
        hrb: 'hr',
      }

      let i = 0

      this.app.stage.removeChildren(0, 1)
      const items = new Container()
      this.app.stage.addChild(items)

      if (this.clearable.has(this.type)) {
        i++
        const g = new Graphics()
        const selected = this.value === null || this.value === undefined;
        const size = 24;

        g.lineStyle(4, selected ? 0xffffff : 0xb4ccd8)
        g.moveTo(0, 0)
        g.lineTo(size, size)
        g.moveTo(size, 0)
        g.lineTo(0, size)

        const button = this.createButton({
          selected,
          child: g,
          width,
          height,
          border,
          onPress: () => this.$emit('input', null)
        })

        g.pivot.set(
          g.width / 2,
          g.height / 2,
        )
        g.position.set(
          (border + width) / 2,
          (border + height) / 2,
        )

        button.x = border
        button.y = border

        items.addChild(button)
      }

      for (const id in set) {
        const item = set[id]
        if (!genders.has(item.gender) || item.selectable != 1) continue
        const { parts } = item
        const libs = parts.reduce((acc, part) => {
          const lib = this.getLibrary(part.type, part.id)
          if (!lib) return acc
          acc[lib] = `${lib}/${lib}.json`
          return acc
        }, {})

        const group = new Container()
        const img = new Sprite()
        const groups = {}

        group.sortableChildren = true
        ;(async () => {
          await this.loader.add(libs).wait()

          for (const part of parts) {
            if (hidden.has(part.type)) continue
            let lib = this.getLibrary(typesAlias[part.type] || part.type, part.id)
            if (!lib) continue
            const {
              spritesheet: { textures },
              manifest: { assets },
            } = this.loader.resources[lib]
            const assetIds = [
              `h_std_${part.type}_${part.id}_2_0`,
              `h_std_${part.type}_${part.id}_1_0`,
              `h_std_${part.type}_${part.id}_0_0`,
              `h_std_${part.type}_${part.id}_3_0`,
              `h_sml_${part.type}_${part.id}_2_0`,
              `h_spk_${part.type}_${part.id}_2_0`,
              `h_spk_${part.type}_${part.id}_1_0`,
              `h_spk_${part.type}_${part.id}_0_0`,
              `h_lay_${part.type}_${part.id}_2_0`,
              `h_std_${part.type}_${part.id}_7_0`,
            ]
            const assetId = assetIds.find(id => `${lib}_${id}.png` in textures)
            const offsetId = assetIds.find(id => id in assets)

            if (!assetId) continue
            const textureId = `${lib}_${assetId}.png`
            const texture = textures[textureId]
            const sprite = new Sprite(texture)
            const [x, y] = (assets[offsetId].offset || '').split(',').map(v => Number(v))

            if (part.colorable == 1 && part.type !== 'ey') {
              const color = this.colors[part.colorindex - 1]
              sprite.tint = this.getColor(paletteid, color)
            }

            sprite.pivot.set(x, y)
            sprite.position.set(0, 0)

            const geometry = this.getGeometry(part.type)

            if (!(geometry.type in groups)) {
              const container = new Container()

              container.zIndex = geometry.radius
              container.sortableChildren = true

              groups[geometry.type] = container

              group.addChild(container)
            }

            sprite.zIndex = geometry.items[part.type].radius

            groups[geometry.type].addChild(sprite)
          }

          img.texture = this.app.renderer.generateTexture(group, 1, 1)

          img.position.set(centerX, centerY)
          img.pivot.set(Math.ceil(img.width / 2), Math.ceil(img.height / 2))
        })()

        const centerX = width / 2
        const centerY = height / 2

        const button = this.createButton({
          selected: id === this.value,
          child: img,
          width,
          height,
          border,
          onPress: () => this.$emit('input', id)
        })

        button.position.x = Math.ceil(border + (width + margin + border) * (i % qtPerLine))
        button.position.y = Math.ceil(border + (height + margin + border) * Math.floor(i / qtPerLine))

        items.addChild(button)
        i++
      }

      this.$nextTick(() => {
        this.app.renderer.resize(this.app.view.width, items.height + margin * 2)
      })
    },
    createButton({ selected = false, child, onPress = () => {}, width = 50, height = 50, border = 4 } = {}) {
      const g = new Graphics()
      const button = new Container()
      const centerX = width / 2
      const centerY = height / 2

      if (selected) g.lineStyle(border, 0xffffff, 1, 0)
      g.beginFill(this.buttonColor, 0.25)
      g.drawCircle(centerX, centerY, (width + height) / 2 / 2)

      button.addChild(g, child)

      button.interactive = true
      button.cursor = 'pointer'

      button
        .addListener('pointertap', onPress)
        .addListener('pointerover', () => {
          g.clear()

          if (selected) {
            g.lineStyle(border, 0xffffff, 1, 0)
          } else {
            g.lineStyle(border, 0xffffff, 0.75, 0)
          }
          g.beginFill(this.buttonColor, 0.25)
          g.drawCircle(centerX, centerY, (width + height) / 2 / 2)
        })
        .addListener('pointerout', () => {
          g.clear()

          if (selected) g.lineStyle(border, 0xffffff, 1, 0)
          g.beginFill(this.buttonColor, 0.25)
          g.drawCircle(centerX, centerY, (width + height) / 2 / 2)
        })

      return button
    },
  },
})
