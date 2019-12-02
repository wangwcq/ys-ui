<template>
  <component :is="tag">
    <template v-if="getReadonlyType(type)">
      <ui-type-display
          :type="getReadonlyType(type)"
          :data="value"
          :config="config"
      />
    </template>

    <template v-else-if="type === 'password'">
      <ui-input :value="value" type="password" @input="onInput" autocomplete="off" auto-complete="off" show-password />
    </template>

    <template v-else-if="type === 'date'">
      <ui-date-picker
          v-model="value"
          type="date"
          placeholder="请选择日期"
          @input="onInput"
      />
    </template>

    <template v-else-if="type === 'datetime'">
      <ui-datetime-picker
          v-model="value"
          placeholder="请选择时间"
          @input="onInput"
      />
    </template>

    <template v-else-if="type === 'select'">
      <ui-select
          :value="value"
          @input="onInput"
          filterable
          clearable
      >
        <ui-option
            v-for="(option, optionIndex) in config.options"
            :key="optionIndex"
            :label="option"
            :value="option"
        />
      </ui-select>
    </template>

    <template v-else-if="type === 'model'">
      <ui-admin-model-picker
          :value="value"
          @input="onInput"
          :config="config"
      />
    </template>

    <template v-else-if="type === 'text'">
      <ui-input
          type="textarea"
          :rows="3"
          :value="value"
          @input="onInput"
          autocomplete="off"
          :autosize="{ minRows: 3, maxRows: 20 }"
      />
    </template>

    <template v-else>
      <ui-input :value="value" @input="onInput" autocomplete="off" />
    </template>
  </component>
</template>

<script>
  import _ from 'lodash';
  import numeral from 'numeral';
  import moment from 'moment';
  import UiTypeDisplay from "./UiTypeDisplay";
  import UiAdminModelPicker from "./UiAdminModelPicker";

  export default {
    name: "UiTypeEdit",
    components: {UiAdminModelPicker, UiTypeDisplay},
    props: {
      type: { type: String, default: 'string' },
      value: { default: undefined },
      tag: { type: String, default: 'div' },
      config: { type: Object, default: () => ({}) },
      readonly: { type: Boolean, default: false },
    },
    emits: ['input'],
    computed: {
      body() {
        let body = this.data;
        if (_.isUndefined(body)) {
          const { path } = this;
          if (_.isArray(path)) {
            body = _.map(path, thisPath => _.get(this.collection, thisPath)).filter(Boolean).join(' ');
          } else {
            body = _.get(this.collection, path);
          }
        }
        return body;
      },
    },
    methods: {
      formatNumber(number, format = '0,0') {
        return numeral(number).format(format);
      },
      formatMoment(momentStr, format = 'YYYY-MM-DD HH:mm:ss') {
        return moment(momentStr).format(format);
      },
      onInput(ev) {
        this.$emit('input', ev);
      },
      getReadonlyType(type) {
        if (this.readonly || _.startsWith(type, 'readonly__')) {
          return type.replace('readonly__', '');
        }
        return null;
      },
    },
  }
</script>

<style scoped>

</style>
