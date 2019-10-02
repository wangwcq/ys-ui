<template>
  <div>
    <ui-form :model="model" label-width="150px">
      <ui-flex row wrap>
        <ui-flex
            :style="`flex: 1 0 ${1 / cols * 100}%;`"
            v-for="field in fields"
            :key="field.name"
        >
          <ui-form-item
              :label="`${field.title}：`"
          >
            <ui-type-edit
                :type="field.type"
                v-model="model[field.name]"
                @input="handleFieldChange"
                :config="field"
            />
          </ui-form-item>
        </ui-flex>
      </ui-flex>

      <div class="ui-admin-form__submit">
        <ui-button
            type="primary"
            icon="el-icon-edit"
            @click="() => { $emit('submit'); isDirty = false; }"
            v-if="isDirty"
        >
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
      cols: { type: Number, default: 1 },
    },
    data() {
      return {
        isDirty: false,
      };
    },
    methods: {
      handleFieldChange() {
        this.isDirty = true;
      },
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
