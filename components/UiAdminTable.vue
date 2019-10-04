<template>
  <div>
    <div class="ui-admin-table__toolbar">
      <router-link v-if="withCreate && positionCreate === 'toolbar'" :to="`${moduleUrl}/add`">
        <ui-button size="small" type="primary" icon="el-icon-edit">创建</ui-button>
      </router-link>
    </div>
    <ui-table
        :data="data"
        :default-expand-all="defaultExpandAll"
    >
      <ui-table-column v-if="expandable" type="expand">
        <template slot-scope="scope">
          <slot
              name="column__expand"
              v-bind="scope"
          >
            <ui-admin-form
                :fields="columns"
                :model="scope.row"
                readonly
                :cols="2"
            />
          </slot>
        </template>
      </ui-table-column>
      <ui-table-column
          v-for="col in columns"
          :key="col.name"
          :prop="col.name"
          :label="col.title"
          :width="col.width"
          :min-width="col.minWidth"
          :align="col.align"
      >
        <template slot-scope="scope">
          <slot
              :name="`column_${col.name}`"
              v-bind="scope"
          >
            <div
                v-if="col.name === '_adminActions'"
            >
              <ui-button-group>
                <router-link :to="`${moduleUrl}/edit/${scope.row.id}`">
                  <ui-button size="mini" type="primary" icon="el-icon-edit">编辑</ui-button>
                </router-link>
                <router-link :to="`${moduleUrl}/delete/${scope.row.id}`">
                  <ui-button size="mini" type="info" icon="el-icon-delete">删除</ui-button>
                </router-link>
              </ui-button-group>
            </div>
            <ui-type-display
                v-else-if="col.model"
                :type="col.model.type"
                :collection="scope.row[col.model.alias]"
                :path="col.model.titleFields"
            ></ui-type-display>
            <ui-type-display
                v-else
                :type="col.type"
                :collection="scope.row"
                :path="col.name"
            />
          </slot>
        </template>
      </ui-table-column>
    </ui-table>
    <div class="ui-admin-table__end">
      <router-link v-if="withCreate && positionCreate === 'end'" :to="`${moduleUrl}/add`">
        <ui-button style="width: 100%" size="small" type="primary" plain round icon="el-icon-edit">创建</ui-button>
      </router-link>
    </div>
  </div>
</template>

<script>
  import UiTypeDisplay from "./UiTypeDisplay";
  export default {
    name: "UiAdminTable",
    components: {UiTypeDisplay},
    props: {
      moduleUrl: { type: String, default: '/home' },
      attributes: { type: Array, default: () => [] },
      data: { type: Array, default: () => [] },
      withCreate: { type: Boolean, default: true },
      withActions: { type: Boolean, default: true },
      positionCreate: { type: String, default: 'toolbar' }, // toolbar, end
      expandable: { type: Boolean, default: false },
      defaultExpandAll: { type: Boolean, default: false },
    },
    computed: {
      columns() {
        const cols = [
          ...this.attributes,
        ];
        if (this.withActions) {
          cols.push({
              name: '_adminActions',
              title: '操作',
              width: 180,
              align: 'center',
            },
          );
        }
        return cols;
      },
    },
  }
</script>

<style lang="less">
.ui-admin-table {
  &__toolbar {
    margin-bottom: 15px;
  }
  &__end {
    margin-top: 15px;
  }
}
</style>
