import Vue from 'vue';
import Router from 'vue-router';
import lodash from 'async-dash';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import globalData from './mixins/globalData';

import App from './components/App.vue';
import * as views from './views';

import initUiComponents from './uiComponents';
import initUiMixins from './uiMixins.js';

Vue.config.productionTip = false;

Vue.use(Router);

const _ = lodash;

/**
 * @typedef {Object} RouteItem
 * @property {string} path
 * @property {string} name
 * @property {Object} component
 * @property {RouteItem[]} children
 */

/**
 * @param params
 * @param {RouteItem[]} params.routes
 * @param {ComponentsConfig} params.componentsConfig
 * @param {Object} params.store
 */
function main(uParams = {}) {
  const params = {
    extVue: {},
    routerMode: 'history',
    ...uParams,
  };
  window._ = _;
  window.axios = axios;

  initUiComponents(Vue, {
    componentsConfig: params.componentsConfig || {},
  });
  initUiMixins();

  const router = new Router({
    mode: params.routerMode,
    base: process.env.BASE_URL,
    routes: [{
      path: '/',
      component: App,
      children: [
        ...(params.routes || []),
        {
          path: '*',
          name: 'Miss',
          component: views.ErrorView,
        },
      ],
    }, ],
  });

  new Vue({
    router,
    render: h => h(App),
    store: params.store,
    ...params.extVue,
  }).$mount('#app');
}

const G = globalData.methods.G;

const formatPrice = (value, format = '0,0.00') => numeral(value).format(format);

const formatDateTime = (value, format = 'YYYY-MM-DD HH:mm:ss') => moment(value).format(format);

const containsText = (text, keyword) => {
  return String(text).toLowerCase().indexOf(String(keyword).toLowerCase()) !== -1;
};

const flattenedValues = (obj) => {
  if (typeof obj !== "object") { return obj; }
  return _.flattenDeep(_.map(obj, item => flattenedValues(item)));
};

export {
  Vue,
  _,
  lodash,
  axios,
  moment,
  numeral,
  main,
  views,
  G,

  formatPrice,
  formatDateTime,

  containsText,
  flattenedValues,
};
