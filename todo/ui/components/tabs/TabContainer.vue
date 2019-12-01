<template>
  <div class="px-tab-container">
    <slot />
  </div>
</template>

<style lang="stylus">
.px-tab-container {
  flex: 1;
  display: block;
  border: 1px solid #000;
  background: #ffffff;
  position: relative;
  overflow-y: auto;
  height: 100%;
}
</style>
