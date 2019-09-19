<template>
  <header class="header">
    <nav class="navbar">
      <h1 class="main-title">
        Open Hotel
      </h1>
      <div class="sign-bar">
        <a href="#">
          Login
        </a>
        <a href="#">
          Sign up
        </a>
      </div>
    </nav>
    <svg class="wave" viewBox="0 0 4096 690.58">
      <path class="wave-path" fill="black" d="M0 0v690.58s365.72 11.77 800.48-160.7c263.68-104.61 593.41 42.08 800.73 27.26 181-12.95 178.54-61.69 347.77-91.17s266.94 7.16 503.74-122.81c172.6-94.74 451.68-314.28 856.62-245.79S4096 109 4096 0z" />
    </svg>
  </header>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
.navbar {
  display: grid;
  grid-template-columns: 1fr .2fr;
}

.sign-bar {
  font-size: 18px;
  font-family: Roboto;
  font-weight: bold;
  & > a {
    text-decoration: none;
    color: #fff;
    &:hover {
      border-bottom: 2px solid #fff;
    }
    &:first-child {
      margin-right: 5px;
    }
  }
}

.header {
  color: $primary;
  text-shadow: $shadow 2px 2px;
}

.wave {
  position: absolute;
  left: 0;
  top: 0;
  width: 150%;
  z-index: -1;
  & > .wave-path {
    fill: $overlay;
  }
}

.main-title {
  z-index: 2;
  font-size: 35px;
}
</style>
