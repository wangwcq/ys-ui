/*
 * Features:
 * - Export all common dependencies
 * - Impl element-ui based UI components
 *
 * Todo:
 * - Add optional server support
 * - Add yarn script to run
 * */
import Vue from 'vue';
import Router from 'vue-router';
import lodash from 'lodash';
import axios from 'axios';
import moment from 'moment-timezone';
import numeral from 'numeral';
import App from './src/components/App.vue';
import mixinWithLoading from './src/mixins/withLoading';
import './src/uiComponents';

import views from './src/views';

Vue.config.productionTip = false;

Vue.use(Router);

Vue.mixin(mixinWithLoading);

const _ = lodash;

window._ = _;
window.axios = axios;

function main(params = {}) {
  const {
    routes = []
  } = params;

  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
      path: '/',
      name: 'app',
      component: App,
      children: routes,
    }, ],
  });

  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}

export {
  Vue,
  lodash,
  axios,
  moment,
  numeral,
  main,
  views,
};