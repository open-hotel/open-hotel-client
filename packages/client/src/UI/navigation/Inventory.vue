<template>
  <div class="inventory">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="mobis">Mobis</px-tab-list-item>
    </px-tab-list>
    <px-tab-container>
      <px-tab-view v-model="tab" name="mobis" class="mobi-list">
        <img src="">
      </px-tab-view>
    </px-tab-container>
  </div>
</template>

<script>
import MobisApi from '../../api/MobisApi'

export default {
  data() {
    return {
      tab: 'mobis',
      mobis: [],
    }
  },
  created () {
    MobisApi.getMobis().then(mobis => (this.mobis = mobis))
  }
}
</script>

<style lang="scss" scoped>
.mobi-list {

}
.inventory {
  flex: 1;
  display: flex;
  flex-flow: column;
}
</style>
