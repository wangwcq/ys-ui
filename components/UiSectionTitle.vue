<template>
  <div class="ui-section-title">
    <span><slot></slot></span>
  </div>
</template>

<script>
  export default {
    name: "UiSectionTitle"
  }
</script>

<style lang="less" scoped>
  .ui-section-title {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 0 0 4px 0;
    border-bottom: solid 1px #aaa;
    font-size: 18px;
    font-weight: bold;
    &:first-child {
      margin-top: 0;
    }
    &::before {
      content: ' ';
      display: inline-block;
      margin-right: 8px;
      width: 4px;
      height: 1em;
      background: #1A4F95;
      vertical-align: middle;
    }
  }
</style>
