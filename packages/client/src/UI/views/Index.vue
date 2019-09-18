<template>
  <div class="cms">
    <cms-header />
    <main class="main">
      <sign-in />
      <sign-up />
    </main>
  </div>
</template>

<script>
import CmsHeader from '../cms/index/Header'
import SignIn from '../cms/index/SignIn'
import SignUp from '../cms/index/SignUp'

export default {
  components: {
    CmsHeader,
    SignIn,
    SignUp,
  }
}
</script>

<style lang="scss" scoped>
.cms {
  display: grid;
  position: absolute;
  height: 100%;
  width: 100%;
  grid-template-rows: 50px 1fr;
  align-content: center;
}
.main {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
