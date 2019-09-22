<template>
  <check-block>
    <template slot="title">
      Check out the Demo
    </template>
    <template slot="image-link">
      <router-link :to="{ name: 'demo' }">
        <img src="/resources/images/walk_around.gif" />
      </router-link>
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
