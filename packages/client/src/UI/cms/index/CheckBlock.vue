<template>
  <div class="sign-block">
    <h2 class="sign-title text-center">
      <slot name="title" />
    </h2>
    <div class="image-link-container">
      <slot name="image-link" />
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
.sign-block {
  color: #444;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-link-container {
  margin-top: 10px;
  /deep/ img {
    width: 300px;
    height: 250px;
    border-radius: 4px;
  }
}
.sign-title {

}
</style>
