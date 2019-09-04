<template>
  <div class="media-box">
    <div class="media-box__media" v-if="!noMedia">
      <slot name="media" />
    </div>
    <div class="media-box__body">
      <div class="media-box__title">
        <slot name="title"></slot>
      </div>
      <div class="media-box__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UiMediaBox",
    props: {
      noMedia: { type: Boolean, default: false },
    },
  }
</script>

<style lang="less">
.media-box {
  display: flex;
  flex-direction: row;
  font-size: 14px;
  &__media {
    margin-right: 24px;
  }
  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__title {
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
    margin-bottom: 12px;
  }
}
</style>