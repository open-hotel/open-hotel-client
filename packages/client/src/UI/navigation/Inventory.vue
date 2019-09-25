<template>
  <div class="inventory">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="mobis">Mobis</px-tab-list-item>
    </px-tab-list>
    <px-tab-container>
      <px-tab-view v-model="tab" name="mobis" class="mobis-tab">
        <div class="mobi-list" @click="selectedMobi = null">
          <div
            v-for="(mobiPayload, idx) in filteredMobis"
            :key="idx"
            :class="{ 'selected-mobi': selectedMobi === mobiPayload }"
            class="mobi-item"
            @click.stop="selectedMobi = mobiPayload"
          >
            <img :src="mobiPayload.image" class="mobi-image" />
            <span class="mobi-name">
              {{ mobiPayload.mobi.name }}
            </span>
          </div>
        </div>
        <div class="inventory-toolbar">
          <px-btn v-if="selectedMobi" @click="addMobi">
            Add
          </px-btn>
        </div>
      </px-tab-view>
    </px-tab-container>
  </div>
</template>

<script>
import MobisApi from '../../api/MobisApi'
import { GameFurniture } from '../../gameobjects/furniture/GameFurniture'

export default {
  data() {
    return {
      tab: 'mobis',
      mobis: [],
      mobiImages: [],
      selectedMobi: null,
    }
  },
  computed: {
    filteredMobis() {
      const { roomMobis } = this.$store.state
      return this.mobiImages.filter(mobi => roomMobis.indexOf(mobi.sprite) === -1)
    },
  },
  created() {
    MobisApi.getInventory().then(mobis => this.setMobis(mobis))
  },
  methods: {
    addMobi() {
      if (!this.selectedMobi) {
        return
      }
      this.$store.dispatch('selectMobi', this.selectedMobi.sprite)
    },
    setMobis(mobis) {
      this.mobis = mobis
      this.mobiImages = mobis.map(mobi => {
        const sprite = new GameFurniture({ mobi })
        const image = sprite.app.renderer.plugins.extract.image(sprite.sprite).src
        return {
          mobi,
          image,
          sprite,
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.mobi-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 8px;
  word-break: break-all;
  background-color: #cbcbcb;
  border-radius: 4px;
  padding: 5px;
  border: 1px solid #000;
  cursor: pointer;
}

.selected-mobi {
  border: 1px dashed #568ba4;
}

.mobi-image {
  width: 20px;
  height: 30px;
}
.mobi-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
}

.mobis-tab {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}

.inventory {
  flex: 1;
  display: flex;
  flex-flow: column;
}

.inventory-toolbar {
  bottom: 5px;
  display: flex;
  flex-direction: row-reverse;
  align-self: flex-end;
}
</style>
