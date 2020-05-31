<template>
  <div style="padding: 1em; width: 100%">
    <fieldset>
      <legend>Rosto e corpo</legend>
      <button @click="geometry = 'vertical.head'; type = 'hd'">Rosto</button>
      <button @click="gender = 'M'">Menino</button>
      <button @click="gender = 'F'">Menina</button>
    </fieldset>
    <fieldset>
      <legend>Cabeça</legend>
      <button @click="geometry = 'vertical.head'; type = 'hr'">Cabelo</button>
      <button @click="geometry = 'vertical.head'; type = 'ha'">Chapeu</button>
      <button @click="geometry = 'vertical.head'; type = 'he'">Acessórios</button>
      <button @click="geometry = 'vertical.head'; type = 'ea'">Óculos</button>
      <button @click="geometry = 'vertical.head'; type = 'fa'">Acessórios de rosto</button>
    </fieldset>
    <fieldset>
      <legend>Torso</legend>
      <button @click="geometry = 'vertical.torso'; type = 'ch'">Camisa</button>
      <button @click="geometry = 'vertical.torso'; type = 'cc'">Jaqueta</button>
      <button @click="geometry = 'vertical.torso'; type = 'cp'">Estampa</button>
      <button @click="geometry = 'vertical.torso'; type = 'ca'">Pescoço</button>
    </fieldset>
    <fieldset>
      <legend>Pernas</legend>
      <button @click="geometry = 'vertical.torso'; type = 'lg'">Calças</button>
      <button @click="geometry = 'vertical.torso'; type = 'sh'">Sapatos</button>
      <button @click="geometry = 'vertical.torso'; type = 'wa'">Cinto</button>
    </fieldset>
    <oh-picker v-model="figure" :type="type" :gender="gender" :geometry="geometry" />
  </div>
</template>

<script>
import Vue from 'vue'
import OhPalette from './palette'
import { Loader } from '../../engine/loader'
import { ApplicationProvider } from '../../game/pixi/application.provider'
import { Sprite } from 'pixi.js-legacy'
import { HumanImager } from '../../game/imager/human.imager'
import { ImagerModule } from '../../game/imager/imager.module'
import OhPicker from './picker.vue'

export default {
  components: {
    OhPalette,
    OhPicker,
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
      type: 'hr',
      gender: 'M',
      geometry: 'vertical.head',
      figure: {
        hd: {
          id: '180',
          colors: [],
        },
      },
    }
  },
  computed: {},
  methods: {},
}
</script>
