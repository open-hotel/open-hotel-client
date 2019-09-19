<template>
  <check-block>
    <template slot="title">
      Check out the Demo
    </template>
    <template slot="image-link">
      <img src="/resources/images/walk_around.gif">
    </template>
  </check-block>
</template>

<script>
import CheckBlock from './CheckBlock'

export default {
  components: {
    CheckBlock,
  }
}
</script>

<style lang="scss" scoped>

</style>
