<template>
  <ui-admin-table
      v-if="data"
      :attributes="attributes"
      :data="data"
      :module-url="moduleUrl"
      position-create="end"
      :with-actions="false"
      :with-create="!noCreate && !createWith"
      expandable
      :default-expand-all="defaultExpandAll"
      :handle-create="vHandleCreate"
      v-bind="$attrs"
  >
    <template slot="column__expand" slot-scope="{ row }">
      <component
          :is="editWith"
          :id="row.id"
          :model="model"
          :module-url="moduleUrl"
          :after-submit="() => { fetchData(); }"
      />
    </template>
    <slot slot="table-end" name="table-end">
      <template v-if="!noCreate && createWith">
        <ui-button style="width: 100%" size="small" type="primary" plain round icon="el-icon-edit" @click="() => dialogCreateVisible = true">{{ createWith.buttonText || '添加绑定' }}</ui-button>
        <ui-dialog
            :title="createWith.buttonText || '添加绑定'"
            :visible.sync="dialogCreateVisible"
            append-to-body
        >
          <component
              :is="createWith.component"
              :model="createWith.model"
              :module-url="createWith.moduleUrl"
              :after-submit="afterCreate"
              :data-default="createWith.dataDefault || {}"
          />
        </ui-dialog>
      </template>
    </slot>
  </ui-admin-table>
</template>

<script>
  import _ from 'lodash';
  import { adminList } from '../mixins';

  export default {
    name: "UiSubList",
    mixins: [adminList],
    props: {
      editWith: { type: Object, default: () => ({}) },
      createWith: { type: Object, default: null },
      defaultExpandAll: { type: Boolean, default: false },
      handleCreate: { type: Function, default: null },
      noCreate: { type: Boolean, default: false },
    },
    data() {
      return {
        dialogCreateVisible: false,
      };
    },
    methods: {
      async vHandleCreate() {
        if (_.isFunction(this.handleCreate)) {
          await this.handleCreate();
        }
        await this.fetchData();
      },
      afterCreate() {
        this.dialogCreateVisible = false;
        this.fetchData();
      },
    },
  }
</script>

<style scoped>

</style>
