<template>
  <div class="ui-admin-table">
    <ui-flex row class="ui-admin-table__toolbar">
      <ui-flex>
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
      </ui-flex>
      <ui-flex zero v-if="withSearch">
        <ui-input clearable v-model="searchKeyword" placeholder="输入关键词搜索" />
      </ui-flex>
    </ui-flex>
    <ui-table
        :data="filteredData"
        :default-expand-all="defaultExpandAll"
        :show-header="showHeader"
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
      <template
          v-for="col in columns"
      >
        <ui-table-column
            :key="col.name"
            v-if="col.type !== 'hidden'"
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
              <template v-if="col.type === 'hidden'" />
              <div
                  v-else-if="col.name === '_adminActions'"
              >
                <ui-button-group>
                  <router-link :to="`${moduleUrl}/edit/${scope.row.id}`">
                    <ui-button size="mini" type="primary" icon="el-icon-edit">编辑</ui-button>
                  </router-link>
                  <router-link :to="`${moduleUrl}/delete/${scope.row.id}?backUrl=${encodeURIComponent($route.fullPath)}`">
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
      </template>
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
        <slot name="end" />
      </ui-flex>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import UiTypeDisplay from "./UiTypeDisplay";
  import {containsText, flattenedValues} from "../index";

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
      withSearch: { type: Boolean, default: true },
      positionCreate: { type: String, default: 'toolbar' }, // toolbar, end
      expandable: { type: Boolean, default: false },
      defaultExpandAll: { type: Boolean, default: false },
      linkCreate: { type: String, default: undefined },
      handleCreate: { type: Function, default: null },
      showHeader: { type: Boolean, default: true },
    },
    emits: ['refresh'],
    data() {
      return {
        searchKeyword: '',
      };
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
      vLinkCreate() {
        if (_.isFunction(this.handleCreate)) {
          return null;
        }
        if (!_.isUndefined(this.linkCreate)) {
          return this.linkCreate;
        }
        return `${this.moduleUrl}/add`;
      },
      filteredData() {
        return _.filter(this.data, row => {
          return containsText(flattenedValues(row).join(' '), this.searchKeyword);
        });
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
