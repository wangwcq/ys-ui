<template>
  <div>
    <ui-flex row>
      <ui-flex zero v-if="!disabled">
        <ui-button
            icon="el-icon-search"
            @click="dialogTableVisible = true"
        />
      </ui-flex>
      <ui-flex>
        <ui-select
            :value="value"
            @input="onInput"
            filterable
            clearable
            class="ui-admin-model-picker__select"
            :disabled="disabled"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #aaa; font-size: 13px">#{{ item.value }}</span>
          </el-option>
        </ui-select>
      </ui-flex>
    </ui-flex>
    <el-dialog
        :title="`选择${config.title}`"
        :visible.sync="dialogTableVisible"
    >
      <ui-admin-table
          :attributes="tableAttributes"
          :data="tableData"
          :with-create="false"
          :with-actions="false"
      >
        <template slot="column__select" slot-scope="{ row }">
          <ui-radio
              :value="value"
              :label="row.id"
              @input="onSelectFromDialog"
          >
            {{null}}
          </ui-radio>
        </template>
      </ui-admin-table>
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "UiAdminModelPicker",
    props: {
      value: {},
      config: { type: Object, default: () => ({}) },
      disabled: { type: Boolean, default: false },
    },
    emits: ['input'],
    data() {
      return {
        options: [],
        dialogTableVisible: false,
        tableData: [],
        tableAttributes: [],
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      onInput(ev) {
        this.$emit('input', ev);
      },
      onSelectFromDialog(ev) {
        this.onInput(ev);
        this.dialogTableVisible = false;
      },
      async fetchData() {
        let { attributes, list } = await this.withLoading(this.api(`/api/${_.kebabCase(this.config.model.appData.apiName)}/list`))
        this.tableData = [...list];
        list = _.map(list, item => {
          let label = _.map(this.config.model.titleFields, titleField => {
            return _.get(item, titleField);
          }).join(' ');
          return {
            label,
            value: item.id,
          };
        });
        this.options = list;
        this.tableAttributes = [
          {
            name: '_select',
            title: '选择',
            width: 80,
            align: 'center',
          },
          ...attributes,
        ];
      },
    },
  }
</script>

<style lang="less" scoped>
.ui-admin-model-picker__select {
  width: 100%;
}
</style>
