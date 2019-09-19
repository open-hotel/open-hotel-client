<template>
  <check-block>
    <template slot="title">
      Check out the Repository
    </template>
    <template slot="image-link">
      <a target="_blank" href="https://github.com/open-hotel/open-hotel-client">
        <img src="/img/github-logo.svg" />
      </a>
    </template>
  </check-block>
</template>

<script>
import CheckBlock from './CheckBlock'

export default {
  components: {
    CheckBlock,
  },
}
</script>

<style lang="scss" scoped></style>
