<template>
  <div class="media-box">
    <slot name="media-box">
      <div class="media-box__media" v-if="!noMedia">
        <slot name="media" />
      </div>
    </slot>
    <div class="media-box__body">
      <slot name="media-title">
        <div class="media-box__title">
          <slot name="title"></slot>
        </div>
      </slot>
      <slot name="media-content">
        <div class="media-box__content">
          <slot />
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiMediaBox',
  props: {
    noMedia: { type: Boolean, default: false },
  },
};
</script>

<style lang="less">
.media-box {
  display: flex;
  flex-direction: row;
  font-size: 14px;
  &__media {
    margin-right: 24px;
    flex: 0 0 auto;
  }
  &__body {
    flex: 1 0 auto;
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
