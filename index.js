import Vue from 'vue';
import Router from 'vue-router';
import lodash from 'async-dash';
import axios from 'axios';
import moment from 'moment-timezone';
import numeral from 'numeral';

import App from './components/App.vue';
import * as views from './views';

import initUiComponents from './uiComponents';
import initUiMixins from './uiMixins.js';

Vue.config.productionTip = false;

Vue.use(Router);

const _ = lodash;

function main(params = {}) {

  window._ = _;
  window.axios = axios;

  initUiComponents();
  initUiMixins();

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
      children: [
        ...routes,
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
  }).$mount('#app');
}

export {
  Vue,
  _,
  lodash,
  axios,
  moment,
  numeral,
  main,
  views,
};
