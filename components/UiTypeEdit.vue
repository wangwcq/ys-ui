<template>
  <component :is="tag">
    <template v-if="getReadonlyType(type)">
      <ui-type-display
          :type="getReadonlyType(type)"
          :data="value"
      />
    </template>

    <template v-else-if="type === 'password'">
      <ui-input :value="value" type="password" @input="onInput" />
    </template>

    <template v-else-if="type === 'model'">
      <ui-admin-model-picker
          :value="value"
          @input="onInput"
          :config="config"
      />
    </template>

    <template v-else>
      <ui-input :value="value" @input="onInput" />
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
        if (_.startsWith(type, 'readonly__')) {
          return type.replace('readonly__', '');
        }
        return null;
      },
    },
  }
</script>

<style scoped>

</style>