<template>
  <check-block>
    <template slot="title">
      Check out the Repository
    </template>
    <template slot="image-link">
      <img src="/img/github-logo.svg">
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
