<template>
  <div class="demo-windows">
    <px-btn
      class="btn-toggle"
      color="danger"
      @click="window.visible = !window.visible"
      >Toggle</px-btn
    >
    <px-window-manager class="windows-ui">
      <px-window v-bind.sync="window">
        <px-tab-list>
          <px-tab-list-item v-model="tab" target="stats"
            >Window Status</px-tab-list-item
          >
          <px-tab-list-item v-model="tab" target="buttons"
            >Buttons</px-tab-list-item
          >
        </px-tab-list>
        <px-tab-container>
          <px-tab-view v-model="tab" name="stats">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in window" :key="key">
                  <td>{{ key }}</td>
                  <td class="center">
                    <input
                      v-if="typeof value === 'string'"
                      v-model="window[key]"
                    />
                    <input
                      v-else-if="typeof value === 'number'"
                      type="number"
                      v-model.number="window[key]"
                    />
                    <input
                      v-else-if="typeof value === 'boolean'"
                      type="checkbox"
                      v-model="window[key]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </px-tab-view>
          <px-tab-view v-model="tab" name="buttons">
            <table>
              <thead>
                <tr>
                  <th>Context</th>
                  <th>Button</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Default</td>
                  <td class="center">
                    <px-btn>Button</px-btn>
                  </td>
                </tr>
                <tr>
                  <td>Success</td>
                  <td class="center">
                    <px-btn color="success">Button</px-btn>
                  </td>
                </tr>
                <tr>
                  <td>Info</td>
                  <td class="center">
                    <px-btn color="info">Button</px-btn>
                  </td>
                </tr>
                <tr>
                  <td>Warning</td>
                  <td class="center">
                    <px-btn color="warning">Button</px-btn>
                  </td>
                </tr>
                <tr>
                  <td>Danger</td>
                  <td class="center">
                    <px-btn color="danger">Button</px-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </px-tab-view>
          <px-tab-view v-model="tab" name="me">
            <h1>Meus</h1>
          </px-tab-view>
          <px-tab-view v-model="tab" name="search">
            <h1>Busca</h1>
          </px-tab-view>
        </px-tab-container>
        <template #footer></template>
      </px-window>
    </px-window-manager>
  </div>
</template>

<style lang="stylus">
.demo-windows {
  height: 100vh;
}

.windows-ui {
  width: 100%;
  height: 100%;
  position: absolute;
}

.center {
  text-align: center;
}

table {
  width: 100%;
}

.btn-toggle {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999999999;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  data() {
    return {
      tab: 'stats',
      window: {
        visible: true,
        titlebar: true,
        resizable: true,
        center: true,
        minimizable: true,
        closeable: true,
        x: 0,
        y: 0,
        width: null,
        height: null,
        minWidth: 128,
        minHeight: 128,
        maxWidth: 800,
        maxHeight: 600
      }
    }
  }
}
</script>
