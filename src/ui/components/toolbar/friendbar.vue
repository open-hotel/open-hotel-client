<template>
  <div class="oh-friend-list">
    <div
      v-for="i in 3"
      :key="i"
      :class="['oh-friend-list-item', {'oh-friend-list-item-user': i < 3}]"
    >
      <div class="oh-frient-list-item-image">
        <img v-if="i < 3" src="./head.png" />
        <img v-else src="./friend_list_icon_add.png" />
      </div>
      <span v-if="i < 3">Friend{{i}}</span>
      <span v-else>Novos amigos</span>
    </div>
  </div>
</template>

<style lang="stylus">
.oh-friend-list {
  display: flex;
  margin-top: 1px;
  margin-left: 38px;
  line-height: 14px;

  &-item {
    display: flex;
    background: #549daf;
    width: 127px;
    height: 35px;
    border-radius: 6px;
    padding: 4px 10px 4px 4px;
    margin-left: 3px;
    box-shadow: inset 0 0 0 2px #73daf9, 0 1px #000;
    font-size: 12px;
    font-family: 'Ubuntu', Arial, 'Helvetica Neue', Helvetica, sans-serif;
    font-weight: bolder;
    color: rgba(#FFF, 0.98);
    align-items: center;
    cursor: pointer;
    border: 1px solid #000;

    img {
      flex: 0 auto;
      margin-top: -3px;
      margin-right: 2px;
    }

    span {
      flex: 1;
      margin-top: 2px;
    }

    &:hover {
      box-shadow: inset 0 0 0 2px #90e0f8, 0 1px #000;
      background: #69a1af;
    }

    &-user {
      background: #72893f;
      box-shadow: inset 0 0 0 2px #9cbe59, 0 1px #000;

      img {
        width: 32px;
        height: 32px;
        object-fit: fill;
        margin-left: -3px;
        margin-top: 2px;
        margin-right: 4px;
        image-rendering: pixelated;
      }

      span {
        margin: 0;
      }

      &:hover {
        box-shadow: inset 0 0 0 2px #d2f693, 0 1px #000;
        background: #99b168;
      }
    }
  }
}
</style>