<template>
  <div>
    <ui-form :model="model" label-width="150px">
      <ui-form-item
          v-for="field in fields"
          :key="field.name"
          :label="`${field.title}：`"
      >
        <ui-type-edit
            :type="field.type"
            v-model="model[field.name]"
        />
      </ui-form-item>

      <div class="ui-admin-form__submit">
        <ui-button
            type="primary"
            icon="el-icon-edit"
            @click="$emit('submit')">
          保存
        </ui-button>
        <router-link
            v-if="withDelete && model.id"
            :to="`${moduleUrl}/delete/${model.id}`"
            class="ml"
        >
          <ui-button type="info" icon="el-icon-delete">
            删除
          </ui-button>
        </router-link>
      </div>
    </ui-form>
  </div>
</template>

<script>
  import UiTypeEdit from "./UiTypeEdit";

  export default {
    name: "UiAdminForm",
    components: {UiTypeEdit},
    props: {
      model: { type: Object, default: () => ({}) },
      fields: { type: Array, default: () => ([]) },
      moduleUrl: { type: String, default: '/' },
      withDelete: { type: Boolean, default: false },
    },
  }
</script>

<style lang="less">
  .ui-admin-form {
    &__submit {
      margin-top: 15px;
      text-align: center;
    }
  }
  .ml {
    margin-left: 10px;
  }
</style>