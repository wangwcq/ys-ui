<template>
  <div class="ui-stage">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "UiStage"
  }
</script>

<style lang="less">
.ui-stage {
  padding: 12px 24px;
}
</style>