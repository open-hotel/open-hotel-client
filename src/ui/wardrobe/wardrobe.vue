<template>
  <div v-if="figuredata" style="flex: 1; display: flex; flex-flow: column">
    <px-tab-list>
      <px-tab-list-item
        v-for="tab in tabs"
        :key="tab.id"
        :value="currentTab.id"
        :target="tab.id"
        @click.native="changeTab(tab)"
      >{{ tab.text }}</px-tab-list-item>
    </px-tab-list>
    <button
      v-for="item in currentTab.tabs"
      :key="item.id"
      @click="changeSubTab(item)"
    >{{ item.icon }}</button>
    <px-tab-container style="padding: 0.5em; background: none">
      <px-tab-view v-model="tab" name="body" class="fill" style="display: flex; flex-flow: column;">
        <px-scrollview class="wardrobe-items">
          <button
            v-for="item in items"
            :key="item.id"
            :class="{'selected': item.id === figure[current.type][0]}"
            @click="setPartId(item.id)"
          >
            <img v-if="item.data" :src="item.data" alt />
            <img v-else src="./icons/placeholder.png" alt />
          </button>
        </px-scrollview>
        <div class="wardrobe-palettes">
          <oh-palette
            v-for="(item, i) in palettes"
            :key="i"
            v-model="figure[current.type][i + 1]"
            :palette="item.palette"
            @input="buildItems()"
          />
        </div>
      </px-tab-view>
      <div class="wardrobe-preview" style="display: flex; flex-flow: column">
        <px-scrollview>
          <pre>{{ figure }}</pre>
        </px-scrollview>
        <px-btn color="success">Salvar</px-btn>
      </div>
    </px-tab-container>
  </div>
</template>

<script>
import Vue from 'vue';
import OhPalette from './palette'
import { Loader } from '../../engine/loader'
import { ApplicationProvider } from '../../game/pixi/application.provider'
import { Sprite } from 'pixi.js-legacy'
import { HumanImager } from '../../game/imager/human.imager'
import { ImagerModule } from '../../game/imager/imager.module'
export default {
  components: {
    OhPalette,
  },
  $injets: {
    module: ImagerModule,
    inject: {
      app: ApplicationProvider,
      loader: Loader,
      avatarImager: HumanImager,
    },
  },
  data() {
    return {
      tab: 'body',
      items: [],
      current: {
        type: 'hd',
        gender: 'M',
        geometry: {
          type: 'vertical',
          part: 'head',
        },
      },
      figuredata: null,
      imageData: '',
      currentTab: null,
      tabs: [
        {
          id: 'body',
          text: 'Rosto e corpo',
          currentTab: null,
          tabs: [
            {
              icon: 'male',
              text: 'Menino',
              setCurrent: {
                type: 'hd',
                gender: 'M',
              },
            },
            {
              icon: 'female',
              text: 'Menina',
              setCurrent: {
                type: 'hd',
                gender: 'F',
              },
            },
          ],
        },
        {
          id: 'head',
          text: 'Cabeça',
          currentTab: null,
          tabs: [
            {
              icon: 'male',
              setCurrent: {
                type: 'hr',
              },
            },
            {
              icon: 'male',
              setCurrent: {
                type: 'ha',
              },
            },
          ],
        },
      ],
      figure: {},
    }
  },
  async created() {
    this.figuredata = this.loader.resources.figuredata.json
    this.changeTab()
  },
  computed: {
    palettes() {
      return this.currentPartSet.parts
        .reduce((acc, item) => {
          if (
            !['bd', 'lh', 'rh'].includes(item.type) &&
            item.colorable &&
            item.colorindex > 0 &&
            acc.every(a => a.colorindex !== item.colorindex)
          ) {
            acc.push(item)
          }
          return acc
        }, [])
        .map(item => {
          return {
            palette: this.figuredata.palette[this.figuredata.settype[this.current.type].paletteid],
            item,
          }
        })
      return
    },
    currentSet() {
      return this.figuredata.settype[this.current.type].set
    },
    currentPartSet() {
      const part = this.figure[this.current.type] || [Object.keys(this.currentSet)[0]]
      console.log(part, this.currentSet)
      return this.currentSet[part[0]] || {}
    },
  },
  methods: {
    setPartId(id) {
      if (this.figure[this.current.type]) {
        Vue.set(this.figure[this.current.type], 0, id)
      } else {
        Vue.set(this.figure, this.current.type, [id])
      }
    },
    changeTab(tab) {
      tab = tab || this.tabs[0]
      this.currentTab = tab
      this.changeSubTab()
    },
    changeSubTab(tab) {
      tab = tab || this.currentTab.tabs[0]
      this.currentTab.currentTab = this.currentTab.tabs.find(t => t.id === tab.id)
      this.current = Object.assign(this.current, tab.setCurrent)
      this.buildItems()
    },
    async buildItems() {
      if (!(this.current.type in this.figure)) {
        this.figure[this.current.type] = [Object.keys(this.currentSet)[0]]
      }
      this.items = []
      const figuredata = this.loader.resources.figuredata.json
      const set = this.currentSet

      const a = []

      for (const id in set) {
        const item = set[id]
        if (item.gender === 'U' || item.gender === this.current.gender) {
          this.items.push({
            id,
            data: null,
          })
        }
      }

      ;(async () => {
        for (const item of this.items) {
          item.data = await this.avatarImager.wardrobePartItem(
            this.current.type,
            item.id,
            this.figure[this.current.type],
            this.current.geometry.type,
            this.current.geometry.part,
          )
        }
      })()
    },
  },
}
</script>

<style lang="stylus">
.wardrobe {
  &-preview {
    width: 240px;
    flex: 0 auto;
  }

  &-palettes {
    display: flex;

    .oh-palette {
      flex: 1;
      height: 90px;

      & + .oh-palette {
        margin-left: 4px;
      }
    }
  }

  &-items {
    flex: 0 auto;
    height: 200px;
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    grid-gap: 4px;
    padding-right: 4px;

    button {
      border: none;
      border-radius: 4px;
      height: 64px;
      outline: none;
      cursor: pointer;
      border-radius: 50%;
      background: none;

      &:hover {
        background: rgba(#FFF, 25%);
      }

      &.selected {
        border: 3px solid rgba(#FFF, 25%);
        background: rgba(#FFF, 25%);
      }
    }
  }
}
</style>
