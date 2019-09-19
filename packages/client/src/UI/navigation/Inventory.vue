<template>
  <div class="inventory">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="mobis">Mobis</px-tab-list-item>
    </px-tab-list>
    <px-tab-container>
      <px-tab-view v-model="tab" name="mobis" class="mobi-list">
        <div v-for="({ mobi, image }, idx) in mobiImages" :key="idx" class="mobi-item">
          <img :src="image" class="mobi-image" />
          <span class="mobi-name">
            {{ mobi.name }}
          </span>
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
    }
  },
  computed: {
    mobiImages () {
      return this.mobis.map(mobi => {
        const sprite = new GameFurniture({ mobi })
        const image = sprite.app.renderer.plugins.extract.image(sprite.sprite).src
        sprite.destroy()
        return {
          mobi,
          image,
        }
      })
    }
  },
  created () {
    MobisApi.getInventory().then(mobis => (this.mobis = mobis))
  }
}
</script>

<style lang="scss" scoped>
.mobi-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  word-break: break-all;
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
.inventory {
  flex: 1;
  display: flex;
  flex-flow: column;
}
</style>
