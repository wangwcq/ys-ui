<template>
  <component :is="tag">
    <template v-if="config.model">
      <ui-admin-model-picker :value="body" :config="config" disabled />
    </template>

    <template v-else-if="type === 'number'">
      {{ formatNumber(body) }}
    </template>

    <template v-else-if="type === 'tag' && body">
      <ui-tag>{{ body }}</ui-tag>
    </template>

    <template v-else-if="type === 'tags' && body && body.length">
      <ui-tag v-for="item in body" :key="item" class="mr">{{ item }}</ui-tag>
    </template>

    <template v-else-if="type === 'tags' && body">
      -
    </template>

    <small v-else-if="type === 'datetime'">
      {{ body ? formatMoment(body) : '-' }}
    </small>

    <small v-else-if="type === 'password'">
      ******
    </small>

    <ui-uploads v-else-if="type === 'file'" :value="body" readonly />

    <template v-else>
      {{ body || '-' }}
    </template>
  </component>
</template>

<script>
import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import UiAdminModelPicker from './UiAdminModelPicker';

export default {
  name: 'UiTypeDisplay',
  components: { UiAdminModelPicker },
  props: {
    type: { type: String, default: 'string' },
    collection: { type: [Array, Object], default: () => ({}) },
    path: { type: [String, Array], default: '' },
    data: { default: undefined },
    tag: { type: String, default: 'span' },
    config: { type: Object, default: () => ({}) },
  },
  computed: {
    body() {
      let body = this.data;
      if (_.isUndefined(body)) {
        const { path } = this;
        if (_.isArray(path)) {
          body = _.map(path, (thisPath) => _.get(this.collection, thisPath))
            .filter(Boolean)
            .join(' ');
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
      const m = moment(momentStr);
      if (!m.isValid()) return '-';
      return m.format(format);
    },
  },
};
</script>

<style scoped></style>
