<template>
  <div class="oh-wardrobe">
    <px-tab-list>
      <px-tab-list-item v-model="tab" target="face">Rosto</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="head">Cabeça</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="torso">Torso</px-tab-list-item>
      <px-tab-list-item v-model="tab" target="lower">Pernas</px-tab-list-item>
    </px-tab-list>
    <div class="row">
      <px-tab-container class="column oh-wardrobe-tabs">
        <px-tab-view v-model="tab" class="oh-wardrobe-tab" name="face">
          <div class="oh-wardrobe-tab-parts">
            <wd-button name="male" :active="gender === 'M'" @click="gender = 'M'">Menino</wd-button>
            <wd-button name="female" :active="gender === 'F'" @click="gender = 'F'">Menina</wd-button>
          </div>
          <oh-picker v-model="figure" type="hd" :gender="gender" geometry="vertical.head" />
        </px-tab-view>
        <px-tab-view v-model="tab" class="oh-wardrobe-tab" name="head">
          <div class="oh-wardrobe-tab-parts">
            <wd-button
              v-for="v in buttons.head"
              :key="v"
              :name="v"
              :active="type === v"
              @click="type = v"
            ></wd-button>
          </div>
          <oh-picker v-model="figure" :type="type" :gender="gender" geometry="vertical.head" />
        </px-tab-view>
        <px-tab-view v-model="tab" class="oh-wardrobe-tab" name="torso">
          <div class="oh-wardrobe-tab-parts">
            <wd-button
              v-for="v in buttons.torso"
              :key="v"
              :name="v"
              :active="type === v"
              @click="type = v"
            ></wd-button>
          </div>
          <oh-picker v-model="figure" :type="type" :gender="gender" geometry="vertical.torso" />
        </px-tab-view>
        <px-tab-view v-model="tab" class="oh-wardrobe-tab" name="lower">
          <div class="oh-wardrobe-tab-parts">
            <wd-button
              v-for="v in buttons.lower"
              :key="v"
              :name="v"
              :active="type === v"
              @click="type = v"
            ></wd-button>
          </div>
          <oh-picker v-model="figure" :type="type" :gender="gender" geometry="vertical.torso" />
        </px-tab-view>
      </px-tab-container>
      <div class="column oh-wardrobe-preview">
        <pre>{{ encodedFigure }}</pre>
      </div>
      <div class="column oh-wardrobe-looks"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import OhPalette from './palette'
import WdButton from './part-button'
import { Loader } from '../../engine/loader'
import { ApplicationProvider } from '../../game/pixi/application.provider'
import { Sprite } from 'pixi.js-legacy'
import { HumanImager } from '../../game/imager/human.imager'
import { ImagerModule } from '../../game/imager/imager.module'
import OhPicker from './picker.vue'
import { Figure } from '../../game/imager/human/figure.util'

export default {
  components: {
    OhPalette,
    OhPicker,
    WdButton,
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
      tab: 'face',
      type: 'hr',
      gender: 'M',
      geometry: 'vertical.head',
      buttons: {
        head: ['hr', 'ha', 'he', 'ea', 'fa'],
        torso: ['ch', 'cc', 'cp', 'ca'],
        lower: ['lg', 'sh', 'wa'],
      },
      figure: {
        hd: {
          id: '180',
          colors: [],
        },
      },
    }
  },
  computed: {
    encodedFigure () {
      return Figure.encode(this.figure)
    }
  },
  methods: {},
}
</script>
<style lang="stylus">
.oh-wardrobe {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;

  .px-tab-list {
    flex: 0 auto;
  }

  .row {
    flex: 1;
    display: flex;
    overflow: hidden;
    padding: 8px;

    .column + .column {
      margin-left: 8px;
    }
  }

  &-preview {
    width: 210px;
    background: red;
  }

  &-looks {
    width: 128px;
    background: blue;
  }

  .oh-part-picker {
    flex: 1;
    width: 100%;
    overflow: hidden;
  }

  &-tabs {
    width: 100%;
    height: 100%;
    background: none;
  }

  &-tab {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    &-parts {
      flex: 0 auto;
      display: flex;
      align-items: center;

      .oh-wardrobe-button {
        color: #FFF;
      }
    }
  }
}
</style>