<template>
  <div
      :class="['ui-placeholder', { block: vBlock, inline }]"
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Placeholder",
    props: {
      block: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
    },
    data() {
      return {
        vBlock: this.block || (!this.inline),
      };
    },
  }
</script>

<style lang="less">
  .ui-placeholder {
    display: none !important;
    background: fadeout(#000, 90);
    border: dashed 2px fadeout(#000, 80);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
    font-size: 0.75em;
    transition: opacity .3s;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
    &.block {
      min-height: 180px;
    }
    &.inline {
      display: inline-block;
      padding: 2px 4px;
      margin: 0 4px;
    }
  }
</style>
