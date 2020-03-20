<template>
  <div class="ui-stage">
    <div class="ui-stage__scroll">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: "UiStage"
  }
</script>

<style lang="less">
.ui-stage {
  padding: 8px 16px;
  box-sizing: border-box;
  &__scroll {
    overflow-x: auto;
    padding: 8px 8px 16px;
  }
  .ui-stage {
    padding-left: 0;
    padding-right: 0;
    margin-left: -8px;
    margin-right: -8px;
  }
}
</style>
