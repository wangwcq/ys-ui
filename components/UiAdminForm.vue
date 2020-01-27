<template>
  <div>
    <ui-form
        :model="model"
        :label-position="labelPosition"
        label-width="150px"
        :size="compact ? 'mini' : 'medium'"
        :inline="compact"
    >
      <ui-flex row wrap>
        <template
            v-for="field in fields"
        >
          <ui-flex
              v-if="field.type !== 'hidden'"
              :style="`flex: 1 0 ${1 / cols * 100}%; padding: 0 ${gutter}px`"
              :key="field.name"
          >
            <template>
              <ui-form-item
                  :label="`${field.title}：`"
              >
                <slot
                    :name="`field__${field.name}`"
                    :type="field.type"
                    :value="model[field.name]"
                    :onInput="value => model[field.name] = value"
                    :afterInput="handleFieldChange"
                    :config="field"
                    :readonly="readonly"
                >
                  <ui-type-edit
                      :type="field.type"
                      v-model="model[field.name]"
                      @input="handleFieldChange"
                      :config="field"
                      :readonly="readonly"
                  />
                </slot>
              </ui-form-item>
            </template>
          </ui-flex>
        </template>
      </ui-flex>

      <div class="ui-admin-form__submit" v-if="withSubmitRow">
        <ui-button
            type="primary"
            icon="el-icon-success"
            @click="() => { $emit('submit'); isDirty = false; }"
            v-if="withSave && isDirty"
        >
          {{ submitButtonText }}
        </ui-button>
        <slot name="editLink" v-bind="{ readonly, compact, disableEditLink, model }">
          <router-link
              v-if="readonly && compact && !disableEditLink && (model.id || id)"
              :to="`${moduleUrl}/edit/${model.id || id}`"
              class="ml"
          >
            <ui-button type="primary" icon="el-icon-delete">
              编辑
            </ui-button>
          </router-link>
        </slot>
        <router-link
            v-if="withDelete && (model.id || id)"
            :to="`${moduleUrl}/delete/${model.id || id}`"
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
      id: { type: String, default: '' },
      model: { type: Object, default: () => ({}) },
      fields: { type: Array, default: () => ([]) },
      moduleUrl: { type: String, default: '/' },
      withDelete: { type: Boolean, default: false },
      cols: { type: Number, default: 1 },
      submitButtonText: { type: String, default: '保存' },
      labelPosition: { type: String, default: 'right' },
      withSave: { type: Boolean, default: true },
      gutter: { type: Number, default: 8 },
      readonly: { type: Boolean, default: false },
      compact: { type: Boolean, default: false },
      disableEditLink: { type: Boolean, default: false },
    },
    data() {
      return {
        isDirty: false,
      };
    },
    computed: {
      withSubmitRow() {
        return this.withSave || this.withDelete;
      },
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
