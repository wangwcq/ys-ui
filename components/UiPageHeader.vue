<template>
  <div class="page-header">
    <ui-link @click="goBack" type="primary" v-if="withBack">
      <i class="el-icon-arrow-left" />
      返回
    </ui-link>
    <ui-breadcrumb v-if="breadcrumbs.length && !withBack" class="page-header__breadcrumb">
      <ui-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="index"
          :to="item.link ? { path: item.link } : undefined"
      >
        {{item.title}}
      </ui-breadcrumb-item>
    </ui-breadcrumb>
    <ui-media-box
        :no-media="noMedia"
    >
      <template slot="media">
        <slot name="media"></slot>
      </template>
      <template slot="title">
        <slot name="title">
          {{title}}
        </slot>
      </template>
      <template slot="content"><slot></slot></template>
    </ui-media-box>
  </div>
</template>

<script>
  export default {
    name: "UiPageHeader",
    props: {
      withBack: { type: Boolean, default: false },
      breadcrumbs: { type: Array, default: () => [] },
      title: { type: String, default: '' },
      noMedia: { type: Boolean, default: false },
    },
    methods: {
      goBack() {
        this.$router.back();
      },
    },
  }
</script>

<style lang="less">
  .page-header {
    background: url('./page-header.png') no-repeat right bottom;
    background-size: cover;
    min-height: 150px;
    padding: 12px 24px;
    box-sizing: border-box;
    border-bottom: solid 1px #E9E9E9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    &__breadcrumb {
      margin-bottom: 16px;
    }
  }
</style>