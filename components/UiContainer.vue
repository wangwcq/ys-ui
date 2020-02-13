<template>
  <div
      class="ui-container"
      :style="{ maxWidth: vMaxWidth }"
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "UiContainer",
    props: {
      maxWidth: { type: String, default: '' },
    },
    computed: {
      vMaxWidth() {
        return this.maxWidth || this.$getComponentConfig('container', 'maxWidth') || '1100px';
      },
    },
  }
</script>

<style scoped lang="less">
  .ui-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }
</style>
