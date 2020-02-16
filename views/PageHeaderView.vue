<template>
  <div>
    <ui-page-header
        v-if="vBreadCrumbs && vBreadCrumbs.length"
        :breadcrumbs="vBreadCrumbs"
        :title="pageTitle"
        no-media
    />
    <router-view :key="$route.path" />
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "PageHeaderView",
    props: {
      moduleName: { type: String, default: '模块' },
      moduleUrl: { type: String, default: '/' },
      pageTitle: { type: String, default: '欢迎' },
      breadcrumbs: { type: Array, default: () => [] },
    },
    computed: {
      vBreadCrumbs() {
        return !_.isEmpty(this.breadcrumbs) ? this.breadcrumbs : [
          {title: this.G().appName, link: '/'},
          {title: `${this.moduleName}管理`, link: this.moduleUrl},
          {title: this.pageTitle},
        ];
      },
    },
    mounted() {
      document.title = `${this.pageTitle} - ${this.$getComponentConfig('common', 'appName')}`;
    },
  }
</script>
