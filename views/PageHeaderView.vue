<template>
  <div>
    <ui-page-header
        v-if="vBreadCrumbs && vBreadCrumbs.length"
        :breadcrumbs="vBreadCrumbs"
        :title="pageTitle"
        no-media
    />
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "PageHeaderView",
    props: {
      moduleName: { type: String, default: '模块' },
      moduleUrl: { type: String, default: '/' },
      pageTitle: { type: String, default: '欢迎' },
      breadcrumbs: { type: Array, default: () => [] },
    },
    data() {
      return {
        vBreadCrumbs: this.breadcrumbs || [
          { title: G().appName, link: '/' },
          { title: `${this.moduleName}管理`, link: this.moduleUrl },
          { title: this.pageTitle },
        ],
      };
    },
  }
</script>
