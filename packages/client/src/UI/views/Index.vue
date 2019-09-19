<template>
  <div class="cms">
    <cms-header />
    <main class="main">
      <h2 class="main-description">
        The first <br />
        Open-Source Habbo <br />
        Community
      </h2>
      <section class="checkouts">
        <repo-check />
        <demo-check />
      </section>
    </main>
  </div>
</template>

<script>
import CmsHeader from '../cms/index/Header'
import DemoCheck from '../cms/index/DemoCheck'
import RepoCheck from '../cms/index/RepoCheck'

export default {
  components: {
    CmsHeader,
    DemoCheck,
    RepoCheck,
  },
}
</script>

<style lang="scss" scoped>
.checkouts {
  margin-top: 10%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.cms {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: 100px 1fr;
  align-content: center;
  padding: 30px 200px;
  z-index: -2;
  overflow: auto;
}
.main {
  display: grid;
}
.main-description {
  color: #fff;
  font-size: 40px;
  text-shadow: $shadow 2px 2px;
}
</style>
