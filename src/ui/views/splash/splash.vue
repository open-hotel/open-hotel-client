<template>
  <div id="splash">
    <div>
      <div class="splash-frame-wrapper">
        <img src="./images/splash_frame_1.png" />
        <img class="splash-frame splash-frame-image" src="./images/splash_image.png" />
        <img class="splash-frame" src="./images/splash_frame_2.png" />
      </div>
      <h2>Siga o pato amarelo</h2>
      <oh-progress :value="75" />
      <h4>75%</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelSplash',
  data() {
    return {}
  },
}
</script>

<style lang="stylus">
#splash {
  width: 100%;
  height: 100%;
  background: #070a0e;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(#FFF, 0.9);
  padding-bottom: 27px;

  h2 {
    margin: 16px 0;
  }

  h4 {
    margin: 8px;
  }

  .splash-frame {
    position: absolute;
    top: 0;
    left: 0;

    &-wrapper {
      position: relative;
    }

    &-image {
      top: 51px;
      left: 95px;
    }
  }
}
</style>