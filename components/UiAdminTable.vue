<template>
  <div class="ui-admin-table">
    <div class="ui-admin-table__toolbar">
      <component
          :is="vLinkCreate ? 'router-link' : 'a'"
          v-if="withCreate && positionCreate === 'toolbar'"
          :to="vLinkCreate"
          :target="createTarget"
          @click="handleCreate || (() => {})"
      >
        <ui-button size="small" type="primary" icon="el-icon-edit">创建</ui-button>
      </component>
      <ui-button v-if="withRefresh && positionCreate === 'toolbar'" size="small" icon="el-icon-refresh" @click="() => $emit('refresh')" class="ml">刷新</ui-button>
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
      <slot name="table-end"></slot>
      <ui-flex row>
        <ui-flex>
          <component
              :is="vLinkCreate ? 'router-link' : 'a'"
              v-if="withCreate && positionCreate === 'end'"
              :to="vLinkCreate"
              @click="() => handleCreate ? handleCreate() : null"
              :target="createTarget"
          >
            <ui-button style="width: 100%" size="small" type="primary" plain round icon="el-icon-edit">创建</ui-button>
          </component>
        </ui-flex>
        <ui-flex v-if="withRefresh && positionCreate === 'end'" class="ml">
          <ui-button size="small" icon="el-icon-refresh" @click="() => $emit('refresh')">刷新</ui-button>
        </ui-flex>
      </ui-flex>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import UiTypeDisplay from "./UiTypeDisplay";
  export default {
    name: "UiAdminTable",
    components: {UiTypeDisplay},
    props: {
      moduleUrl: { type: String, default: '/home' },
      attributes: { type: Array, default: () => [] },
      data: { type: Array, default: () => [] },
      withCreate: { type: Boolean, default: true },
      createTarget: { type: String, default: '' },
      withActions: { type: Boolean, default: true },
      withRefresh: { type: Boolean, default: false },
      positionCreate: { type: String, default: 'toolbar' }, // toolbar, end
      expandable: { type: Boolean, default: false },
      defaultExpandAll: { type: Boolean, default: false },
      linkCreate: { type: String, default: undefined },
      handleCreate: { type: Function, default: null },
    },
    emits: ['refresh'],
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
      vLinkCreate() {
        if (_.isFunction(this.handleCreate)) {
          return null;
        }
        if (!_.isUndefined(this.linkCreate)) {
          return this.linkCreate;
        }
        return `${this.moduleUrl}/add`;
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
  .el-table__expanded-cell {
    padding: 0;
    .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
      box-shadow: none;
    }
    .el-tabs--border-card {
      box-shadow: none;
    }
  }
}
</style>
