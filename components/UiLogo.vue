<template>
  <component
      :is="vComponentName"
      :to="linkHome"
      class="ui-logo"
  >
    <img
        v-if="vImage"
        class="ui-logo__image"
        :src="vImage"
        :alt="vText"
    />
  </component>
</template>

<script>
  export default {
    name: "UiLogo",
    props: {
      linkHome: { type: String, default: '/' },
      image: { type: String, default: '' },
      text: { type: String, default: '' },
    },
    computed: {
      vComponentName() {
        return this.linkHome ? 'router-link' : 'div';
      },
      vText() {
        return this.text || this.$getComponentConfig('common', 'appTitle');
      },
      vImage() {
        return this.image || this.$getComponentConfig('common', 'appLogo');
      },
    },
  }
</script>

<style lang="less" scoped>
  .ui-logo {
    display: block;
    &__image {
      width: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
