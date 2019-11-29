<template>
  <el-select
      :value="value"
      @input="onInput"
      filterable
      clearable
      v-bind="$attrs"
  >
    <ui-option
        v-for="(option, optionIndex) in vOptions"
        :key="optionIndex"
        :label="option.title"
        :value="option.value"
    >
      <span style="float: left">{{ option.title }}</span>
      <span style="float: right; color: #aaa; font-size: 13px">{{ option.extra }}</span>
    </ui-option>
  </el-select>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "UiDataSelect",
    props: {
      value: {},
      options: { type: [Array, Object] },
    },
    emits: ['input'],
    computed: {
      vOptions() {
        if (_.isArray(this.options)) {
          return _.map(this.options, (option, optionIndex) => {
            if (_.isObject(option)) {
              return option;
            }
            return {
              value: option,
              title: option,
            };
          });
        }
        return _.map(this.options, (title, value) => {
          return {
            value,
            title,
          };
        });
      },
    },
    methods: {
      onInput(ev) {
        this.$emit('input', ev);
      },
    },
  }
</script>

<style scoped>

</style>
