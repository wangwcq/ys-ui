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
        <template
            v-if="disabled"
        >
          {{ displayValue || '...' }}
        </template>
        <ui-select
            v-else
            :value="value"
            @input="onInput"
            filterable
            clearable
            multiple
            class="ui-admin-model-picker__select"
        >
          <ui-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #aaa; font-size: 13px">#{{ item.value }}</span>
          </ui-option>
        </ui-select>
      </ui-flex>
    </ui-flex>
    <ui-dialog
        :title="`选择${config.title}`"
        :visible.sync="dialogTableVisible"
        append-to-body
    >
      <ui-checkbox-group
          :value="value"
          @input="onSelectFromDialog"
      >
        <ui-admin-table
            :attributes="tableAttributes"
            :data="tableData"
            :model="config.model.appData.apiName"
            :module-url="`/${config.model.appData.apiName}`"
            :with-actions="false"
            create-target="_blank"
            with-refresh
            @refresh="fetchData"
        >
          <template slot="column__select" slot-scope="{ row }">
            <ui-checkbox
                :label="row.id"
            >
              {{null}}
            </ui-checkbox>
            <ui-link
                v-if="!config.hideView"
                target="_blank"
                :href="`/${config.model.appData.apiName}/edit/${row.id}`"
            >查看</ui-link>
          </template>
        </ui-admin-table>
      </ui-checkbox-group>
      <ui-flex row center>
        <ui-button class="primary" @click="handleSubmit">保存</ui-button>
      </ui-flex>
    </ui-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "UiAdminModelListInput",
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
        displayValue: '',
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
        const selectedOption = _.find(list, item => item.value == this.value);
        this.displayValue = _.get(selectedOption, 'label', '-');
        this.tableAttributes = [
          {
            name: '_select',
            title: '选择',
            width: !this.config.hideView ? 110 : 80,
            align: 'left',
          },
          ...attributes,
        ];
      },
      handleSubmit() {
        this.dialogTableVisible = false;
      },
    },
  }
</script>

<style lang="less" scoped>
.ui-admin-model-picker__select {
  width: 100%;
}
</style>
